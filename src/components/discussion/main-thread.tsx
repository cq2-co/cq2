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
  getNewDiscussionOpenThreads,
} from "@/lib/utils";
import {
  useDiscussionCurrentHighlightsStore,
  useDiscussionOpenThreadsStore,
  useDiscussionStore,
  useDiscussionUnreadCommentsStore,
  useShowConcludeThreadCommentBoxStore,
} from "@/state";
import Blockquote from "@tiptap/extension-blockquote";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import dayjs from "dayjs";
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

const MainThread = () => {
  const { discussion, setNewDiscussion } = useDiscussionStore();

  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
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
      selection?.anchorNode?.parentNode?.parentNode?.tagName === "BLOCKQUOTE"
    ) {
      toast.warning("Quoting a quote is not allowed");

      window.getSelection().empty();

      setIsNewThreadPopupInCommentOpen(
        Array(discussion.comments.length).fill(false),
      );
      setIsNewThreadPopupInDiscussionOpen(false);

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
      toast.warning("Quoting with a quote inside isn't allowed yet");

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

    const newComments = [].concat(discussion.comments, {
      comment_id: discussion.comments.length,
      user_name: cq2UserName || userName,
      content: commentHTML,
      created_on: Date.now(),
      highlights: [],
      whole_to_thread_id: -1,
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
      document.getElementById("discussion-main-thread").scrollTo({
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
      "discussion-main-thread",
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

  return (
    <div className="relative flex h-full w-[calc((100vw)/2)] flex-col rounded-none border-r border-neutral-200 bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.5rem]">
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
            } group relative mt-5 w-full rounded-none border ${
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
                      <MessageSquareQuote className="h-4 w-4" />
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
      {showUnreadIndicator && discussionUnreadComments[0] > 0 && (
        <div
          className={`${satoshi.className} absolute bottom-32 left-1/2 w-fit -translate-x-1/2 border border-neutral-200 bg-white px-2 py-1 text-sm font-medium text-neutral-500 shadow-md`}
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

export default MainThread;
