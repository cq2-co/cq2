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
  cn,
  getNewDiscussionCurrentHighlights,
  getNewDiscussionOpenThreads,
} from "@/lib/utils";
import {
  useDiscussionCurrentHighlightsStore,
  useDiscussionOpenThreadsStore,
  useDiscussionStore,
  useDiscussionUnreadCommentsStore,
} from "@/state";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import dayjs from "dayjs";
import parse from "html-react-parser";
import {
  ArrowRight,
  ArrowUp,
  CheckSquare,
  MessageSquareQuote,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { fromRange } from "xpath-range";
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

  const [isThreadInfoPopupOpen, setIsThreadInfoPopupOpen] = useState(false);
  const [threadInfoPopupThreadID, setThreadInfoPopupThreadID] = useState(-1);
  const [threadInfoPopupCoords, setThreadInfoPopupCoords] = useState({});

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

  const handleCommentInNewThread = (comment) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
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
      selection?.anchorNode?.parentElement.closest("p") !==
      selection?.focusNode?.parentElement.closest("p")
    ) {
      toast.warning("Quoting from different paragraphs isn't allowed");

      window.getSelection().empty();

      setIsNewThreadPopupOpen(Array(discussion.comments.length).fill(false));

      return;
    }

    const commentTextContainer = document.getElementById(
      `${threadID}-${comment.comment_id}-text-container`,
    );

    const xPathRange = fromRange(range, commentTextContainer);

    const newThreadID = discussion.threads.length + 1;

    const newHighlightToAdd = {
      highlight_id: comment.highlights.length,
      start: xPathRange.start,
      startOffset: xPathRange.startOffset,
      end: xPathRange.end,
      endOffset: xPathRange.endOffset,
      thread_id: threadID,
      comment_id: comment.comment_id,
      to_thread_id: newThreadID,
    };

    const newHighlights = [].concat(comment.highlights, newHighlightToAdd);

    let newThreads = [].concat(discussion.threads, {
      thread_id: newThreadID,
      from_thread_id: threadID,
      from_comment_id: comment.comment_id,
      from_highlight_id: comment.highlights.length,
      quote: text,
      quote_by: comment.user_name,
      comments: [],
    });

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
      (highlight) => highlight.thread_id < newHighlightToAdd.thread_id,
    );
    newCurrentHighlights.push(newHighlightToAdd);
    setNewDiscussionCurrentHighlights(newCurrentHighlights);
  };

  const handleCommentInThread = (isConclusion = false) => {
    let commentHTML = editor.getHTML();

    if (!commentHTML || commentHTML === "<p></p>") {
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
      thread_id: threadID,
      user_name: cq2UserName || userName,
      content: commentHTML,
      created_on: Date.now(),
      highlights: [],
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
    if (pathname.includes("/app/demo") || discussion.read_only) {
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
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: cn("list-decimal ml-8"),
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: cn("list-disc ml-8"),
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "cq2-tiptap-blockquote",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: cn("bg-neutral-100 text-neutral-700 p-4 rounded-xl text-sm"),
          },
        },
        code: {
          HTMLAttributes: {
            class: cn("bg-neutral-100 text-neutral-700 p-1"),
          },
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: cn("text-[#797874] underline"),
        },
      }),
      Placeholder.configure({
        placeholder: "Write a comment...",
      }),
      CharacterCount.configure({
        limit: 6000,
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

    const commentTextContainerBounds = document
      .getElementById(`${threadID}-${comment_id}-text-container`)
      .getBoundingClientRect();

    let xCoord = e.clientX - commentTextContainerBounds.left + 35;
    let yCoord = e.clientY - commentTextContainerBounds.top + 65;

    if (xCoord + 95 > commentTextContainerBounds.width) {
      xCoord = commentTextContainerBounds.width - 100;
      yCoord = yCoord + 10;
    }

    setNewThreadPopupCoords({
      x: xCoord,
      y: yCoord,
    });

    const newIsNewThreadPopupOpen = isNewThreadPopupOpen;
    newIsNewThreadPopupOpen[comment_id] = true;
    setIsNewThreadPopupOpen(newIsNewThreadPopupOpen);
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

  useEffect(() => {
    for (let c = 0; c < thread.comments.length; c++) {
      const hightlightsInComments = thread.comments[c].highlights;

      for (let i = 0; i < hightlightsInComments.length; i++) {
        const highlight = hightlightsInComments[i];

        document
          .querySelectorAll(
            `span[data-info='${highlight.thread_id}-${highlight.comment_id}-${highlight.highlight_id}-${highlight.to_thread_id}']`,
          )
          .forEach((highlightSpan) => {
            highlightSpan.addEventListener("click", function (e) {
              e.preventDefault();
              e.stopPropagation();

              setNewDiscussionOpenThreads(
                getNewDiscussionOpenThreads(highlight.to_thread_id, discussion),
              );
              setNewDiscussionCurrentHighlights(
                getNewDiscussionCurrentHighlights(
                  highlight,
                  discussionCurrentHighlights,
                ),
              );

              // setIsThreadInfoPopupOpen(false);
            });

            highlightSpan.addEventListener("mouseover", function (e) {
              e.preventDefault();
              e.stopPropagation();

              let lastHighlightSpan;

              if (
                (e.target.nodeName === "SPAN" &&
                  e.target.className !== "cq2-highlight-span-active") ||
                e.target.closest("span").className !==
                  "cq2-highlight-span-active"
              ) {
                document
                  .querySelectorAll(
                    `span[data-info='${highlightSpan.dataset.info}']`,
                  )
                  .forEach((highlightSpanInner) => {
                    highlightSpanInner.className =
                      "cq2-highlight-span-inactive-hover";

                    lastHighlightSpan = highlightSpanInner;
                  });

                // const highlightSpanBounds =
                //   lastHighlightSpan.getBoundingClientRect();

                // const commentTextContainerBounds = document
                //   .getElementById(`${threadID}-${c}-text-container`)
                //   .getBoundingClientRect();

                // const childThreadContainer = document.getElementById(
                //   `child-thread-${threadID}`,
                // );

                // const childThreadContainerBounds =
                //   childThreadContainer.getBoundingClientRect();

                // const discussionsThreadsScrollableContainer =
                //   document.getElementById(
                //     "discussions-threads-scrollable-container",
                //   );

                // let yCoord =
                //   highlightSpanBounds.y -
                //   childThreadContainerBounds.top +
                //   childThreadContainer.scrollTop;

                // let xCoord = -(
                //   commentTextContainerBounds.right -
                //   highlightSpanBounds.right +
                //   20
                // );

                // if (highlightSpanBounds.right + 512 >= screen.width) {
                //   xCoord = -(
                //     commentTextContainerBounds.right -
                //     highlightSpanBounds.left +
                //     582
                //   );

                //   if (
                //     discussionsThreadsScrollableContainer.scrollLeft +
                //       discussionsThreadsScrollableContainer.clientWidth <
                //     discussionsThreadsScrollableContainer.scrollWidth
                //   ) {
                //     xCoord +=
                //       childThreadContainer.getBoundingClientRect().width;
                //   }
                // }

                // setThreadInfoPopupCoords({
                //   x: xCoord,
                //   y: yCoord,
                // });

                // setThreadInfoPopupThreadID(highlight.to_thread_id);
                // setIsThreadInfoPopupOpen(true);
              }
            });

            highlightSpan.addEventListener("mouseout", function (e) {
              e.preventDefault();
              e.stopPropagation();

              if (
                (e.target.nodeName === "SPAN" &&
                  e.target.className !== "cq2-highlight-span-active") ||
                e.target.closest("span").className !==
                  "cq2-highlight-span-active"
              ) {
                document
                  .querySelectorAll(
                    `span[data-info='${highlightSpan.dataset.info}']`,
                  )
                  .forEach((highlightSpanInner) => {
                    highlightSpanInner.className =
                      "cq2-highlight-span-inactive";
                  });
              }

              // setIsThreadInfoPopupOpen(false);
            });
          });
      }
    }

    return () => {
      for (let c = 0; c < thread.comments.length; c++) {
        const hightlightsInComments = thread.comments[c].highlights;

        for (let i = 0; i < hightlightsInComments.length; i++) {
          const highlight = hightlightsInComments[i];

          document
            .querySelectorAll(
              `span[data-info='${highlight.thread_id}-${highlight.comment_id}-${highlight.highlight_id}-${highlight.to_thread_id}']`,
            )
            .forEach((highlightSpan) => {
              highlightSpan.removeEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                setNewDiscussionOpenThreads(
                  getNewDiscussionOpenThreads(
                    highlight.to_thread_id,
                    discussion,
                  ),
                );
                setNewDiscussionCurrentHighlights(
                  getNewDiscussionCurrentHighlights(
                    highlight,
                    discussionCurrentHighlights,
                  ),
                );

                // setIsThreadInfoPopupOpen(false);
              });

              highlightSpan.removeEventListener("mouseover", function (e) {
                e.preventDefault();
                e.stopPropagation();

                let lastHighlightSpan;

                if (
                  (e.target.nodeName === "SPAN" &&
                    e.target.className !== "cq2-highlight-span-active") ||
                  e.target.closest("span").className !==
                    "cq2-highlight-span-active"
                ) {
                  document
                    .querySelectorAll(
                      `span[data-info='${highlightSpan.dataset.info}']`,
                    )
                    .forEach((highlightSpanInner) => {
                      highlightSpanInner.className =
                        "cq2-highlight-span-inactive-hover";

                      lastHighlightSpan = highlightSpanInner;
                    });

                  // const highlightSpanBounds =
                  //   lastHighlightSpan.getBoundingClientRect();

                  // const commentTextContainerBounds = document
                  //   .getElementById(`${threadID}-${c}-text-container`)
                  //   .getBoundingClientRect();

                  // const childThreadContainer = document.getElementById(
                  //   `child-thread-${threadID}`,
                  // );

                  // const childThreadContainerBounds =
                  //   childThreadContainer.getBoundingClientRect();

                  // const discussionsThreadsScrollableContainer =
                  //   document.getElementById(
                  //     "discussions-threads-scrollable-container",
                  //   );

                  // let yCoord =
                  //   highlightSpanBounds.y -
                  //   childThreadContainerBounds.top +
                  //   childThreadContainer.scrollTop;

                  // let xCoord = -(
                  //   commentTextContainerBounds.right -
                  //   highlightSpanBounds.right +
                  //   20
                  // );

                  // if (highlightSpanBounds.right + 512 >= screen.width) {
                  //   xCoord = -(
                  //     commentTextContainerBounds.right -
                  //     highlightSpanBounds.left +
                  //     582
                  //   );

                  //   if (
                  //     discussionsThreadsScrollableContainer.scrollLeft +
                  //       discussionsThreadsScrollableContainer.clientWidth <
                  //     discussionsThreadsScrollableContainer.scrollWidth
                  //   ) {
                  //     xCoord +=
                  //       childThreadContainer.getBoundingClientRect().width;
                  //   }
                  // }

                  // setThreadInfoPopupCoords({
                  //   x: xCoord,
                  //   y: yCoord,
                  // });

                  // setThreadInfoPopupThreadID(highlight.to_thread_id);
                  // setIsThreadInfoPopupOpen(true);
                }
              });

              highlightSpan.removeEventListener("mouseout", function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (
                  (e.target.nodeName === "SPAN" &&
                    e.target.className !== "cq2-highlight-span-active") ||
                  e.target.closest("span").className !==
                    "cq2-highlight-span-active"
                ) {
                  document
                    .querySelectorAll(
                      `span[data-info='${highlightSpan.dataset.info}']`,
                    )
                    .forEach((highlightSpanInner) => {
                      highlightSpanInner.className =
                        "cq2-highlight-span-inactive";
                    });
                }

                // setIsThreadInfoPopupOpen(false);
              });
            });
        }
      }
    };
  }, [
    discussion,
    setNewDiscussionCurrentHighlights,
    setNewDiscussionOpenThreads,
    threadID,
    thread.comments,
  ]);

  return (
    <div className="discussion-child-thread relative flex h-full w-[calc((100vw)/2)] flex-col rounded-none border-r border-neutral-200 bg-[#FFFFFF] shadow-none 2xl:w-[48.5rem]">
      <div
        id={`child-thread-${threadID}`}
        className="flex h-full flex-col overflow-y-scroll pb-0"
      >
        <HoverCard openDelay={50} closeDelay={100} open={isThreadInfoPopupOpen}>
          <HoverCardTrigger asChild>
            <span />
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            className="comment-info absolute z-50 flex w-[32rem] items-center justify-center rounded-2xl py-3 pl-3 pr-2 text-xs font-medium"
            style={{
              left: threadInfoPopupCoords.x,
              top: threadInfoPopupCoords.y,
            }}
          >
            <ThreadInfoForHighlight
              discussion={discussion}
              thread_id={threadInfoPopupThreadID}
            />
          </HoverCardContent>
        </HoverCard>
        <div className="sticky top-0 z-40 flex flex-row justify-between border-b bg-[#FFFFFF] px-5 py-2 text-xs">
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
              className={`${satoshi.className} flex cursor-pointer items-center rounded-2xl border border-green-500 bg-green-500/5 px-2 py-0.5 font-medium text-neutral-600`}
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
        <div className="mx-5 mb-0 mt-5 rounded-2xl border bg-[#FFFFFF] p-5">
          <span
            className={`${satoshi.className} mb-4 flex items-center text-sm font-semibold text-neutral-700`}
          >
            {thread.quote_by}
          </span>
          <div className="cq2-text-container border-l-8 border-[#FF4F00]/50 pl-3 text-neutral-700">
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
              } group relative mt-5 w-full rounded-2xl border ${
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
              </div>
              <div>
                <ContentWithHighlight
                  id={`${threadID}-${comment.comment_id}-text-container`}
                  content={comment.content}
                  highlights={comment.highlights}
                />
              </div>
              {isNewThreadPopupOpen[comment.comment_id] && (
                <Button
                  onClick={(e) => {
                    handleCommentInNewThread(comment);
                  }}
                  className="new-thread-popup-btn absolute z-50 rounded-2xl border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition duration-200 hover:bg-neutral-100"
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
                  Comment
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      {showUnreadIndicator && discussionUnreadComments[threadID] > 0 && (
        <div
          className={`${satoshi.className} absolute bottom-32 left-1/2 z-50 w-fit -translate-x-1/2 rounded-2xl border border-neutral-200 bg-white px-3 py-1 text-sm font-medium text-neutral-500 shadow-md`}
        >
          Unread comments below
          <span className="beacon" />
        </div>
      )}
      {showConcludeThreadCommentBox ? (
        <div
          className={`relative m-5 w-auto rounded-2xl border border-green-500 bg-[#FFFFFF]`}
        >
          <EditorContent
            editor={editor}
            className="discussion-editor min-h-[5rem] pl-1 pr-[2.5rem] text-neutral-700"
          />
          <Button
            className="absolute bottom-[0.25rem] right-[0.25rem] h-8 w-8 rounded-2xl bg-green-500 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-green-600"
            onClick={() => {
              handleCommentInThread(true);
              setShowConcludeThreadCommentBox(false);
            }}
          >
            <CheckSquare className="h-4 w-4" strokeWidth={3} />
          </Button>
          <Button
            className="absolute right-[0.25rem] top-[0.25rem] h-8 w-8 rounded-2xl bg-neutral-200 p-[0.5rem] font-normal text-neutral-500 shadow-none transition duration-200 hover:bg-neutral-100"
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
          className={`relative m-5 w-auto rounded-2xl border border-neutral-400 bg-[#FFFFFF]`}
        >
          <EditorContent
            editor={editor}
            className="discussion-editor min-h-[5rem] pl-1 pr-[2.5rem] text-neutral-700"
          />
          <Button
            className="absolute bottom-[0.25rem] right-[0.25rem] h-8 w-8 rounded-2xl bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-700"
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
                className="mt-2 w-full rounded-2xl border border-neutral-400 bg-[#FFFFFF] py-2 pl-4 text-base text-neutral-700 placeholder:text-[#adb5bd] focus:outline-none"
                type="text"
                onChange={handleUserNameChange}
                onKeyDown={(e) =>
                  e.keyCode === 13 ? handleCommentInThread() : null
                }
              />
              <Button
                className="absolute bottom-[0.3rem] right-[0.3rem] h-8 w-8 rounded-2xl bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-700"
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
