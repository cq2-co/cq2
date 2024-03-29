"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  MessageSquareQuote,
  MessageSquareText,
  MessageSquareShare,
  ArrowUp,
  ArrowRight,
} from "lucide-react";
import ContentWithHighlight from "./content-with-highlight";
import { Button } from "@/components/ui/button";
import {
  useDiscussionStore,
  useDiscussionOpenThreadsStore,
  useDiscussionCurrentHighlightsStore,
} from "@/state";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { satoshi } from "@/app/fonts";
import {
  getNewDiscussionOpenThreads,
  getNewDiscussionCurrentHighlights,
} from "@/lib/utils";
import { find } from "lodash";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const ChildThread = ({ threadID }) => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
  const { discussionCurrentHighlights, setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();

  const [wasNewCommentAdded, setWasNewCommentAdded] = useState(false);

  const [isNewThreadPopupOpen, setIsNewThreadPopupOpen] = useState(
    Array(discussion.comments.length).fill(false),
  );

  const [newThreadPopupCoords, setNewThreadPopupCoords] = useState({});

  const newThreadPopupRef = useRef([]);

  const pathname = usePathname();

  const [userName, setUserName] = useState("");
  const [showUserNameDialog, setShowUserNameDialog] = useState(false);

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

    setUserName(value);
  };

  const [cq2UserName, setCq2UserName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cq2UserName")) {
        setCq2UserName(localStorage.getItem("cq2UserName"));
      }
    }
  }, [setCq2UserName]);

  const NoNewLine = Extension.create({
    name: "no_new_line",

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("eventHandler"),
          props: {
            handleKeyDown: (view, event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                emitCustomEvent("enter-key-tiptap");
                return true;
              }
            },
          },
        }),
      ];
    },
  });

  useEffect(() => {
    setTimeout(() => {
      document
        .getElementById("discussions-threads-scrollable-container")
        .scrollTo({
          left: 999999,
          behavior: "smooth",
        });
    }, 25);
  }, [discussionOpenThreads]);

  useEffect(() => {
    if (document.getElementById(`child-thread-${threadID}`).scrollTop === 1) {
      setTimeout(() => {
        document.getElementById(`child-thread-${threadID}`).scrollTo({
          top: 999999,
          behavior: "smooth",
        });
      }, 25);
    }
  });

  const thread = discussion.threads.filter(
    (thread) => thread.thread_id === threadID,
  )[0];

  const handleCommentWholeInNewThread = (comment) => {
    const text = comment.content;

    const newThreadID = discussion.threads.length + 1;

    let newThreads = [].concat(discussion.threads, {
      thread_id: newThreadID,
      parent_thread_id: threadID,
      quote: text,
      quote_by: comment.user_name,
      comments: [],
    });

    const newComment = { ...comment, whole_to_thread_id: newThreadID };

    const newThreadComments = thread.comments.filter(
      (_comment) => _comment.comment_id !== comment.comment_id,
    );
    newThreadComments.push(newComment);
    newThreadComments.sort((a, b) => a.comment_id - b.comment_id);

    const newThread = { ...thread, comments: newThreadComments };

    newThreads = newThreads.filter((thread) => thread.thread_id !== threadID);
    newThreads.push(newThread);

    const newDiscussion = {
      ...discussion,
      threads: newThreads,
    };

    updateDiscussion(newDiscussion);
    setNewDiscussion(newDiscussion);

    let newOpenThreads = discussionOpenThreads.filter(
      (thread_id) => thread_id <= threadID,
    );
    newOpenThreads.push(newThreadID);
    setNewDiscussionOpenThreads(newOpenThreads);

    const newHighlightToAdd = {
      highlight_id: -1,
      offset: -1,
      length: -1,
      from_thread_id: threadID,
      to_thread_id: newThreadID,
    };
    let newCurrentHighlights = [];
    newCurrentHighlights = discussionCurrentHighlights.filter(
      (highlight) =>
        highlight.from_thread_id < newHighlightToAdd.from_thread_id,
    );
    newCurrentHighlights.push(newHighlightToAdd);
    setNewDiscussionCurrentHighlights(newCurrentHighlights);
  };

  const handleCommentInNewThread = (comment) => {
    const text = window.getSelection()?.toString();

    if (!text) {
      return;
    }

    let len = 0;

    for (const node of window.getSelection()?.anchorNode?.parentElement
      ?.childNodes) {
      if (node == window.getSelection()?.anchorNode) {
        break;
      }
      len += node.textContent.length;
    }

    const offset =
      window.getSelection()?.anchorOffset < window.getSelection()?.focusOffset
        ? window.getSelection()?.anchorOffset
        : window.getSelection()?.focusOffset;

    const newOffset = offset + len;
    const textLen = text.length;

    const newThreadID = discussion.threads.length + 1;

    let newThreads = [].concat(discussion.threads, {
      thread_id: newThreadID,
      parent_thread_id: threadID,
      quote: text,
      quote_by: comment.user_name,
      comments: [],
    });

    const newHighlightToAdd = {
      highlight_id: comment.highlights.length,
      offset: newOffset,
      length: textLen,
      from_thread_id: threadID,
      to_thread_id: newThreadID,
    };

    const newHighlights = [].concat(comment.highlights, newHighlightToAdd);

    const newComment = { ...comment, highlights: newHighlights };

    const newThreadComments = thread.comments.filter(
      (_comment) => _comment.comment_id !== comment.comment_id,
    );
    newThreadComments.push(newComment);
    newThreadComments.sort((a, b) => a.comment_id - b.comment_id);

    const newThread = { ...thread, comments: newThreadComments };

    newThreads = newThreads.filter((thread) => thread.thread_id !== threadID);
    newThreads.push(newThread);

    const newDiscussion = {
      ...discussion,
      threads: newThreads,
    };

    updateDiscussion(newDiscussion);
    setNewDiscussion(newDiscussion);

    window.getSelection().empty();

    setIsNewThreadPopupOpen(Array(discussion.comments.length).fill(false));

    let newOpenThreads = discussionOpenThreads.filter(
      (thread_id) => thread_id <= threadID,
    );
    newOpenThreads.push(newThreadID);
    setNewDiscussionOpenThreads(newOpenThreads);

    let newCurrentHighlights = [];
    newCurrentHighlights = discussionCurrentHighlights.filter(
      (highlight) =>
        highlight.from_thread_id < newHighlightToAdd.from_thread_id,
    );
    newCurrentHighlights.push(newHighlightToAdd);
    setNewDiscussionCurrentHighlights(newCurrentHighlights);
  };

  const handleCommentInThread = () => {
    const text = editor.getText();

    if (!text) {
      return;
    }

    if (!cq2UserName) {
      if (!userName) {
        setShowUserNameDialog(true);
        return;
      } else {
        localStorage.setItem("cq2UserName", userName);
        setShowUserNameDialog(false);
      }
    }

    const newThreadComments = [].concat(thread.comments, {
      comment_id: thread.comments.length,
      user_name: cq2UserName || userName,
      content: text,
      created_on: Date.now(),
      highlights: [],
      whole_to_thread_id: -1,
    });
    const newThread = { ...thread, comments: newThreadComments };

    const newThreads = discussion.threads.filter(
      (thread) => thread.thread_id !== threadID,
    );
    newThreads.push(newThread);

    const newDiscussion = { ...discussion, threads: newThreads };

    updateDiscussion(newDiscussion);
    setNewDiscussion(newDiscussion);

    editor.commands.clearContent();

    setWasNewCommentAdded(true);

    if (typeof window !== "undefined") {
      const cq2CommentedDiscussions = localStorage.getItem(
        "cq2CommentedDiscussions",
      );

      if (!cq2CommentedDiscussions) {
        const initCq2CommentedDiscussions = {
          discussions: [
            {
              _id: discussion._id,
              title: discussion.title,
              user_name: discussion.user_name,
              created_on: discussion.created_on,
            },
          ],
        };

        localStorage.setItem(
          "cq2CommentedDiscussions",
          JSON.stringify(initCq2CommentedDiscussions),
        );
      } else {
        let cq2CommentedDiscussionsJSON = JSON.parse(cq2CommentedDiscussions);

        if (
          !cq2CommentedDiscussionsJSON.discussions.some(
            (discussion) => discussion["_id"] === discussion._id,
          )
        ) {
          cq2CommentedDiscussionsJSON.discussions.push({
            _id: discussion._id,
            title: discussion.title,
            user_name: discussion.user_name,
            created_on: discussion.created_on,
          });

          localStorage.setItem(
            "cq2CommentedDiscussions",
            JSON.stringify(cq2CommentedDiscussionsJSON),
          );
        }
      }
    }

    setTimeout(() => {
      document.getElementById(`child-thread-${threadID}`).scrollTo({
        top: 999999,
        behavior: "smooth",
      });
    }, 25);
  };

  const updateDiscussion = async (discussion) => {
    if (pathname.includes("/demo")) {
      return;
    }

    try {
      const res = await fetch("/api/discussions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discussion),
      });

      if (!res.ok) {
        toast.error("Please try again later.");
        return;
      }
    } catch (error) {
      toast.error("Please try again later.");
    }
  };

  useCustomEventListener("enter-key-tiptap", handleCommentInThread);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a message...",
      }),
      CharacterCount.configure({
        limit: 4000,
      }),
      NoNewLine,
    ],
    autofocus: true,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  const handleMousedownToHideNewThreadPopup = (e: MouseEvent) => {
    const idxOfOpenNewThreadPopup = isNewThreadPopupOpen.findIndex(
      (x) => x === true,
    );

    if (
      newThreadPopupRef.current[idxOfOpenNewThreadPopup] &&
      !e
        .composedPath()
        .includes(newThreadPopupRef.current[idxOfOpenNewThreadPopup])
    ) {
      window.getSelection().empty();

      setIsNewThreadPopupOpen(Array(discussion.comments.length).fill(false));
    }
  };

  useEffect(() => {
    if (isNewThreadPopupOpen.every((v) => v === false)) return;

    document.body.addEventListener(
      "mousedown",
      handleMousedownToHideNewThreadPopup,
    );
    return () => {
      document.body.removeEventListener(
        "mousedown",
        handleMousedownToHideNewThreadPopup,
      );
    };
  });

  const showNewThreadPopup = (e, id) => {
    const text = window.getSelection()?.toString();

    if (!text) {
      return;
    }

    const bounds = e.target.getBoundingClientRect();

    setNewThreadPopupCoords({
      x: e.clientX - bounds.left + 35,
      y: e.clientY - bounds.top + 65,
    });

    const newIsNewThreadPopupOpen = isNewThreadPopupOpen;
    newIsNewThreadPopupOpen[id] = true;
    setIsNewThreadPopupOpen(newIsNewThreadPopupOpen);
  };

  const handleOpenWholeCommentThread = (comment) => {
    setNewDiscussionOpenThreads(
      getNewDiscussionOpenThreads(comment.whole_to_thread_id, discussion),
    );
    setNewDiscussionCurrentHighlights(
      getNewDiscussionCurrentHighlights(
        {
          highlight_id: -1,
          offset: -1,
          length: -1,
          from_thread_id: threadID,
          to_thread_id: comment.whole_to_thread_id,
        },
        discussionCurrentHighlights,
      ),
    );
  };

  return (
    <div className="discussion-child-thread flex h-full w-[calc((100vw)/2)] flex-col gap-5 rounded-none border-r border-neutral-200 bg-[#FFFFFF] shadow-none 2xl:w-[48.5rem]">
      <div
        id={`child-thread-${threadID}`}
        className="flex h-full flex-col-reverse overflow-y-scroll pb-0"
      >
        <div className="px-5">
          {thread.comments.map((comment) => (
            <div
              className={`${
                comment.comment_id === thread.comments.length - 1 &&
                wasNewCommentAdded
                  ? "new-comment"
                  : ""
              } group relative mt-5 w-full rounded-lg border bg-[#FFFFFF] p-5`}
              key={comment.comment_id}
            >
              <h3
                className={`${satoshi.className} mb-3 text-sm font-semibold text-neutral-700`}
              >
                <div>
                  {comment.user_name}
                  <span className="ml-3 text-xs font-normal text-neutral-400">
                    {dayjs(comment.created_on).format("DD/MM/YY hh:mm A")}
                  </span>
                </div>
              </h3>
              {comment.whole_to_thread_id === -1 ? (
                <Button
                  onClick={(e) => {
                    handleCommentWholeInNewThread(comment);
                  }}
                  className="absolute right-5 top-5 hidden h-6 w-6 rounded-lg p-0 text-neutral-400 transition duration-200 hover:text-neutral-700 group-hover:flex"
                  key={comment.comment_id}
                  variant={"ghost"}
                  size="icon"
                >
                  <MessageSquareShare className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={(e) => {
                    handleOpenWholeCommentThread(comment);
                  }}
                  className={`${
                    find(discussionCurrentHighlights, {
                      highlight_id: -1,
                      offset: -1,
                      length: -1,
                      from_thread_id: threadID,
                      to_thread_id: comment.whole_to_thread_id,
                    })
                      ? "bg-[#FF5F1F]/10 text-[#FF5F1F] hover:bg-[#FF5F1F]/10 hover:text-[#FF5F1F]"
                      : "bg-[#eeeeee] text-neutral-700 hover:bg-[#e1e1e1] hover:text-neutral-700"
                  } absolute right-5 top-5 h-6 w-6 rounded-lg p-0 transition duration-200`}
                  key={comment.comment_id}
                  variant={"ghost"}
                  size="icon"
                >
                  <MessageSquareText className="h-4 w-4" />
                </Button>
              )}
              <div onClick={(e) => showNewThreadPopup(e, comment.comment_id)}>
                <ContentWithHighlight
                  content={comment.content}
                  ranges={comment.highlights}
                />
              </div>
              {isNewThreadPopupOpen[comment.comment_id] && (
                <Button
                  onClick={(e) => {
                    handleCommentInNewThread(comment);
                  }}
                  className="new-thread-popup-btn absolute z-50 rounded-lg border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition transition duration-200 duration-200 hover:bg-neutral-100"
                  style={{
                    left: newThreadPopupCoords.x,
                    top: newThreadPopupCoords.y,
                  }}
                  key={comment.comment_id}
                  ref={(v) => {
                    newThreadPopupRef.current[comment.comment_id] = v;
                  }}
                >
                  <MessageSquareQuote className="mr-2 mt-0.5 h-4 w-4" />
                  Reply in new thread
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="mx-5 mb-0 mt-5 rounded-lg border bg-[#FFFFFF] p-5">
          <span
            className={`${satoshi.className} mb-4 flex items-center text-sm font-semibold text-neutral-700`}
          >
            {thread.quote_by}
          </span>
          <div className="border-l-8 border-[#FF5F1F]/30 pl-3 italic text-neutral-700">
            {thread.quote}
          </div>
        </div>
      </div>
      <div
        className={`relative mx-5 mb-5 mt-auto w-auto rounded-3xl border border-neutral-400 bg-[#FFFFFF]`}
      >
        <EditorContent
          editor={editor}
          className="discussion-editor min-h-[2.48rem] pl-1 pr-[2.8rem] text-neutral-700"
        />
        <Button
          className="absolute bottom-[0.25rem] right-[0.25rem] h-8 w-8 rounded-full bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-700"
          variant="secondary"
          onClick={handleCommentInThread}
        >
          <ArrowUp className="h-4 w-4" strokeWidth={3} />
        </Button>
      </div>
      <Dialog open={showUserNameDialog} onOpenChange={setShowUserNameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>What&#39;s your name?</DialogTitle>
          </DialogHeader>
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                placeholder="Your name"
                className="mt-2 w-full rounded-3xl border border-neutral-400 bg-[#FFFFFF] py-2 pl-4 text-base text-neutral-700 placeholder:text-[#adb5bd] focus:outline-none"
                type="text"
                onChange={handleUserNameChange}
                onKeyDown={(e) =>
                  e.keyCode === 13 ? handleCommentInThread() : null
                }
              />
              <Button
                variant="secondary"
                className="absolute bottom-[0.3rem] right-[0.3rem] h-8 w-8 rounded-full bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-700"
                onClick={handleCommentInThread}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={3} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChildThread;
