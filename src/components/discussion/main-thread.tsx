"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  MessageSquareQuote,
  MessageSquareText,
  MessageSquareShare,
  X,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
import ContentWithHighlight from "./content-with-highlight";
import { Button } from "@/components/ui/button";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import {
  useDiscussionOpenThreadsStore,
  useDiscussionStore,
  useDiscussionCurrentHighlightsStore,
} from "@/state";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { satoshi } from "@/app/fonts";
import {
  getNewDiscussionOpenThreads,
  getThreadParticipantsInfo,
} from "@/lib/utils";
import { find } from "lodash";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const MainThread = () => {
  const { discussion, setNewDiscussion } = useDiscussionStore();

  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
  const { discussionCurrentHighlights, setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();

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

  const [wasNewCommentAdded, setWasNewCommentAdded] = useState(false);

  const [isNewThreadPopupInCommentOpen, setIsNewThreadPopupInCommentOpen] =
    useState(Array(discussion.comments.length).fill(false));

  const [
    isNewThreadPopupInDiscussionOpen,
    setIsNewThreadPopupInDiscussionOpen,
  ] = useState(false);

  const [newThreadPopupCoords, setNewThreadPopupCoords] = useState({});

  const newThreadPopupInCommentRef = useRef([]);
  const newThreadPopupInDiscussionRef = useRef();

  const handleCommentWholeInNewThread = (comment) => {
    const text = comment.content;

    const newThreadID = discussion.threads.length + 1;

    const newThreads = [].concat(discussion.threads, {
      thread_id: newThreadID,
      parent_thread_id: 0,
      quote: text,
      quote_by: comment.user_name,
      comments: [],
    });

    const newComment = { ...comment, whole_to_thread_id: newThreadID };

    const newComments = discussion.comments.filter(
      (_comment) => _comment.comment_id !== comment.comment_id,
    );
    newComments.push(newComment);
    newComments.sort((a, b) => a.comment_id - b.comment_id);

    const newDiscussion = {
      ...discussion,
      threads: newThreads,
      comments: newComments,
    };

    updateDiscussion(newDiscussion);
    setNewDiscussion(newDiscussion);

    setNewDiscussionOpenThreads([newThreadID]);
    setNewDiscussionCurrentHighlights([
      {
        highlight_id: -1,
        offset: -1,
        length: -1,
        from_thread_id: 0,
        paragraph_id: -1,
        to_thread_id: newThreadID,
      },
    ]);
  };

  const handleCommentInNewThread = (comment) => {
    const selection = window.getSelection();
    const text = selection.toString();

    if (!text) {
      return;
    }

    if (
      selection?.anchorNode?.parentNode !== selection?.focusNode?.parentNode &&
      !(
        selection?.anchorNode?.nodeType === 3 &&
        selection?.focusNode?.nodeType === 1
      )
    ) {
      toast.warning("Quoting from different paragraphs isn't allowed");

      window.getSelection().empty();

      setIsNewThreadPopupInCommentOpen(
        Array(discussion.comments.length).fill(false),
      );
      setIsNewThreadPopupInDiscussionOpen(false);

      return;
    }

    if (
      selection?.anchorNode?.nodeValue !== selection?.focusNode?.nodeValue &&
      selection?.anchorNode?.parentNode === selection?.focusNode?.parentNode
    ) {
      toast.warning("Quoting with a quote inside isn't allowed");

      window.getSelection().empty();

      setIsNewThreadPopupInCommentOpen(
        Array(discussion.comments.length).fill(false),
      );
      setIsNewThreadPopupInDiscussionOpen(false);

      return;
    }

    let len = 0;

    for (const node of selection.anchorNode?.parentElement?.childNodes) {
      if (node == selection.anchorNode) {
        break;
      }
      len += node.textContent.length;
    }

    const offset =
      selection.anchorOffset < selection.focusOffset
        ? selection.anchorOffset
        : selection.focusOffset;

    const newOffset = offset + len;
    const textLen = text.length;

    const newThreadID = discussion.threads.length + 1;

    let newHighlightToAdd = {};

    if (comment) {
      const newThreads = [].concat(discussion.threads, {
        thread_id: newThreadID,
        parent_thread_id: 0,
        quote: text,
        quote_by: comment.user_name,
        comments: [],
      });

      const paragraphId = Array.from(
        document.getElementById(`0-${comment.comment_id}-text-container`)
          ?.childNodes,
      )
        .filter((n) => n.tagName === "P")
        .indexOf(selection.anchorNode.parentNode);

      newHighlightToAdd = {
        highlight_id: comment.highlights.length,
        offset: newOffset,
        length: textLen,
        paragraph_id: paragraphId,
        from_thread_id: 0,
        to_thread_id: newThreadID,
      };

      const newHighlights = [].concat(comment.highlights, newHighlightToAdd);

      const newComment = { ...comment, highlights: newHighlights };

      const newComments = discussion.comments.filter(
        (_comment) => _comment.comment_id !== comment.comment_id,
      );
      newComments.push(newComment);
      newComments.sort((a, b) => a.comment_id - b.comment_id);

      const newDiscussion = {
        ...discussion,
        threads: newThreads,
        comments: newComments,
      };

      updateDiscussion(newDiscussion);
      setNewDiscussion(newDiscussion);
    } else {
      const newThreads = [].concat(discussion.threads, {
        thread_id: newThreadID,
        parent_thread_id: 0,
        quote: text,
        quote_by: discussion.user_name,
        comments: [],
      });

      const paragraphId = Array.from(
        document.getElementById("discussion-description-container")?.childNodes,
      )
        .filter((n) => n.tagName === "P")
        .indexOf(selection.anchorNode.parentNode);

      newHighlightToAdd = {
        highlight_id: discussion.highlights.length,
        offset: newOffset,
        length: textLen,
        paragraph_id: paragraphId,
        from_thread_id: 0,
        to_thread_id: newThreadID,
      };

      const newHighlights = [].concat(discussion.highlights, newHighlightToAdd);

      const newDiscussion = {
        ...discussion,
        threads: newThreads,
        highlights: newHighlights,
      };

      updateDiscussion(newDiscussion);
      setNewDiscussion(newDiscussion);
    }

    window.getSelection().empty();

    setIsNewThreadPopupInCommentOpen(
      Array(discussion.comments.length).fill(false),
    );
    setIsNewThreadPopupInDiscussionOpen(false);

    setNewDiscussionOpenThreads([newThreadID]);

    setNewDiscussionCurrentHighlights([newHighlightToAdd]);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a comment...",
      }),
      CharacterCount.configure({
        limit: 4000,
      }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  const handleCommentInThread = () => {
    const commentHTML = editor.getHTML();

    if (!commentHTML) {
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

    const newComments = [].concat(discussion.comments, {
      comment_id: discussion.comments.length,
      user_name: cq2UserName || userName,
      content: commentHTML,
      created_on: Date.now(),
      highlights: [],
      whole_to_thread_id: -1,
    });

    const newDiscussion = { ...discussion, comments: newComments };

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
      document.getElementById("discussion-main-thread").scrollTo({
        top: 999999,
        behavior: "smooth",
      });
    }, 25);
  };

  const updateDiscussion = async (discussion) => {
    if (pathname.includes("/app/demo")) {
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

  const handleMousedownToHideNewThreadPopup = (e: MouseEvent) => {
    const idxOfOpenNewThreadInCommentPopup =
      isNewThreadPopupInCommentOpen.findIndex((x) => x === true);

    if (
      (newThreadPopupInCommentRef.current[idxOfOpenNewThreadInCommentPopup] &&
        !e
          .composedPath()
          .includes(
            newThreadPopupInCommentRef.current[
              idxOfOpenNewThreadInCommentPopup
            ],
          )) ||
      (newThreadPopupInDiscussionRef.current &&
        !e.composedPath().includes(newThreadPopupInDiscussionRef.current))
    ) {
      window.getSelection().empty();

      setIsNewThreadPopupInCommentOpen(
        Array(discussion.comments.length).fill(false),
      );
      setIsNewThreadPopupInDiscussionOpen(false);
    }
  };

  useEffect(() => {
    if (
      isNewThreadPopupInCommentOpen.every((v) => v === false) &&
      !isNewThreadPopupInDiscussionOpen
    )
      return;

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

  const showNewThreadPopup = (e, comment_id) => {
    const selection = window.getSelection();
    const text = selection.toString();

    if (!text || text.charCodeAt(0) === 10) {
      return;
    }

    if (comment_id === -1) {
      const bounds = document
        .getElementById("discussion-description-container")
        .getBoundingClientRect();

      setNewThreadPopupCoords({
        x: e.clientX - bounds.left + 10,
        y: e.clientY - bounds.top + 10,
      });

      setIsNewThreadPopupInDiscussionOpen(true);
    } else {
      const bounds = document
        .getElementById(`0-${comment_id}-text-container`)
        .getBoundingClientRect();

      setNewThreadPopupCoords({
        x: e.clientX - bounds.left + 32,
        y: e.clientY - bounds.top + 60,
      });

      const newIsNewThreadPopupOpen = isNewThreadPopupInCommentOpen;
      newIsNewThreadPopupOpen[comment_id] = true;
      setIsNewThreadPopupInCommentOpen(newIsNewThreadPopupOpen);
    }
  };

  const handleOpenWholeCommentThread = (comment) => {
    setNewDiscussionOpenThreads(
      getNewDiscussionOpenThreads(comment.whole_to_thread_id, discussion),
    );
    setNewDiscussionCurrentHighlights([
      {
        highlight_id: -1,
        offset: -1,
        length: -1,
        paragraph_id: -1,
        from_thread_id: 0,
        to_thread_id: comment.whole_to_thread_id,
      },
    ]);
  };

  return (
    <div className="flex h-full w-[calc((100vw)/2)] flex-col gap-5 rounded-none border-r border-neutral-200 bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.5rem]">
      <div
        id="discussion-main-thread"
        className="h-full overflow-y-scroll px-5 pb-0 pt-4"
      >
        <div
          onClick={(e) => showNewThreadPopup(e, -1)}
          className="relative mb-16 pb-16"
        >
          <ContentWithHighlight
            id="discussion-description-container"
            content={discussion.content}
            ranges={discussion.highlights}
          />
          {isNewThreadPopupInDiscussionOpen && (
            <Button
              onClick={(e) => handleCommentInNewThread()}
              className="new-thread-popup-btn absolute z-50 rounded-none border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition duration-200 hover:bg-neutral-100"
              style={{
                left: newThreadPopupCoords.x,
                top: newThreadPopupCoords.y,
              }}
              key={0}
              ref={(v) => {
                newThreadPopupInDiscussionRef.current = v;
              }}
            >
              <MessageSquareQuote className="mr-2 mt-0.5 h-4 w-4" />
              Reply in new thread
            </Button>
          )}
        </div>
        {discussion.comments.map((comment) => (
          <div
            key={comment.comment_id}
            className={`${
              comment.comment_id === discussion.comments.length - 1 &&
              wasNewCommentAdded
                ? "new-comment"
                : ""
            } group relative mt-3 w-full rounded-none border bg-[#FFFFFF] p-5`}
          >
            <div
              className={`${satoshi.className} mb-3 flex h-6 flex-row justify-between text-sm font-semibold text-neutral-700`}
            >
              <div>
                {comment.user_name}
                <span className="ml-3 text-xs font-normal text-neutral-400">
                  {dayjs(comment.created_on).format("DD/MM/YY hh:mm A")}
                </span>
              </div>
              <div>
                {comment.whole_to_thread_id === -1 && (
                  <Button
                    onClick={(e) => {
                      handleCommentWholeInNewThread(comment);
                    }}
                    className="hidden h-6 w-6 rounded-none p-0 text-neutral-400 transition duration-200 hover:text-neutral-700 group-hover:flex"
                    key={comment.comment_id}
                    variant={"ghost"}
                    size="icon"
                  >
                    <MessageSquareShare className="h-4 w-4" />
                  </Button>
                )}
                {comment.whole_to_thread_id !== -1 &&
                  find(discussionCurrentHighlights, {
                    highlight_id: -1,
                    offset: -1,
                    length: -1,
                    paragraph_id: -1,
                    from_thread_id: 0,
                    to_thread_id: comment.whole_to_thread_id,
                  }) && (
                    <Button
                      onClick={(e) => {
                        handleOpenWholeCommentThread(comment);
                      }}
                      className={`${
                        find(discussionCurrentHighlights, {
                          highlight_id: -1,
                          offset: -1,
                          length: -1,
                          paragraph_id: -1,
                          from_thread_id: 0,
                          to_thread_id: comment.whole_to_thread_id,
                        })
                          ? "bg-[#FF5F1F]/10 text-[#FF5F1F] hover:bg-[#FF5F1F]/10 hover:text-[#FF5F1F]"
                          : "bg-[#eeeeee] text-neutral-700 hover:bg-[#e1e1e1] hover:text-neutral-700"
                      } h-6 w-6 rounded-none p-0 transition duration-200`}
                      key={comment.comment_id}
                      variant={"ghost"}
                      size="icon"
                    >
                      <MessageSquareText className="h-4 w-4" />
                    </Button>
                  )}
                {comment.whole_to_thread_id !== -1 &&
                  !find(discussionCurrentHighlights, {
                    highlight_id: -1,
                    offset: -1,
                    length: -1,
                    paragraph_id: -1,
                    from_thread_id: 0,
                    to_thread_id: comment.whole_to_thread_id,
                  }) && (
                    <HoverCard openDelay={50} closeDelay={100}>
                      <HoverCardTrigger>
                        <Button
                          onClick={(e) => {
                            handleOpenWholeCommentThread(comment);
                          }}
                          className={`${
                            find(discussionCurrentHighlights, {
                              highlight_id: -1,
                              offset: -1,
                              length: -1,
                              paragraph_id: -1,
                              from_thread_id: 0,
                              to_thread_id: comment.whole_to_thread_id,
                            })
                              ? "bg-[#FF5F1F]/10 text-[#FF5F1F] hover:bg-[#FF5F1F]/10 hover:text-[#FF5F1F]"
                              : "bg-[#eeeeee] text-neutral-700 hover:bg-[#e1e1e1] hover:text-neutral-700"
                          } h-6 w-6 rounded-none p-0 transition duration-200`}
                          key={comment.comment_id}
                          variant={"ghost"}
                          size="icon"
                        >
                          <MessageSquareText className="h-4 w-4" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="right"
                        className="comment-info flex h-8 w-auto items-center justify-center rounded-none p-3 text-xs font-medium"
                      >
                        {getThreadParticipantsInfo(
                          discussion,
                          comment.whole_to_thread_id,
                        )}
                      </HoverCardContent>
                    </HoverCard>
                  )}
              </div>
            </div>
            <div onClick={(e) => showNewThreadPopup(e, comment.comment_id)}>
              <ContentWithHighlight
                id={`0-${comment.comment_id}-text-container`}
                content={comment.content}
                ranges={comment.highlights}
              />
            </div>
            {isNewThreadPopupInCommentOpen[comment.comment_id] && (
              <Button
                onClick={(e) => {
                  handleCommentInNewThread(comment);
                }}
                className="new-thread-popup-btn absolute z-50 rounded-none border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition duration-200 hover:bg-neutral-100"
                style={{
                  left: newThreadPopupCoords.x,
                  top: newThreadPopupCoords.y,
                }}
                key={comment.comment_id}
                ref={(v) => {
                  newThreadPopupInCommentRef.current[comment.comment_id] = v;
                }}
              >
                <MessageSquareQuote className="mr-2 mt-0.5 h-4 w-4" />
                Reply in new thread
              </Button>
            )}
          </div>
        ))}
      </div>
      <div
        className={`relative mx-5 mb-5 mt-auto w-auto rounded-none border border-neutral-400 bg-[#FFFFFF]`}
      >
        <EditorContent
          editor={editor}
          className="discussion-editor min-h-[4.8rem] pl-1 pr-[2.5rem] text-neutral-700"
        />
        <Button
          className="absolute bottom-[0.25rem] right-[0.25rem] h-8 w-8 rounded-none bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-700"
          variant="secondary"
          onClick={() => {
            handleCommentInThread();
          }}
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
                className="mt-2 w-full rounded-none border border-neutral-400 bg-[#FFFFFF] py-2 pl-4 text-base text-neutral-700 placeholder:text-[#adb5bd] focus:outline-none"
                type="text"
                onChange={handleUserNameChange}
                onKeyDown={(e) =>
                  e.keyCode === 13 ? handleCommentInThread() : null
                }
              />
              <Button
                variant="secondary"
                className="absolute bottom-[0.3rem] right-[0.3rem] h-8 w-8 rounded-none bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-700"
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

export default MainThread;
