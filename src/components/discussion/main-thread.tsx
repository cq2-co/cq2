"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  MessageSquareQuote,
  MessageSquareText,
  MessageSquareShare,
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
import { getNewDiscussionOpenThreads } from "@/lib/utils";
import { find } from "lodash";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

const MainThread = () => {
  const { discussion, setNewDiscussion } = useDiscussionStore();

  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
  const { discussionCurrentHighlights, setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();

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

    setNewDiscussion({
      ...discussion,
      threads: newThreads,
      comments: newComments,
    });

    setNewDiscussionOpenThreads([newThreadID]);
    setNewDiscussionCurrentHighlights([
      {
        highlight_id: -1,
        offset: -1,
        length: -1,
        from_thread_id: 0,
        to_thread_id: newThreadID,
      },
    ]);
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

    let newHighlightToAdd = {};

    if (comment) {
      const newThreads = [].concat(discussion.threads, {
        thread_id: newThreadID,
        parent_thread_id: 0,
        quote: text,
        quote_by: comment.user_name,
        comments: [],
      });

      newHighlightToAdd = {
        highlight_id: comment.highlights.length,
        offset: newOffset,
        length: textLen,
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

      setNewDiscussion({
        ...discussion,
        threads: newThreads,
        comments: newComments,
      });
    } else {
      const newThreads = [].concat(discussion.threads, {
        thread_id: newThreadID,
        parent_thread_id: 0,
        quote: text,
        quote_by: discussion.user_name,
        comments: [],
      });

      newHighlightToAdd = {
        highlight_id: discussion.highlights.length,
        offset: newOffset,
        length: textLen,
        from_thread_id: 0,
        to_thread_id: newThreadID,
      };

      const newHighlights = [].concat(discussion.highlights, newHighlightToAdd);

      setNewDiscussion({
        ...discussion,
        threads: newThreads,
        highlights: newHighlights,
      });
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
        placeholder: "Write a message...",
      }),
      CharacterCount.configure({
        limit: 4000,
      }),
      NoNewLine,
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  const handleCommentInThread = () => {
    const text = editor.getText();

    if (!text) {
      return;
    }

    const newComments = [].concat(discussion.comments, {
      comment_id: discussion.comments.length,
      user_id: "alex",
      user_name: "Alex",
      content: text,
      created_on: Date.now(),
      highlights: [],
      whole_to_thread_id: null,
    });

    setNewDiscussion({ ...discussion, comments: newComments });
    editor.commands.clearContent();

    setWasNewCommentAdded(true);

    setTimeout(() => {
      document.getElementById("discussion-main-thread").scrollTo({
        top: 999999,
        behavior: "smooth",
      });
    }, 25);
  };

  useCustomEventListener("enter-key-tiptap", handleCommentInThread);

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

  const showNewThreadPopup = (e, id) => {
    const text = window.getSelection()?.toString();

    if (!text || text.charCodeAt(0) === 10) {
      return;
    }

    const bounds = e.target.getBoundingClientRect();

    const xOffset = id === -1 ? 10 : 32;
    const yOffset = id === -1 ? 10 : 60;

    setNewThreadPopupCoords({
      x: e.clientX - bounds.left + xOffset,
      y: e.clientY - bounds.top + yOffset,
    });

    if (id === -1) {
      setIsNewThreadPopupInDiscussionOpen(true);
    } else {
      const newIsNewThreadPopupOpen = isNewThreadPopupInCommentOpen;
      newIsNewThreadPopupOpen[id] = true;
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
        from_thread_id: 0,
        to_thread_id: comment.whole_to_thread_id,
      },
    ]);
  };

  return (
    <div
      className={`flex h-full w-[calc((100vw)/2)] flex-col gap-5 rounded-none border-r border-neutral-200 bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.5rem]`}
    >
      <div
        id="discussion-main-thread"
        className="h-full overflow-y-scroll px-5 pb-0 pt-4"
      >
        <div
          onClick={(e) => showNewThreadPopup(e, -1)}
          className="relative mb-16"
        >
          <ContentWithHighlight
            content={discussion.content}
            ranges={discussion.highlights}
          />
          {isNewThreadPopupInDiscussionOpen && (
            <Button
              onClick={(e) => handleCommentInNewThread()}
              className="new-thread-popup-btn absolute z-50 rounded-lg border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition duration-200 hover:bg-neutral-100"
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
            } group relative mt-3 w-full rounded-lg border bg-[#FFFFFF] p-5`}
          >
            <h3
              className={`${satoshi.className} mb-3 text-sm font-semibold text-neutral-700`}
            >
              {comment.user_name}
              <span className="ml-3 text-xs font-normal text-neutral-400">
                {dayjs(comment.created_on).format("DD/MM/YY hh:mm A")}
              </span>
            </h3>
            {comment.whole_to_thread_id === null ? (
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
                    from_thread_id: 0,
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
            {isNewThreadPopupInCommentOpen[comment.comment_id] && (
              <Button
                onClick={(e) => {
                  handleCommentInNewThread(comment);
                }}
                className="new-thread-popup-btn absolute z-50 rounded-lg border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition duration-200 hover:bg-neutral-100"
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
    </div>
  );
};

export default MainThread;
