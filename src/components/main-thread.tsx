"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareQuote, SendHorizonal } from "lucide-react";
import ContentWithHighlight from "./content-with-highlight";
import { Button } from "@/components/ui/button";
import CharacterCount from "@tiptap/extension-character-count";
import { useDiscussionStore } from "@/state";
import { useOpenThreadsStore } from "@/state";
import { useCurrentHighlightsStore } from "@/state";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { dmSans } from "@/app/fonts";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const MainThread = () => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const { openThreads, setNewOpenThreads } = useOpenThreadsStore();
  const { currentHighlights, setNewCurrentHighlights } =
    useCurrentHighlightsStore();

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
    cardStyle = "w-[45rem]";
  } else {
    cardStyle = "w-[calc(100vw-14rem)] flex justify-center";
    cardContentStyle = "w-[44.4rem] pb-6 h-fit";
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
    });

    setNewDiscussion({ ...discussion, comments: newComments });
    editor.commands.clearContent();
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

    const xOffset = id === 0 ? 35 : 32;
    const yOffset = id === 0 ? 25 : 62;

    setNewThreadPopupCoords({
      x: e.clientX - bounds.left + xOffset,
      y: e.clientY - bounds.top + yOffset,
    });

    const newIsNewThreadPopupOpen = isNewThreadPopupOpen;
    newIsNewThreadPopupOpen[id] = true;
    setIsNewThreadPopupOpen(newIsNewThreadPopupOpen);
  };

  return (
    <Card
      className={`${cardStyle} h-full overflow-y-scroll rounded-none border-0 border-neutral-200 bg-neutral-100 pt-6 shadow-none`}
    >
      <CardContent className={`${cardContentStyle}`}>
        <div className="relative rounded-sm border bg-white p-5">
          <div onClick={(e) => showNewThreadPopup(e, 0)}>
            <ContentWithHighlight
              content={discussion.content}
              ranges={discussion.highlights}
            />
          </div>
          {isNewThreadPopupOpen[0] && (
            <Button
              onClick={(e) => handleCommentInNewThread()}
              className="absolute z-50 border-4 border-white bg-white p-2 font-normal text-neutral-800 shadow-xl outline outline-1 outline-neutral-200 hover:bg-neutral-100"
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
        </div>
        <div className="mb-4 mt-12 text-sm text-neutral-500">
          {discussion.comments.length}{" "}
          {discussion.comments.length === 1 ? "comment" : "comments"}
        </div>
        {discussion.comments.map((comment) => (
          <div
            key={comment.comment_id}
            className={`${comment.comment_id === 1 ? "rounded-t-sm" : ""} ${
              comment.comment_id === discussion.comments.length
                ? "rounded-b-sm border-b"
                : ""
            } relative w-full border-l border-r border-t bg-white p-5`}
          >
            <h3
              className={`${dmSans.className} mb-3 inline-block text-sm font-medium text-neutral-700 dark:text-white`}
            >
              {comment.user_name}
              <span className="ml-3 font-normal text-neutral-400">
                {dayjs(comment.timestamp).fromNow(true)}
              </span>
            </h3>
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
                className="absolute z-50 border-4 border-white bg-white p-2 font-normal text-neutral-800 shadow-xl outline outline-1 outline-neutral-200 hover:bg-neutral-100"
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
        <div
          className={
            "relative mt-5 min-h-[8rem] w-full rounded-sm border bg-white px-5 pt-5"
          }
        >
          <EditorContent editor={editor} className="text-neutral-700" />
          <Button
            className="absolute bottom-5 right-5 h-9 w-9 rounded-full p-2.5"
            variant="secondary"
            onClick={handleCommentInThread}
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MainThread;
