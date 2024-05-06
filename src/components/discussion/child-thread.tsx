"use client";

import { satoshi } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ThreadInfoForHighlight,
  getNewDiscussionCurrentHighlights,
  getNewDiscussionOpenThreads,
} from "@/lib/utils";
import {
  useDiscussionCurrentHighlightsStore,
  useDiscussionOpenThreadsStore,
  useDiscussionStore,
  useDiscussionUnreadCommentsStore,
} from "@/state";
import Blockquote from "@tiptap/extension-blockquote";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import dayjs from "dayjs";
import parse from "html-react-parser";
import { find } from "lodash";
import {
  ArrowRight,
  ArrowUp,
  CheckSquare,
  MessageSquareQuote,
  MessageSquareShare,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ContentWithHighlight from "./content-with-highlight";

const ChildThread = ({ threadID }) => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
  const { discussionCurrentHighlights, setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();
  const { discussionUnreadComments, setNewDiscussionUnreadComments } =
    useDiscussionUnreadCommentsStore();

  const [showUnreadIndicator, setShowUnreadIndicator] = useState(true);

  const [wasNewCommentAdded, setWasNewCommentAdded] = useState(false);

  const [isNewThreadPopupOpen, setIsNewThreadPopupOpen] = useState(
    Array(discussion.comments.length).fill(false),
  );

  const [newThreadPopupCoords, setNewThreadPopupCoords] = useState({});

  const newThreadPopupRef = useRef([]);

  const pathname = usePathname();

  const [showConcludeThreadCommentBox, setShowConcludeThreadCommentBox] =
    useState(false);

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
      paragraph_id: -1,
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
    const selection = window.getSelection();
    const text = selection.toString();

    if (!text) {
      return;
    }

    if (
      selection?.anchorNode?.parentNode?.id === "comment-name-created-on" ||
      selection?.focusNode?.parentNode?.id === "comment-name-created-on"
    ) {
      toast.warning("User's name or comment's time can't be quoted");

      window.getSelection().empty();

      setIsNewThreadPopupOpen(Array(discussion.comments.length).fill(false));

      return;
    }

    if (
      selection?.anchorNode?.parentNode?.parentNode?.tagName === "BLOCKQUOTE" ||
      selection?.focusNode?.parentNode?.parentNode?.tagName === "BLOCKQUOTE"
    ) {
      toast.warning("Quoting a quote is not allowed");

      window.getSelection().empty();

      setIsNewThreadPopupOpen(Array(discussion.comments.length).fill(false));

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

      setIsNewThreadPopupOpen(Array(discussion.comments.length).fill(false));

      return;
    }

    if (
      selection?.anchorNode?.nodeValue !== selection?.focusNode?.nodeValue &&
      selection?.anchorNode?.parentNode === selection?.focusNode?.parentNode
    ) {
      toast.warning("Quoting with a quote inside isn't allowed yet");

      window.getSelection().empty();

      setIsNewThreadPopupOpen(Array(discussion.comments.length).fill(false));

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

    let newThreads = [].concat(discussion.threads, {
      thread_id: newThreadID,
      parent_thread_id: threadID,
      quote: text,
      quote_by: comment.user_name,
      comments: [],
    });

    const paragraphId = Array.from(
      document.getElementById(
        `${threadID}-${comment.comment_id}-text-container`,
      )?.childNodes,
    )
      .filter((n) => n.tagName === "P")
      .indexOf(selection.anchorNode.parentNode);

    const newHighlightToAdd = {
      highlight_id: comment.highlights.length,
      offset: newOffset,
      length: textLen,
      paragraph_id: paragraphId,
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

  const handleCommentInThread = (isConclusion = false) => {
    let commentHTML = editor.getHTML();

    if (!commentHTML || commentHTML === "<p></p>") {
      return;
    }

    commentHTML = commentHTML
      .replaceAll("<strong>", "")
      .replaceAll("</strong>", "")
      .replaceAll("<em>", "")
      .replaceAll("</em>", "")
      .replaceAll("<ul>", "")
      .replaceAll("</ul>", "")
      .replaceAll("<li>", "")
      .replaceAll("</li>", "");

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
      content: commentHTML,
      created_on: Date.now(),
      highlights: [],
      whole_to_thread_id: -1,
      is_conclusion: isConclusion,
    });
    const newThread = { ...thread, comments: newThreadComments };

    const newThreads = discussion.threads.filter(
      (thread) => thread.thread_id !== threadID,
    );
    newThreads.push(newThread);

    const newDiscussion = { ...discussion, threads: newThreads };

    setShowUnreadIndicator(false);

    updateDiscussion(newDiscussion);
    setNewDiscussion(newDiscussion);

    editor.commands.clearContent();

    setWasNewCommentAdded(true);

    if (typeof window !== "undefined") {
      const cq2DiscussionsReadFromLS = JSON.parse(
        localStorage.getItem("cq2DiscussionsRead"),
      );

      const discussionFromLS = cq2DiscussionsReadFromLS.discussions.filter(
        (cq2DiscussionReadFromLS) =>
          cq2DiscussionReadFromLS._id === discussion._id,
      )[0].threads;

      discussionFromLS[threadID] = thread.comments.length;

      const newCq2DiscussionsReadFromLS =
        cq2DiscussionsReadFromLS.discussions.filter(
          (cq2DiscussionReadFromLS) =>
            cq2DiscussionReadFromLS._id !== discussion._id,
        );

      const newCq2DiscussionsRead = {
        discussions: newCq2DiscussionsReadFromLS,
      };

      newCq2DiscussionsRead.discussions.push({
        _id: discussion._id,
        threads: discussionFromLS,
      });

      localStorage.setItem(
        "cq2DiscussionsRead",
        JSON.stringify(newCq2DiscussionsRead),
      );

      const unreadComments = {
        0: discussion.comments.length - discussionFromLS[0],
      };

      for (let i = 1; i <= discussion.threads.length; i++) {
        unreadComments[i] =
          discussion.threads.filter((thread) => thread.thread_id === i)[0]
            .comments.length - discussionFromLS[i];
      }

      setNewDiscussionUnreadComments(unreadComments);

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
            (cq2CommentedDiscussionJSON) =>
              cq2CommentedDiscussionJSON["_id"] === discussion._id,
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
    if (
      pathname.includes("/app/demo") ||
      pathname.includes("/app/discussions/66348608351b5f934d26ce9a")
    ) {
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

  const ShiftEnterCreateExtension = Extension.create({
    addKeyboardShortcuts() {
      return {
        "Shift-Enter": ({ editor }) => {
          editor.commands.enter();
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a comment...",
      }),
      CharacterCount.configure({
        limit: 6000,
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "cq2-tiptap-blockquote",
        },
      }),
      ShiftEnterCreateExtension,
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

  const showNewThreadPopup = (e, comment_id) => {
    const selection = window.getSelection();
    const text = selection.toString();

    if (!text) {
      return;
    }

    const bounds = document
      .getElementById(`${threadID}-${comment_id}-text-container`)
      .getBoundingClientRect();

    setNewThreadPopupCoords({
      x: e.clientX - bounds.left + 35,
      y: e.clientY - bounds.top + 65,
    });

    const newIsNewThreadPopupOpen = isNewThreadPopupOpen;
    newIsNewThreadPopupOpen[comment_id] = true;
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
          paragraph_id: -1,
          from_thread_id: threadID,
          to_thread_id: comment.whole_to_thread_id,
        },
        discussionCurrentHighlights,
      ),
    );
  };

  const concludedComment = thread.comments.filter(
    (comment) => comment.is_conclusion === true,
  )[0];

  useEffect(() => {
    if (!discussion._id) {
      return;
    }

    const childThread = document.getElementById(`child-thread-${threadID}`);

    const setDiscussionReadUnreadComments = () => {
      const cq2DiscussionsReadFromLS = JSON.parse(
        localStorage.getItem("cq2DiscussionsRead"),
      );

      const discussionFromLS = cq2DiscussionsReadFromLS.discussions.filter(
        (cq2DiscussionReadFromLS) =>
          cq2DiscussionReadFromLS._id === discussion._id,
      )[0].threads;

      discussionFromLS[threadID] = thread.comments.length;

      const newCq2DiscussionsReadFromLS =
        cq2DiscussionsReadFromLS.discussions.filter(
          (cq2DiscussionReadFromLS) =>
            cq2DiscussionReadFromLS._id !== discussion._id,
        );

      const newCq2DiscussionsRead = {
        discussions: newCq2DiscussionsReadFromLS,
      };

      newCq2DiscussionsRead.discussions.push({
        _id: discussion._id,
        threads: discussionFromLS,
      });

      localStorage.setItem(
        "cq2DiscussionsRead",
        JSON.stringify(newCq2DiscussionsRead),
      );

      const unreadComments = {
        0: discussion.comments.length - discussionFromLS[0],
      };

      for (let i = 1; i <= discussion.threads.length; i++) {
        unreadComments[i] =
          discussion.threads.filter((thread) => thread.thread_id === i)[0]
            .comments.length - discussionFromLS[i];
      }

      setNewDiscussionUnreadComments(unreadComments);
    };

    if (
      !!!(
        childThread.scrollTop ||
        (++childThread.scrollTop && childThread.scrollTop--)
      )
    ) {
      if (typeof window !== "undefined") {
        setDiscussionReadUnreadComments();
      }
    } else {
      let lastScrollTop = 0;

      childThread.onscroll = (e) => {
        if (childThread.scrollTop < lastScrollTop) {
          return;
        }

        lastScrollTop = childThread.scrollTop <= 0 ? 0 : childThread.scrollTop;
        if (
          childThread.scrollTop + childThread.offsetHeight >=
          childThread.scrollHeight
        ) {
          if (typeof window !== "undefined") {
            setDiscussionReadUnreadComments();
          }
        }
      };
    }
  }, [
    pathname,
    threadID,
    discussion,
    setNewDiscussionUnreadComments,
    thread.comments.length,
  ]);

  return (
    <div className="discussion-child-thread relative flex h-full w-[calc((100vw)/2)] flex-col rounded-none border-r border-neutral-200 bg-[#FFFFFF] shadow-none 2xl:w-[48.5rem]">
      <div
        id={`child-thread-${threadID}`}
        className="flex h-full flex-col overflow-y-scroll pb-0"
      >
        <div className="sticky top-0 z-50 flex flex-row justify-between rounded-none border-b bg-[#FFFFFF] px-5 py-2 text-xs">
          <span
            className={`${satoshi.className} flex items-center font-medium text-neutral-500`}
          >
            {thread.comments.length}{" "}
            {thread.comments.length === 1 ? "comment" : "comments"}
          </span>
          {concludedComment ? (
            <span
              onClick={() => {
                const concludedCommentInDOM = document.getElementById(
                  `${threadID}-${concludedComment.comment_id}`,
                );
                const topPos = concludedCommentInDOM.offsetTop;
                document.getElementById(`child-thread-${threadID}`).scrollTo({
                  top: topPos - 20,
                  behavior: "smooth",
                });
              }}
              className={`${satoshi.className} flex cursor-pointer items-center border border-green-500 bg-green-500/5 px-1 py-0.5 font-medium text-neutral-600`}
            >
              <CheckSquare
                className="mr-2 h-3 w-3 text-green-500"
                strokeWidth={3}
              />
              Thread concluded by {concludedComment.user_name}
            </span>
          ) : (
            <span
              onClick={() => {
                setShowConcludeThreadCommentBox(true);
                editor.commands.focus();
              }}
              className={`${satoshi.className} flex cursor-pointer items-center py-0.5 font-medium text-neutral-600 transition duration-200`}
            >
              <CheckSquare className="mr-2 h-3 w-3" strokeWidth={3} /> Conclude
              thread
            </span>
          )}
        </div>
        <div className="mx-5 mb-0 mt-5 rounded-none border bg-[#FFFFFF] p-5">
          <span
            className={`${satoshi.className} mb-4 flex items-center text-sm font-semibold text-neutral-700`}
          >
            {thread.quote_by}
          </span>
          <div className="cq2-text-container border-l-8 border-[#FF5F1F]/50 pl-3 text-neutral-700">
            {parse(thread.quote)}
          </div>
        </div>
        <div className="px-5">
          {thread.comments.map((comment) => (
            <div
              className={`${
                comment.comment_id === thread.comments.length - 1 &&
                wasNewCommentAdded
                  ? "new-comment"
                  : ""
              } group relative mt-5 w-full rounded-none border ${
                comment.is_conclusion
                  ? "border-green-500 bg-green-500/5"
                  : "bg-[#FFFFFF]"
              } p-5`}
              key={comment.comment_id}
              id={`${threadID}-${comment.comment_id}`}
              onClick={(e) => showNewThreadPopup(e, comment.comment_id)}
            >
              <div
                className={`${satoshi.className} mb-3 flex h-6 flex-row justify-between text-sm font-semibold text-neutral-700`}
              >
                <div id="comment-name-created-on">
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
                      from_thread_id: threadID,
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
                            from_thread_id: threadID,
                            to_thread_id: comment.whole_to_thread_id,
                          })
                            ? "bg-[#FF5F1F]/10 text-[#FF5F1F] hover:bg-[#FF5F1F]/10 hover:text-[#FF5F1F]"
                            : "bg-[#eeeeee] text-neutral-700 hover:bg-[#e1e1e1] hover:text-neutral-700"
                        } h-6 w-6 rounded-none p-0 transition duration-200`}
                        key={comment.comment_id}
                        variant={"ghost"}
                        size="icon"
                      >
                        <MessageSquareQuote className="h-4 w-4" />
                      </Button>
                    )}
                  {comment.whole_to_thread_id !== -1 &&
                    !find(discussionCurrentHighlights, {
                      highlight_id: -1,
                      offset: -1,
                      length: -1,
                      paragraph_id: -1,
                      from_thread_id: threadID,
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
                                from_thread_id: threadID,
                                to_thread_id: comment.whole_to_thread_id,
                              })
                                ? "bg-[#FF5F1F]/10 text-[#FF5F1F] hover:bg-[#FF5F1F]/10 hover:text-[#FF5F1F]"
                                : "bg-[#eeeeee] text-neutral-700 hover:bg-[#e1e1e1] hover:text-neutral-700"
                            } h-6 w-6 rounded-none p-0 transition duration-200`}
                            key={comment.comment_id}
                            variant={"ghost"}
                            size="icon"
                          >
                            <MessageSquareQuote className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent
                          side="right"
                          className="comment-info flex h-8 w-auto items-center justify-center rounded-none px-2 py-3 text-xs font-medium"
                        >
                          <ThreadInfoForHighlight
                            discussion={discussion}
                            thread_id={comment.whole_to_thread_id}
                          />
                        </HoverCardContent>
                      </HoverCard>
                    )}
                </div>
              </div>
              <div>
                <ContentWithHighlight
                  id={`${threadID}-${comment.comment_id}-text-container`}
                  content={comment.content}
                  ranges={comment.highlights}
                />
              </div>
              {isNewThreadPopupOpen[comment.comment_id] && (
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
      </div>
      {showUnreadIndicator && discussionUnreadComments[threadID] > 0 && (
        <div
          className={`${satoshi.className} absolute bottom-32 left-1/2 z-50 w-fit -translate-x-1/2 border border-neutral-200 bg-white px-2 py-1 text-sm font-medium text-neutral-500 shadow-md`}
        >
          Unread comments below
          <span className="beacon" />
        </div>
      )}
      {showConcludeThreadCommentBox ? (
        <div
          className={`relative m-5 w-auto rounded-none border border-green-500 bg-[#FFFFFF]`}
        >
          <EditorContent
            editor={editor}
            className="discussion-editor min-h-[5rem] pl-1 pr-[2.5rem] text-neutral-700"
          />
          <Button
            className="absolute bottom-[0.25rem] right-[0.25rem] h-8 w-8 rounded-none bg-green-500 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-green-600"
            onClick={() => {
              handleCommentInThread(true);
              setShowConcludeThreadCommentBox(false);
            }}
          >
            <CheckSquare className="h-4 w-4" strokeWidth={3} />
          </Button>
          <Button
            className="absolute right-[0.25rem] top-[0.25rem] h-8 w-8 rounded-none bg-neutral-200 p-[0.5rem] font-normal text-neutral-500 shadow-none transition duration-200 hover:bg-neutral-100"
            onClick={() => {
              setShowConcludeThreadCommentBox(false);
              editor.commands.clearContent();
              editor.commands.focus();
            }}
          >
            <X className="h-4 w-4" strokeWidth={3} />
          </Button>
        </div>
      ) : (
        <div
          className={`relative m-5 w-auto rounded-none border border-neutral-400 bg-[#FFFFFF]`}
        >
          <EditorContent
            editor={editor}
            className="discussion-editor min-h-[5rem] pl-1 pr-[2.5rem] text-neutral-700"
          />
          <Button
            className="absolute bottom-[0.25rem] right-[0.25rem] h-8 w-8 rounded-none bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-700"
            onClick={() => {
              handleCommentInThread();
            }}
          >
            <ArrowUp className="h-4 w-4" strokeWidth={3} />
          </Button>
        </div>
      )}
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
                className="absolute bottom-[0.3rem] right-[0.3rem] h-8 w-8 rounded-none bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-700"
                onClick={() => handleCommentInThread()}
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
