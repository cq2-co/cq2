"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquareQuote,
  MessageSquareText,
  SendHorizonal,
  MessageSquareShare,
} from "lucide-react";
import ContentWithHighlight from "./content-with-highlight";
import { Button } from "@/components/ui/button";
import { useDiscussionStore } from "@/state";
import { useOpenThreadsStore } from "@/state";
import { useCurrentHighlightsStore } from "@/state";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { dmSans } from "@/app/fonts";
import { getNewOpenThreads } from "@/lib/utils";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const ChildThread = ({ threadID }) => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const { openThreads, setNewOpenThreads } = useOpenThreadsStore();
  const { currentHighlights, setNewCurrentHighlights } =
    useCurrentHighlightsStore();

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("threads-scrollable-container").scrollTo({
        left: 99999,
        behavior: "smooth",
      });
    }, 25);
  }, [openThreads]);

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

    setNewDiscussion({
      ...discussion,
      threads: newThreads,
    });

    let newOpenThreads = openThreads.filter(
      (thread_id) => thread_id <= threadID,
    );
    newOpenThreads.push(newThreadID);
    setNewOpenThreads(newOpenThreads);

    setNewCurrentHighlights([]);
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
      highlight_id: comment.highlights.length + 1,
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

    setNewDiscussion({
      ...discussion,
      threads: newThreads,
    });

    window.getSelection().empty();

    setIsNewThreadPopupOpen(Array(discussion.comments.length + 1).fill(false));

    let newOpenThreads = openThreads.filter(
      (thread_id) => thread_id <= threadID,
    );
    newOpenThreads.push(newThreadID);
    setNewOpenThreads(newOpenThreads);

    let newCurrentHighlights = [];
    newCurrentHighlights = currentHighlights.filter(
      (highlight) =>
        highlight.from_thread_id < newHighlightToAdd.from_thread_id,
    );
    newCurrentHighlights.push(newHighlightToAdd);
    setNewCurrentHighlights(newCurrentHighlights);
  };

  const handleCommentInThread = () => {
    const text = editor.getText();
    if (!text) {
      return;
    }

    const newThreadComments = [].concat(thread.comments, {
      comment_id: thread.comments.length + 1,
      user_id: "alex",
      user_name: "Alex",
      content: text,
      timestamp: Date.now(),
      highlights: [],
      whole_to_thread_id: null,
    });
    const newThread = { ...thread, comments: newThreadComments };

    const newThreads = discussion.threads.filter(
      (thread) => thread.thread_id !== threadID,
    );
    newThreads.push(newThread);

    setNewDiscussion({ ...discussion, threads: newThreads });

    editor.commands.clearContent();
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your comment…",
      }),
    ],
    autofocus: thread.comments.length === 0 ? true : false,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

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

    const xOffset = id === 0 ? 35 : 30;
    const yOffset = id === 0 ? 25 : 60;

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
    setNewCurrentHighlights([]);
  };

  return (
    <Card className="child-thread h-full w-[calc((100vw-14rem)/2)] overflow-y-scroll rounded-none border-0 border-l bg-neutral-100 shadow-none 2xl:w-[45rem]">
      <CardHeader>
        <div className="rounded-sm border-l-8 border-neutral-400 bg-neutral-200 px-3 py-2 text-neutral-700">
          <span
            className={`${dmSans.className} mb-1 block text-sm text-neutral-500`}
          >
            {thread.quote_by}:
          </span>
          {thread.quote}
        </div>
      </CardHeader>
      <CardContent>
        {thread.comments.length > 0 && (
          <div className="mb-4 mt-6 text-sm text-neutral-500">
            {thread.comments.length}{" "}
            {thread.comments.length === 1 ? "comment" : "comments"}
          </div>
        )}
        {thread.comments.map((comment) => (
          <div
            className="relative mt-3 w-full rounded border bg-white p-5"
            key={comment.comment_id}
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
                className="absolute right-5 top-5 h-6 w-6 p-0 text-neutral-400 hover:text-neutral-700"
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
          className={`${
            thread.comments.length > 0 ? "mt-12" : "mt-6"
          } mb-4 text-sm text-neutral-500`}
        >
          New comment
        </div>
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
            <SendHorizonal className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildThread;
