"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  MessageSquareQuote,
  MessageSquareText,
  MessageSquareShare,
} from "lucide-react";
import ContentWithHighlight from "./content-with-highlight";
import { Button } from "@/components/ui/button";
import CharacterCount from "@tiptap/extension-character-count";
import {
  usePostOpenThreadsStore,
  usePostStore,
  usePostCurrentHighlightsStore,
} from "@/state";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { satoshi } from "@/app/fonts";
import { getNewPostOpenThreads } from "@/lib/utils";
import { find } from "lodash";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MainThread = () => {
  const { post, setNewPost } = usePostStore();
  const { postOpenThreads, setNewPostOpenThreads } = usePostOpenThreadsStore();
  const { postCurrentHighlights, setNewPostCurrentHighlights } =
    usePostCurrentHighlightsStore();

  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [wasNewCommentAdded, setWasNewCommentAdded] = useState(false);

  const [isNewThreadPopupInCommentOpen, setIsNewThreadPopupInCommentOpen] =
    useState(Array(post.comments.length).fill(false));

  const [isNewThreadPopupInPostOpen, setIsNewThreadPopupInPostOpen] =
    useState(false);

  const [newThreadPopupCoords, setNewThreadPopupCoords] = useState({});

  const newThreadPopupInCommentRef = useRef([]);
  const newThreadPopupInPostRef = useRef();

  const handleCommentWholeInNewThread = (comment) => {
    const text = comment.content;

    const newThreadID = post.threads.length + 1;

    const newThreads = [].concat(post.threads, {
      thread_id: newThreadID,
      parent_thread_id: 0,
      quote: text,
      quote_by: comment.user_name,
      comments: [],
    });

    const newComment = { ...comment, whole_to_thread_id: newThreadID };

    const newComments = post.comments.filter(
      (_comment) => _comment.comment_id !== comment.comment_id,
    );
    newComments.push(newComment);
    newComments.sort((a, b) => a.comment_id - b.comment_id);

    setNewPost({
      ...post,
      threads: newThreads,
      comments: newComments,
    });

    setNewPostOpenThreads([newThreadID]);
    setNewPostCurrentHighlights([
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

    const newThreadID = post.threads.length + 1;

    let newHighlightToAdd = {};

    if (comment) {
      const newThreads = [].concat(post.threads, {
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

      const newComments = post.comments.filter(
        (_comment) => _comment.comment_id !== comment.comment_id,
      );
      newComments.push(newComment);
      newComments.sort((a, b) => a.comment_id - b.comment_id);

      setNewPost({
        ...post,
        threads: newThreads,
        comments: newComments,
      });
    } else {
      const newThreads = [].concat(post.threads, {
        thread_id: newThreadID,
        parent_thread_id: 0,
        quote: text,
        quote_by: post.user_name,
        comments: [],
      });

      newHighlightToAdd = {
        highlight_id: post.highlights.length,
        offset: newOffset,
        length: textLen,
        from_thread_id: 0,
        to_thread_id: newThreadID,
      };

      const newHighlights = [].concat(post.highlights, newHighlightToAdd);

      setNewPost({
        ...post,
        threads: newThreads,
        highlights: newHighlights,
      });
    }

    window.getSelection().empty();

    setIsNewThreadPopupInCommentOpen(Array(post.comments.length).fill(false));
    setIsNewThreadPopupInPostOpen(false);

    setNewPostOpenThreads([newThreadID]);

    setNewPostCurrentHighlights([newHighlightToAdd]);

    setIsCommentBoxOpen(false);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
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

  const handleCommentInThread = () => {
    const text = editor.getText();

    if (!text) {
      return;
    }

    const newComments = [].concat(post.comments, {
      comment_id: post.comments.length,
      user_id: "alex",
      user_name: "Alex",
      content: text,
      created_on: Date.now(),
      highlights: [],
      whole_to_thread_id: null,
    });

    setNewPost({ ...post, comments: newComments });
    editor.commands.clearContent();

    setIsCommentBoxOpen(false);

    setWasNewCommentAdded(true);

    setTimeout(() => {
      document.getElementById("post-main-thread").scrollTo({
        top: 999999,
        behavior: "smooth",
      });
    }, 25);
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
      (newThreadPopupInPostRef.current &&
        !e.composedPath().includes(newThreadPopupInPostRef.current))
    ) {
      window.getSelection().empty();

      setIsNewThreadPopupInCommentOpen(Array(post.comments.length).fill(false));
      setIsNewThreadPopupInPostOpen(false);
    }
  };

  useEffect(() => {
    if (
      isNewThreadPopupInCommentOpen.every((v) => v === false) &&
      !isNewThreadPopupInPostOpen
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
      setIsNewThreadPopupInPostOpen(true);
    } else {
      const newIsNewThreadPopupOpen = isNewThreadPopupInCommentOpen;
      newIsNewThreadPopupOpen[id] = true;
      setIsNewThreadPopupInCommentOpen(newIsNewThreadPopupOpen);
    }
  };

  const handleOpenWholeCommentThread = (comment) => {
    setNewPostOpenThreads(
      getNewPostOpenThreads(comment.whole_to_thread_id, post),
    );
    setNewPostCurrentHighlights([
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

  let mainThreadWrapperStyle = "";
  let mainThreadStyle = "";

  if (postOpenThreads.length > 0) {
    mainThreadWrapperStyle = "w-[calc((100vw-14rem)/2)] 2xl:w-[48.5rem] pt-0";
    mainThreadStyle = "px-5 pb-5 pt-4 h-fit";
  } else {
    mainThreadWrapperStyle = "w-[calc(100vw-14rem)] justify-center pt-28";
    mainThreadStyle = "w-[48rem] pb-24 h-fit px-5";
  }

  return (
    <div
      id="post-main-thread"
      className={`${mainThreadWrapperStyle} flex h-full overflow-y-scroll rounded-none border-0 bg-[#FFFFFF] shadow-none`}
    >
      <div className={mainThreadStyle}>
        <div
          className={`${postOpenThreads.length > 0 ? "hidden" : ""} ${
            satoshi.className
          } text-4xl font-bold leading-[2.5rem] text-neutral-700`}
        >
          {post.title}
        </div>
        <div
          className={`${postOpenThreads.length > 0 ? "hidden" : ""} ${
            satoshi.className
          } mb-12 mt-3 flex items-center text-sm font-semibold text-neutral-700`}
        >
          <Avatar className="mr-2 inline-flex h-6 w-6 text-[0.6rem]">
            <AvatarImage src={`/avatars/${post.user_id}.png`} />
            <AvatarFallback>{post.user_id[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            {post.user_name}
            <span className="ml-3 text-xs font-normal text-neutral-400">
              {dayjs(post.created_on).format("DD/MM/YY hh:mm A")}
            </span>
          </div>
        </div>
        <div onClick={(e) => showNewThreadPopup(e, -1)} className="relative">
          <ContentWithHighlight
            content={post.content}
            ranges={post.highlights}
          />
          {isNewThreadPopupInPostOpen && (
            <Button
              onClick={(e) => handleCommentInNewThread()}
              className="new-thread-popup-btn absolute z-50 rounded-sm border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition duration-200 hover:bg-neutral-100"
              style={{
                left: newThreadPopupCoords.x,
                top: newThreadPopupCoords.y,
              }}
              key={0}
              ref={(v) => {
                newThreadPopupInPostRef.current = v;
              }}
            >
              <MessageSquareQuote className="mr-2 mt-0.5 h-4 w-4" />
              Comment in new thread
            </Button>
          )}
        </div>
        {!isCommentBoxOpen && (
          <Button
            onClick={(e) => {
              setIsCommentBoxOpen(true);
              editor.commands.focus();
            }}
            className="mb-12 mt-5 h-8 w-full cursor-text justify-normal rounded-sm bg-neutral-100 py-2 pl-2 text-sm font-normal text-neutral-400 shadow-none hover:bg-neutral-100"
            variant="secondary"
          >
            <Avatar className="mr-2 inline-flex h-5 w-5 text-[0.6rem]">
              <AvatarImage src={`/avatars/alex.png`} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            Add a comment...
          </Button>
        )}
        {isCommentBoxOpen && (
          <div
            className={`${
              post.comments.length > 0 ? "mb-12" : "mb-0"
            } relative mt-5 min-h-[8rem] w-full rounded-sm border border-neutral-400 bg-[#FFFFFF] px-5 pt-5`}
          >
            <h3
              className={`${satoshi.className} mb-5 flex items-center text-sm font-semibold text-neutral-700`}
            >
              <Avatar className="mr-2 inline-flex h-6 w-6 text-[0.6rem]">
                <AvatarImage src={`/avatars/alex.png`} />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              Alex
            </h3>
            <EditorContent
              editor={editor}
              className="post-editor text-neutral-700"
            />
            <Button
              className="absolute bottom-5 right-5 h-7 rounded-sm bg-neutral-800 p-[0.6rem] text-xs font-normal text-neutral-100 shadow-none transition duration-200 hover:bg-neutral-700"
              variant="secondary"
              onClick={handleCommentInThread}
            >
              Comment
            </Button>
          </div>
        )}
        {post.comments.map((comment) => (
          <div
            key={comment.comment_id}
            className={`${
              comment.comment_id === post.comments.length - 1 &&
              wasNewCommentAdded
                ? "new-comment"
                : ""
            } group relative mt-5 w-full rounded-sm border bg-[#FFFFFF] p-5`}
          >
            <h3
              className={`${satoshi.className} mb-3 flex items-center text-sm font-semibold text-neutral-700`}
            >
              <Avatar className="mr-2 inline-flex h-6 w-6 text-[0.6rem]">
                <AvatarImage src={`/avatars/${comment.user_id}.png`} />
                <AvatarFallback>
                  {comment.user_id[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {comment.user_name}
              <span className="ml-3 font-normal text-neutral-400">
                {dayjs(comment.created_on).format("DD/MM/YY hh:mm A")}
              </span>
            </h3>
            {comment.whole_to_thread_id === null ? (
              <Button
                onClick={(e) => {
                  handleCommentWholeInNewThread(comment);
                }}
                className="absolute right-5 top-5 hidden h-6 w-6 rounded-sm p-0 text-neutral-400 transition duration-200 hover:text-neutral-700 group-hover:flex"
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
                  find(postCurrentHighlights, {
                    highlight_id: -1,
                    offset: -1,
                    length: -1,
                    from_thread_id: 0,
                    to_thread_id: comment.whole_to_thread_id,
                  })
                    ? "bg-[#FF5F1F]/10 text-[#FF5F1F] hover:bg-[#FF5F1F]/10 hover:text-[#FF5F1F]"
                    : "bg-[#eeeeee] text-neutral-700 hover:bg-[#e1e1e1] hover:text-neutral-700"
                } absolute right-5 top-5 h-6 w-6 rounded-sm p-0 transition duration-200`}
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
                className="new-thread-popup-btn absolute z-50 rounded-sm border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition duration-200 hover:bg-neutral-100"
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
                Comment in new thread
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainThread;
