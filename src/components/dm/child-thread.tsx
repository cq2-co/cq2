"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { satoshi } from "@/app/fonts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SendHorizonal,
  MessageSquareShare,
  MessageSquareText,
  MessageSquareQuote,
} from "lucide-react";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import {
  useDMStore,
  useDMOpenThreadsStore,
  useDMCurrentHighlightsStore,
} from "@/state";
import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { find } from "lodash";
import { getNewDMOpenThreads, getNewDMCurrentHighlights } from "@/lib/utils";
import ContentWithHighlight from "./content-with-highlight";

const ChildThread = ({ threadID }) => {
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

  const { dm, setNewDM } = useDMStore();
  const { dmOpenThreads, setNewDMOpenThreads } = useDMOpenThreadsStore();
  const { dmCurrentHighlights, setNewDMCurrentHighlights } =
    useDMCurrentHighlightsStore();

  const [isNewThreadPopupOpen, setIsNewThreadPopupOpen] = useState(
    Array(dm.comments.length).fill(false),
  );

  const [newThreadPopupCoords, setNewThreadPopupCoords] = useState({});

  const newThreadPopupRef = useRef([]);

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("dms-threads-scrollable-container").scrollTo({
        left: 999999,
        behavior: "smooth",
      });
    }, 25);
  }, [dmOpenThreads]);

  const thread = dm.threads.filter(
    (thread) => thread.thread_id === threadID,
  )[0];

  const handleCommentWholeInNewThread = (comment) => {
    const text = comment.content;

    const newThreadID = dm.threads.length + 1;

    let newThreads = [].concat(dm.threads, {
      thread_id: newThreadID,
      parent_thread_id: threadID,
      quote: text,
      quote_by: comment.user_name,
      quote_parent_comment_created_on: comment.created_on,
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

    setNewDM({
      ...dm,
      threads: newThreads,
    });

    let newOpenThreads = dmOpenThreads.filter(
      (thread_id) => thread_id <= threadID,
    );
    newOpenThreads.push(newThreadID);
    setNewDMOpenThreads(newOpenThreads);

    const newHighlightToAdd = {
      highlight_id: -1,
      offset: -1,
      length: -1,
      from_thread_id: threadID,
      to_thread_id: newThreadID,
    };
    let newCurrentHighlights = [];
    newCurrentHighlights = dmCurrentHighlights.filter(
      (highlight) =>
        highlight.from_thread_id < newHighlightToAdd.from_thread_id,
    );
    newCurrentHighlights.push(newHighlightToAdd);
    setNewDMCurrentHighlights(newCurrentHighlights);
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

    const newThreadID = dm.threads.length + 1;

    let newThreads = [].concat(dm.threads, {
      thread_id: newThreadID,
      parent_thread_id: threadID,
      quote: text,
      quote_by: comment.user_name,
      quote_parent_comment_created_on: comment.created_on,
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

    setNewDM({
      ...dm,
      threads: newThreads,
    });

    window.getSelection().empty();

    setIsNewThreadPopupOpen(Array(dm.comments.length).fill(false));

    let newOpenThreads = dmOpenThreads.filter(
      (thread_id) => thread_id <= threadID,
    );
    newOpenThreads.push(newThreadID);
    setNewDMOpenThreads(newOpenThreads);

    let newCurrentHighlights = [];
    newCurrentHighlights = dmCurrentHighlights.filter(
      (highlight) =>
        highlight.from_thread_id < newHighlightToAdd.from_thread_id,
    );
    newCurrentHighlights.push(newHighlightToAdd);
    setNewDMCurrentHighlights(newCurrentHighlights);
  };

  const handleCommentInThread = () => {
    const text = editor.getText();
    if (!text) {
      return;
    }

    const newThreadComments = [].concat(thread.comments, {
      comment_id: thread.comments.length,
      user_id: "alex",
      user_name: "Alex",
      content: text,
      created_on: Date.now(),
      highlights: [],
      whole_to_thread_id: null,
    });
    const newThread = { ...thread, comments: newThreadComments };

    const newThreads = dm.threads.filter(
      (thread) => thread.thread_id !== threadID,
    );
    newThreads.push(newThread);

    setNewDM({ ...dm, threads: newThreads });

    editor.commands.clearContent();

    setTimeout(() => {
      document.getElementById(`child-thread-${threadID}`).scrollTo({
        top: 999999,
        behavior: "smooth",
      });
    }, 25);
  };

  useCustomEventListener("enter-key-tiptap", handleCommentInThread);

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

      setIsNewThreadPopupOpen(Array(dm.comments.length).fill(false));
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
      x: e.clientX - bounds.left + 25,
      y: e.clientY - bounds.top + 45,
    });

    const newIsNewThreadPopupOpen = isNewThreadPopupOpen;
    newIsNewThreadPopupOpen[id] = true;
    setIsNewThreadPopupOpen(newIsNewThreadPopupOpen);
  };

  const handleOpenWholeCommentThread = (comment) => {
    setNewDMOpenThreads(getNewDMOpenThreads(comment.whole_to_thread_id, dm));
    setNewDMCurrentHighlights(
      getNewDMCurrentHighlights(
        {
          highlight_id: -1,
          offset: -1,
          length: -1,
          from_thread_id: threadID,
          to_thread_id: comment.whole_to_thread_id,
        },
        dmCurrentHighlights,
      ),
    );
  };

  return (
    <div className="flex h-full w-[calc((100vw-14rem)/2)] flex-col rounded-none border-l border-neutral-200 bg-[#FFFFFF] p-5 shadow-none">
      <div
        id={`child-thread-${threadID}`}
        className="mb-5 flex h-full w-full flex-col-reverse overflow-y-scroll pr-5 pt-0.5"
      >
        {thread.comments
          .sort((a, b) => b.comment_id - a.comment_id)
          .map((comment) => (
            <div
              key={comment.comment_id}
              className={`group relative ml-[1.65rem] mt-5 w-fit max-w-[calc((100vw-26rem)/2)] rounded-sm bg-neutral-100 py-3 pl-3 pr-10`}
            >
              <h3
                className={`${satoshi.className} mb-1 flex items-center text-sm font-semibold text-neutral-700`}
              >
                <Avatar className="absolute left-[-1.65rem] top-0 inline-flex h-8 w-8 border-2 border-white text-[0.6rem]">
                  <AvatarImage src={`/avatars/${comment.user_id}.png`} />
                  <AvatarFallback>
                    {comment.user_id[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  {comment.user_name}
                  <span className="ml-3 text-xs font-normal text-neutral-400">
                    {dayjs(comment.created_on).format("DD/MM/YY hh:mm A")}
                  </span>
                </div>
              </h3>
              {comment.whole_to_thread_id === null ? (
                <Button
                  onClick={(e) => {
                    handleCommentWholeInNewThread(comment);
                  }}
                  className="absolute right-3 top-3 hidden h-4 w-4 rounded-sm p-0 text-neutral-400 duration-200 hover:text-neutral-700 group-hover:flex"
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
                    find(dmCurrentHighlights, {
                      highlight_id: -1,
                      offset: -1,
                      length: -1,
                      from_thread_id: threadID,
                      to_thread_id: comment.whole_to_thread_id,
                    })
                      ? "bg-[#FF5F1F]/10 text-[#FF5F1F] hover:bg-[#FF5F1F]/10 hover:text-[#FF5F1F]"
                      : "bg-[#e1e1e1] text-neutral-700 hover:bg-[#d7d7d7] hover:text-neutral-700"
                  } absolute right-2 top-2 h-6 w-6 rounded-sm p-1 transition duration-200`}
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
                  className="new-thread-popup-btn absolute z-50 rounded-sm border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition duration-200 hover:bg-neutral-100"
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
                  Comment in new thread
                </Button>
              )}
            </div>
          ))}
        <div
          className={`group relative ml-[1.65rem] w-fit max-w-[calc((100vw-26rem)/2)] rounded-sm bg-neutral-100 py-3 pl-3 pr-10`}
        >
          <h3
            className={`${satoshi.className} mb-1 flex items-center text-sm font-semibold text-neutral-700`}
          >
            <Avatar className="absolute left-[-1.65rem] top-0 inline-flex h-8 w-8 border-2 border-white text-[0.6rem]">
              <AvatarImage
                src={`/avatars/${thread.quote_by.toLowerCase()}.png`}
              />
              <AvatarFallback>{thread.quote_by[0]}</AvatarFallback>
            </Avatar>
            <div>
              {thread.quote_by}
              <span className="ml-3 text-xs font-normal text-neutral-400">
                {dayjs(thread.quote_parent_comment_created_on).format(
                  "DD/MM/YY hh:mm A",
                )}
              </span>
            </div>
          </h3>
          <div className="mt-2 border-l-8 border-[#FF5F1F]/20 px-3 text-neutral-700">
            <ContentWithHighlight content={thread.quote} ranges={[]} />
          </div>
        </div>
      </div>
      <div
        className={
          "relative mt-auto w-full rounded-sm border border-neutral-400 bg-[#FFFFFF]"
        }
      >
        <EditorContent
          editor={editor}
          className="dm-editor min-h-[2.48rem] pr-[2.8rem] text-neutral-700"
        />
        <Button
          className="absolute bottom-[0.25rem] right-[0.25rem] h-8 w-8 rounded-sm bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-700"
          variant="secondary"
          onClick={handleCommentInThread}
        >
          <SendHorizonal className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default ChildThread;
