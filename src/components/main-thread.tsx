"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquareQuote,
  MessageSquareText,
  SendHorizonal,
  MessageSquareShare,
  MessageSquarePlus,
} from "lucide-react";
import ContentWithHighlight from "./content-with-highlight";
import { Button } from "@/components/ui/button";
import CharacterCount from "@tiptap/extension-character-count";
import { useDiscussionStore } from "@/state";
import { useOpenThreadsStore } from "@/state";
import { useCurrentHighlightsStore } from "@/state";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { dmSans } from "@/app/fonts";
import { getNewOpenThreads } from "@/lib/utils";
import { find } from "lodash";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const MainThread = () => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const { openThreads, setNewOpenThreads } = useOpenThreadsStore();
  const { currentHighlights, setNewCurrentHighlights } =
    useCurrentHighlightsStore();

  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);

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

    setNewOpenThreads([newThreadID]);
    setNewCurrentHighlights([
      {
        highlight_id: -1,
        offset: -1,
        length: -1,
        from_thread_id: 0,
        to_thread_id: newThreadID,
      },
    ]);

    setIsCommentBoxOpen(false);
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
        highlight_id: comment.highlights.length + 1,
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
        highlight_id: discussion.highlights.length + 1,
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

    setIsNewThreadPopupOpen(Array(discussion.comments.length + 1).fill(false));

    setNewOpenThreads([newThreadID]);

    setNewCurrentHighlights([newHighlightToAdd]);

    setIsCommentBoxOpen(false);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your comment...",
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

  let cardStyle = "";
  let cardContentStyle = "";

  if (openThreads.length > 0) {
    cardStyle = "w-[calc((100vw-14rem)/2)] 2xl:w-[49rem]";
  } else {
    cardStyle = "w-[calc(100vw-14rem)] flex justify-center";
    cardContentStyle =
      "w-[calc((100vw-14rem-1.5rem)/2)] 2xl:w-[48rem] pb-6 h-fit";
  }

  const handleCommentInThread = () => {
    const text = editor.getText();

    if (!text) {
      return;
    }

    const newComments = [].concat(discussion.comments, {
      comment_id: discussion.comments.length + 1,
      user_id: "alex",
      user_name: "Alex",
      content: text,
      timestamp: Date.now(),
      highlights: [],
      whole_to_thread_id: null,
    });

    setNewDiscussion({ ...discussion, comments: newComments });
    editor.commands.clearContent();

    setIsCommentBoxOpen(false);
  };

  const [isNewThreadPopupOpen, setIsNewThreadPopupOpen] = useState(
    Array(discussion.comments.length + 1).fill(false),
  );

  const [newThreadPopupCoords, setNewThreadPopupCoords] = useState({});

  const newThreadPopupRef = useRef([]);

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

      setIsNewThreadPopupOpen(
        Array(discussion.comments.length + 1).fill(false),
      );
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

    let xOffset = 0;
    let yOffset = 0;

    if (openThreads.length > 0) {
      xOffset = id === 0 ? 10 : 32;
      yOffset = id === 0 ? 10 : 60;
    } else {
      xOffset = id === 0 ? 10 : 32;
      yOffset = id === 0 ? 125 : 60;
    }

    setNewThreadPopupCoords({
      x: e.clientX - bounds.left + xOffset,
      y: e.clientY - bounds.top + yOffset,
    });

    const newIsNewThreadPopupOpen = isNewThreadPopupOpen;
    newIsNewThreadPopupOpen[id] = true;
    setIsNewThreadPopupOpen(newIsNewThreadPopupOpen);
  };

  const handleOpenWholeCommentThread = (comment) => {
    setNewOpenThreads(
      getNewOpenThreads(comment.whole_to_thread_id, discussion),
    );
    setNewCurrentHighlights([
      {
        highlight_id: -1,
        offset: -1,
        length: -1,
        from_thread_id: 0,
        to_thread_id: comment.whole_to_thread_id,
      },
    ]);
    setIsCommentBoxOpen(false);
  };

  return (
    <div>
      <Card
        className={`${cardStyle} h-full overflow-y-scroll rounded-none border-0 border-neutral-200 ${
          openThreads.length > 0 ? "" : "pb-16"
        } shadow-none`}
      >
        <CardContent className={`${cardContentStyle}`}>
          <div className="relative mt-4">
            <div
              className={`${
                openThreads.length > 0 ? "hidden" : "mt-24"
              } text-3xl font-semibold leading-[2.3rem] text-neutral-700`}
            >
              {discussion.title}
            </div>
            <div
              className={`${
                openThreads.length > 0 ? "hidden" : ""
              } mb-12 mt-3 text-sm font-normal text-neutral-500`}
            >
              by{" "}
              <span
                className={`${dmSans.className} text-sm font-medium text-neutral-700`}
              >
                {discussion.user_name}
              </span>
            </div>
            <div onClick={(e) => showNewThreadPopup(e, 0)} className="mt-6">
              <ContentWithHighlight
                content={discussion.content}
                ranges={discussion.highlights}
              />
            </div>
            {isNewThreadPopupOpen[0] && (
              <Button
                onClick={(e) => handleCommentInNewThread()}
                className="absolute z-50 rounded-xl border-4 border-white bg-white p-2 font-normal text-neutral-800 shadow-xl outline outline-1 outline-neutral-200 hover:bg-neutral-100"
                style={{
                  left: newThreadPopupCoords.x,
                  top: newThreadPopupCoords.y,
                }}
                key={0}
                ref={(v) => {
                  newThreadPopupRef.current[0] = v;
                }}
              >
                <MessageSquareQuote className="mr-2 h-4 w-4" />
                Comment in new thread
              </Button>
            )}
            <Button
              onClick={(e) => {
                setIsCommentBoxOpen(true);
                editor.commands.focus();
              }}
              className="mb-12 mt-5 h-8 rounded-full bg-neutral-100 p-3 text-xs font-medium text-neutral-800 shadow-none hover:bg-neutral-200"
              variant="secondary"
            >
              <MessageSquarePlus className="mr-2 mt-0.5 h-4 w-4" />
              Comment
            </Button>
          </div>
          {isCommentBoxOpen && (
            <div
              className={
                "relative mb-12 min-h-[8rem] w-full rounded-xl border bg-white px-5 pt-5"
              }
            >
              <EditorContent editor={editor} className="text-neutral-700" />
              <Button
                className="absolute bottom-5 right-5 h-9 w-9 rounded-full bg-neutral-700 p-2.5 font-normal text-neutral-50 shadow-none hover:bg-neutral-800"
                variant="secondary"
                onClick={handleCommentInThread}
              >
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          )}
          {discussion.comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="relative mt-3 w-full rounded-xl border bg-white p-5"
            >
              <h3
                className={`${dmSans.className} mb-3 inline-block text-sm font-medium text-neutral-700 dark:text-white`}
              >
                {comment.user_name}
                <span className="ml-3 font-normal text-neutral-400">
                  {dayjs(comment.timestamp).fromNow(true)}
                </span>
              </h3>
              {comment.whole_to_thread_id === null ? (
                <Button
                  onClick={(e) => {
                    handleCommentWholeInNewThread(comment);
                  }}
                  className="absolute right-5 top-5 h-6 w-6 p-0 text-neutral-400 hover:text-neutral-700"
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
                    find(currentHighlights, {
                      highlight_id: -1,
                      offset: -1,
                      length: -1,
                      from_thread_id: 0,
                      to_thread_id: comment.whole_to_thread_id,
                    })
                      ? "bg-[#FF5F1F]/10 text-[#FF5F1F] hover:bg-[#FF5F1F]/10 hover:text-[#FF5F1F]"
                      : "text-neutral-400 hover:text-neutral-700"
                  } absolute right-5 top-5 h-6 w-6 p-0`}
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
                  className="absolute z-50 rounded-xl border-4 border-white bg-white p-2 font-normal text-neutral-800 shadow-xl outline outline-1 outline-neutral-200 hover:bg-neutral-100"
                  style={{
                    left: newThreadPopupCoords.x,
                    top: newThreadPopupCoords.y,
                  }}
                  key={comment.comment_id}
                  ref={(v) => {
                    newThreadPopupRef.current[comment.comment_id] = v;
                  }}
                >
                  <MessageSquareQuote className="mr-2 h-4 w-4" />
                  Comment in new thread
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainThread;
