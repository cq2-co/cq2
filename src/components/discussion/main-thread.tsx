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
import { Separator } from "@/components/ui/separator";
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
  useShowConcludeThreadCommentBoxStore,
} from "@/state";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import dayjs from "dayjs";
import {
  ArrowRight,
  ArrowUp,
  CheckSquare,
  MessageCircle,
  MessageSquareQuote,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { fromRange } from "xpath-range";
import ContentWithHighlight from "./content-with-highlight";

const MainThread = () => {
  const { discussion, setNewDiscussion } = useDiscussionStore();

  const { setNewDiscussionOpenThreads } = useDiscussionOpenThreadsStore();
  const { discussionCurrentHighlights, setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();
  const { showConcludeThreadCommentBox, setShowConcludeThreadCommentBox } =
    useShowConcludeThreadCommentBoxStore();
  const { discussionUnreadComments, setNewDiscussionUnreadComments } =
    useDiscussionUnreadCommentsStore();

  const [showUnreadIndicator, setShowUnreadIndicator] = useState(true);

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

  const [isThreadInfoPopupOpen, setIsThreadInfoPopupOpen] = useState(false);
  const [threadInfoPopupThreadID, setThreadInfoPopupThreadID] = useState(-1);
  const [threadInfoPopupCoords, setThreadInfoPopupCoords] = useState({});

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

      setIsNewThreadPopupInCommentOpen(
        Array(discussion.comments.length).fill(false),
      );
      setIsNewThreadPopupInDiscussionOpen(false);

      return;
    }

    if (
      selection?.anchorNode?.parentElement.closest("p") !==
      selection?.focusNode?.parentElement.closest("p")
    ) {
      toast.warning("Quoting from different paragraphs isn't allowed");

      window.getSelection().empty();

      setIsNewThreadPopupInCommentOpen(
        Array(discussion.comments.length).fill(false),
      );
      setIsNewThreadPopupInDiscussionOpen(false);

      return;
    }

    const newThreadID = discussion.threads.length + 1;

    let newHighlightToAdd = {};

    if (comment) {
      const commentTextContainer = document.getElementById(
        `0-${comment.comment_id}-text-container`,
      );

      const xPathRange = fromRange(range, commentTextContainer);

      newHighlightToAdd = {
        highlight_id: comment.highlights.length,
        start: xPathRange.start,
        startOffset: xPathRange.startOffset,
        end: xPathRange.end,
        endOffset: xPathRange.endOffset,
        thread_id: 0,
        comment_id: comment.comment_id,
        to_thread_id: newThreadID,
      };

      const newHighlights = [].concat(comment.highlights, newHighlightToAdd);

      const newThreads = [].concat(discussion.threads, {
        thread_id: newThreadID,
        from_thread_id: 0,
        from_comment_id: comment.comment_id,
        from_highlight_id: comment.highlights.length,
        quote: text,
        quote_by: comment.user_name,
        comments: [],
      });

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
      const discussionDescriptionContainer = document.getElementById(
        "document-content-container",
      );

      const xPathRange = fromRange(range, discussionDescriptionContainer);

      newHighlightToAdd = {
        highlight_id: discussion.highlights.length,
        start: xPathRange.start,
        startOffset: xPathRange.startOffset,
        end: xPathRange.end,
        endOffset: xPathRange.endOffset,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: newThreadID,
      };

      const newHighlights = [].concat(discussion.highlights, newHighlightToAdd);

      const newThreads = [].concat(discussion.threads, {
        thread_id: newThreadID,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: discussion.highlights.length,
        quote: text,
        quote_by: discussion.user_name,
        comments: [],
      });

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
            class: cn("bg-neutral-100 text-neutral-700 p-0.5"),
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

    const newComments = [].concat(discussion.comments, {
      comment_id: discussion.comments.length,
      thread_id: 0,
      user_name: cq2UserName || userName,
      content: commentHTML,
      created_on: Date.now(),
      highlights: [],
      is_conclusion: isConclusion,
    });

    const newDiscussion = { ...discussion, comments: newComments };

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

      discussionFromLS[0] = discussion.comments.length;

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
      document.getElementById("document-main-thread").scrollTo({
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
      const docDontentContainerBounds = document
        .getElementById("document-content-container")
        .getBoundingClientRect();

      let xCoord = e.clientX - docDontentContainerBounds.left + 10;
      let yCoord = e.clientY - docDontentContainerBounds.top + 10;

      if (xCoord + 95 > docDontentContainerBounds.width) {
        xCoord = docDontentContainerBounds.width - 100;
        yCoord = yCoord + 10;
      }

      setNewThreadPopupCoords({
        x: xCoord,
        y: yCoord,
      });

      setIsNewThreadPopupInDiscussionOpen(true);
    } else {
      const commentTextContainerBounds = document
        .getElementById(`0-${comment_id}-text-container`)
        .getBoundingClientRect();

      let xCoord = e.clientX - commentTextContainerBounds.left + 32;
      let yCoord = e.clientY - commentTextContainerBounds.top + 70;

      if (xCoord + 95 > commentTextContainerBounds.width) {
        xCoord = commentTextContainerBounds.width - 100;
        yCoord = yCoord + 10;
      }

      setNewThreadPopupCoords({
        x: xCoord,
        y: yCoord,
      });

      const newIsNewThreadPopupOpen = isNewThreadPopupInCommentOpen;
      newIsNewThreadPopupOpen[comment_id] = true;
      setIsNewThreadPopupInCommentOpen(newIsNewThreadPopupOpen);
    }
  };

  useEffect(() => {
    if (!editor) {
      return;
    }

    const discussionsThreadsScrollableContainer = document.getElementById(
      "discussions-threads-scrollable-container",
    );

    if (discussionsThreadsScrollableContainer) {
      if (discussionsThreadsScrollableContainer.scrollLeft === 0) {
        editor.commands.focus();
      } else {
        discussionsThreadsScrollableContainer.onscroll = (e) => {
          if (discussionsThreadsScrollableContainer.scrollLeft === 0) {
            editor.commands.focus();
          }
        };
      }
    }
  }, [showConcludeThreadCommentBox, editor]);

  useEffect(() => {
    if (!discussion._id) {
      return;
    }

    const discussionMainThread = document.getElementById(
      "document-main-thread",
    );

    const setDiscussionReadUnreadComments = () => {
      const cq2DiscussionsReadFromLS = JSON.parse(
        localStorage.getItem("cq2DiscussionsRead"),
      );

      const discussionFromLS = cq2DiscussionsReadFromLS.discussions.filter(
        (cq2DiscussionReadFromLS) =>
          cq2DiscussionReadFromLS._id === discussion._id,
      )[0].threads;

      discussionFromLS[0] = discussion.comments.length;

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
        discussionMainThread.scrollTop ||
        (++discussionMainThread.scrollTop && discussionMainThread.scrollTop--)
      )
    ) {
      if (typeof window !== "undefined") {
        setDiscussionReadUnreadComments();
      }
    } else {
      let lastScrollTop = 0;

      discussionMainThread.onscroll = (e) => {
        if (discussionMainThread.scrollTop < lastScrollTop) {
          return;
        }

        lastScrollTop =
          discussionMainThread.scrollTop <= 0
            ? 0
            : discussionMainThread.scrollTop;
        if (
          discussionMainThread.scrollTop + discussionMainThread.offsetHeight >=
          discussionMainThread.scrollHeight
        ) {
          if (typeof window !== "undefined") {
            setDiscussionReadUnreadComments();
          }
        }
      };
    }
  }, [discussion, pathname, setNewDiscussionUnreadComments]);

  useEffect(() => {
    const docContentContainer = document.getElementById(
      "document-content-container",
    );

    const discussionMainThread = document.getElementById(
      "document-main-thread",
    );

    if (
      !discussionMainThread ||
      !docContentContainer ||
      !docContentContainer.innerHTML
    )
      return;

    for (let i = 0; i < discussion.highlights.length; i++) {
      const highlight = discussion.highlights[i];

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
              e.target.closest("span").className !== "cq2-highlight-span-active"
            ) {
              document
                .querySelectorAll(
                  `span[data-info='${highlightSpan.dataset.info}']`,
                )
                .forEach((highlightSpanElement) => {
                  highlightSpanElement.className =
                    "cq2-highlight-span-inactive-hover";

                  lastHighlightSpan = highlightSpanElement;
                });

              // const docContainerBounds =
              //   docContentContainer.getBoundingClientRect();

              // const highlightSpanBounds =
              //   lastHighlightSpan.getBoundingClientRect();

              // const discussionsThreadsScrollableContainer =
              //   document.getElementById(
              //     "discussions-threads-scrollable-container",
              //   );

              // setThreadInfoPopupCoords({
              //   x:
              //     discussionsThreadsScrollableContainer.scrollLeft +
              //     highlightSpanBounds.right,
              //   y: highlightSpanBounds.y - docContainerBounds.bottom,
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
              e.target.closest("span").className !== "cq2-highlight-span-active"
            ) {
              document
                .querySelectorAll(
                  `span[data-info='${highlightSpan.dataset.info}']`,
                )
                .forEach((highlightSpanElement) => {
                  highlightSpanElement.className =
                    "cq2-highlight-span-inactive";
                });
            }

            // setIsThreadInfoPopupOpen(false);
          });
        });
    }

    return () => {
      const docContentContainer = document.getElementById(
        "document-content-container",
      );

      for (let i = 0; i < discussion.highlights.length; i++) {
        const highlight = discussion.highlights[i];

        document
          .querySelectorAll(
            `span[data-info='${highlight.thread_id}-${highlight.comment_id}-${highlight.highlight_id}-${highlight.to_thread_id}']`,
          )
          .forEach((highlightSpan) => {
            highlightSpan.removeEventListener("click", function (e) {
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
                  .forEach((highlightSpanElement) => {
                    highlightSpanElement.className =
                      "cq2-highlight-span-inactive-hover";

                    lastHighlightSpan = highlightSpanElement;
                  });

                // const docContainerBounds =
                //   docContentContainer.getBoundingClientRect();

                // const highlightSpanBounds =
                //   lastHighlightSpan.getBoundingClientRect();

                // const discussionsThreadsScrollableContainer =
                //   document.getElementById(
                //     "discussions-threads-scrollable-container",
                //   );

                // setThreadInfoPopupCoords({
                //   x:
                //     discussionsThreadsScrollableContainer.scrollLeft +
                //     highlightSpanBounds.right,
                //   y: highlightSpanBounds.y - docContainerBounds.bottom,
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
                  .forEach((highlightSpanElement) => {
                    highlightSpanElement.className =
                      "cq2-highlight-span-inactive";
                  });
              }

              // setIsThreadInfoPopupOpen(false);
            });
          });
      }
    };
  }, [
    discussion,
    setNewDiscussionCurrentHighlights,
    setNewDiscussionOpenThreads,
  ]);

  useEffect(() => {
    for (let c = 0; c < discussion.comments.length; c++) {
      const hightlightsInComments = discussion.comments[c].highlights;

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
                  .forEach((highlightSpanElement) => {
                    highlightSpanElement.className =
                      "cq2-highlight-span-inactive-hover";

                    lastHighlightSpan = highlightSpanElement;
                  });

                // const highlightSpanBounds =
                //   lastHighlightSpan.getBoundingClientRect();

                // const docContainerBounds = document
                //   .getElementById("document-content-container")
                //   .getBoundingClientRect();

                // const discussionsThreadsScrollableContainer =
                //   document.getElementById(
                //     "discussions-threads-scrollable-container",
                //   );

                // setThreadInfoPopupCoords({
                //   x:
                //     discussionsThreadsScrollableContainer.scrollLeft +
                //     highlightSpanBounds.right,
                //   y: highlightSpanBounds.y - docContainerBounds.bottom,
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
                  .forEach((highlightSpanElement) => {
                    highlightSpanElement.className =
                      "cq2-highlight-span-inactive";
                  });
              }

              // setIsThreadInfoPopupOpen(false);
            });
          });
      }
    }

    return () => {
      for (let c = 0; c < discussion.comments.length; c++) {
        const hightlightsInComments = discussion.comments[c].highlights;

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
                    .forEach((highlightSpanElement) => {
                      highlightSpanElement.className =
                        "cq2-highlight-span-inactive-hover";

                      lastHighlightSpan = highlightSpanElement;
                    });

                  // const highlightSpanBounds =
                  //   lastHighlightSpan.getBoundingClientRect();

                  // const docContainerBounds = document
                  //   .getElementById("document-content-container")
                  //   .getBoundingClientRect();

                  // const discussionsThreadsScrollableContainer =
                  //   document.getElementById(
                  //     "discussions-threads-scrollable-container",
                  //   );

                  // setThreadInfoPopupCoords({
                  //   x:
                  //     discussionsThreadsScrollableContainer.scrollLeft +
                  //     highlightSpanBounds.right,
                  //   y: highlightSpanBounds.y - docContainerBounds.bottom,
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
                    .forEach((highlightSpanElement) => {
                      highlightSpanElement.className =
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
  ]);

  return (
    <div className="relative flex h-full w-[calc((100vw)/2)] flex-col rounded-none border-r border-neutral-200 bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.5rem]">
      <div
        id="document-main-thread"
        className="h-full overflow-y-scroll px-5 pb-0 pt-4"
      >
        <div onClick={(e) => showNewThreadPopup(e, -1)} className="relative">
          <ContentWithHighlight
            id="document-content-container"
            content={discussion.content}
            highlights={discussion.highlights}
          />
          {isNewThreadPopupInDiscussionOpen && (
            <Button
              onClick={(e) => handleCommentInNewThread()}
              className="new-thread-popup-btn absolute z-50 rounded-2xl border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition duration-200 hover:bg-neutral-100"
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
              Comment
            </Button>
          )}
          <HoverCard
            openDelay={50}
            closeDelay={100}
            open={isThreadInfoPopupOpen}
          >
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
        </div>
        {discussion.comments.length > 0 && (
          <>
            <Separator className="my-12" />
            <div className="mb-6 flex items-center text-sm font-medium text-neutral-700">
              <MessageCircle className="mr-2 h-3.5 w-3.5" strokeWidth={2.5} />
              General comments
            </div>
          </>
        )}
        {discussion.comments.map((comment) => (
          <div
            key={comment.comment_id}
            className={`${
              comment.comment_id === discussion.comments.length - 1 &&
              wasNewCommentAdded
                ? "new-comment"
                : ""
            } group relative mt-5 w-full rounded-2xl border ${
              comment.is_conclusion
                ? "border-green-500 bg-green-500/5"
                : "bg-[#FFFFFF]"
            } p-5`}
            id={`0-${comment.comment_id}`}
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
                id={`0-${comment.comment_id}-text-container`}
                content={comment.content}
                highlights={comment.highlights}
              />
            </div>
            {isNewThreadPopupInCommentOpen[comment.comment_id] && (
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
                  newThreadPopupInCommentRef.current[comment.comment_id] = v;
                }}
              >
                <MessageSquareQuote className="mr-2 mt-0.5 h-4 w-4" />
                Comment
              </Button>
            )}
          </div>
        ))}
      </div>
      {showUnreadIndicator && discussionUnreadComments[0] > 0 && (
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

export default MainThread;
