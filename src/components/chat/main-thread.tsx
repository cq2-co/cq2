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
  useChatStore,
  useChatOpenThreadsStore,
  useChatCurrentHighlightsStore,
} from "@/state";
import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { find } from "lodash";
import { getNewChatOpenThreads } from "@/lib/utils";
import ContentWithHighlight from "./content-with-highlight";

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const MainThread = () => {
  const { chat, setNewChat } = useChatStore();
  const { chatCurrentHighlights, setNewChatCurrentHighlights } =
    useChatCurrentHighlightsStore();
  const { chatOpenThreads, setNewChatOpenThreads } = useChatOpenThreadsStore();

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

  const handleCommentInThread = () => {
    const text = editor.getText();

    if (!text) {
      return;
    }

    const newComments = [].concat(chat.comments, {
      comment_id: chat.comments.length,
      user_id: "alex",
      user_name: "Alex",
      content: text,
      created_on: Date.now(),
      highlights: [],
      whole_to_thread_id: null,
    });

    setNewChat({ ...chat, comments: newComments });
    editor.commands.clearContent();

    setTimeout(() => {
      document.getElementById("chat-main-thread").scrollTo({
        top: 999999,
        behavior: "smooth",
      });
    }, 25);
  };

  useCustomEventListener("enter-key-tiptap", handleCommentInThread);

  const handleCommentWholeInNewThread = (comment) => {
    const text = comment.content;

    const newThreadID = chat.threads.length + 1;

    const newThreads = [].concat(chat.threads, {
      thread_id: newThreadID,
      parent_thread_id: 0,
      quote: text,
      quote_by: comment.user_name,
      quote_parent_comment_created_on: comment.created_on,
      comments: [],
    });

    const newComment = { ...comment, whole_to_thread_id: newThreadID };

    const newComments = chat.comments.filter(
      (_comment) => _comment.comment_id !== comment.comment_id,
    );
    newComments.push(newComment);
    newComments.sort((a, b) => a.comment_id - b.comment_id);

    setNewChat({
      ...chat,
      threads: newThreads,
      comments: newComments,
    });

    setNewChatOpenThreads([newThreadID]);
    setNewChatCurrentHighlights([
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

    const newThreadID = chat.threads.length + 1;

    let newHighlightToAdd = {};

    const newThreads = [].concat(chat.threads, {
      thread_id: newThreadID,
      parent_thread_id: 0,
      quote: text,
      quote_by: comment.user_name,
      quote_parent_comment_created_on: comment.created_on,
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

    const newComments = chat.comments.filter(
      (_comment) => _comment.comment_id !== comment.comment_id,
    );
    newComments.push(newComment);
    newComments.sort((a, b) => a.comment_id - b.comment_id);

    setNewChat({
      ...chat,
      threads: newThreads,
      comments: newComments,
    });

    window.getSelection().empty();

    setIsNewThreadPopupOpen(Array(chat.comments.length).fill(false));

    setNewChatOpenThreads([newThreadID]);

    setNewChatCurrentHighlights([newHighlightToAdd]);
  };

  const [isNewThreadPopupOpen, setIsNewThreadPopupOpen] = useState(
    Array(chat.comments.length).fill(false),
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

      setIsNewThreadPopupOpen(Array(chat.comments.length).fill(false));
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

    if (!text || text.charCodeAt(0) === 10) {
      return;
    }

    const bounds = e.target.getBoundingClientRect();

    setNewThreadPopupCoords({
      x: e.clientX - bounds.left + 25,
      y: e.clientY - bounds.top + 42,
    });

    const newIsNewThreadPopupOpen = isNewThreadPopupOpen;
    newIsNewThreadPopupOpen[id] = true;
    setIsNewThreadPopupOpen(newIsNewThreadPopupOpen);
  };

  const handleOpenWholeCommentThread = (comment) => {
    setNewChatOpenThreads(
      getNewChatOpenThreads(comment.whole_to_thread_id, chat),
    );
    setNewChatCurrentHighlights([
      {
        highlight_id: -1,
        offset: -1,
        length: -1,
        from_thread_id: 0,
        to_thread_id: comment.whole_to_thread_id,
      },
    ]);
  };

  let mainThreadWrapperStyle = "";

  if (chatOpenThreads.length > 0) {
    mainThreadWrapperStyle = "w-[calc((100vw-14rem)/2)]";
  } else {
    mainThreadWrapperStyle = "w-[calc(100vw-14rem)]";
  }

  return (
    <div
      className={`${mainThreadWrapperStyle} flex h-full flex-col rounded-none border-0 bg-[#FFFFFF] p-5 shadow-none`}
    >
      <div
        id="chat-main-thread"
        className="mb-5 flex h-full w-full flex-col-reverse overflow-y-scroll pr-5 pt-0.5"
      >
        {chat.comments
          .sort((a, b) => b.comment_id - a.comment_id)
          .map((comment) => (
            <div
              key={comment.comment_id}
              className={`${
                comment.comment_id !== 0 ? "mt-3" : ""
              } group relative ml-[1.65rem] w-fit max-w-[calc((100vw-26rem)/2)] rounded-xl bg-neutral-100 py-3 pl-3 pr-10`}
            >
              <h3
                className={`${satoshi.className} mb-1 flex items-center text-sm font-medium text-neutral-700`}
              >
                <Avatar className="absolute left-[-1.65rem] top-0 inline-flex h-8 w-8 border-2 border-white text-[0.6rem]">
                  <AvatarImage src={`/avatars/${comment.user_id}.png`} />
                  <AvatarFallback>
                    {comment.user_id[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {comment.user_name}
                <span className="ml-3 font-normal text-neutral-400">
                  {dayjs(comment.created_on).fromNow(true)}
                </span>
              </h3>
              {comment.whole_to_thread_id === null ? (
                <Button
                  onClick={(e) => {
                    handleCommentWholeInNewThread(comment);
                  }}
                  className="absolute right-3 top-3 hidden h-4 w-4 p-0 text-neutral-400 hover:text-neutral-700 group-hover:flex"
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
                    find(chatCurrentHighlights, {
                      highlight_id: -1,
                      offset: -1,
                      length: -1,
                      from_thread_id: 0,
                      to_thread_id: comment.whole_to_thread_id,
                    })
                      ? "bg-[#FF5F1F]/10 text-[#FF5F1F] hover:bg-[#FF5F1F]/10 hover:text-[#FF5F1F]"
                      : "bg-[#e1e1e1] text-neutral-700 hover:bg-[#d7d7d7] hover:text-neutral-700"
                  } absolute right-2 top-2 h-6 w-6 p-1`}
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
                  className="absolute z-50 rounded-xl border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 shadow-xl outline outline-1 outline-neutral-200 hover:bg-neutral-100"
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
      </div>
      <div
        className={
          "relative mt-auto w-full rounded-xl border border-neutral-400 bg-[#FFFFFF]"
        }
      >
        <EditorContent
          editor={editor}
          className="chat-editor min-h-[2.48rem] pr-[2.8rem] text-[15px] leading-normal text-neutral-700"
        />
        <Button
          className="absolute bottom-[0.25rem] right-[0.25rem] h-8 w-8 rounded-lg bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none hover:bg-neutral-700"
          variant="secondary"
          onClick={handleCommentInThread}
        >
          <SendHorizonal className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default MainThread;
