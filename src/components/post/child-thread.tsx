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
import {
  usePostStore,
  usePostOpenThreadsStore,
  usePostCurrentHighlightsStore,
} from "@/state";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { satoshi } from "@/app/fonts";
import {
  getNewPostOpenThreads,
  getNewPostCurrentHighlights,
} from "@/lib/utils";
import { find } from "lodash";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChildThread = ({ threadID }) => {
  const { post, setNewPost } = usePostStore();
  const { postOpenThreads, setNewPostOpenThreads } = usePostOpenThreadsStore();
  const { postCurrentHighlights, setNewPostCurrentHighlights } =
    usePostCurrentHighlightsStore();

  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [wasNewCommentAdded, setWasNewCommentAdded] = useState(false);

  const [isNewThreadPopupOpen, setIsNewThreadPopupOpen] = useState(
    Array(post.comments.length).fill(false),
  );

  const [newThreadPopupCoords, setNewThreadPopupCoords] = useState({});

  const newThreadPopupRef = useRef([]);

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("posts-threads-scrollable-container").scrollTo({
        left: 999999,
        behavior: "smooth",
      });
    }, 25);
  }, [postOpenThreads]);

  const thread = post.threads.filter(
    (thread) => thread.thread_id === threadID,
  )[0];

  useEffect(() => {
    if (thread.comments.length === 0) {
      setIsCommentBoxOpen(true);
    }
  }, [thread.comments.length]);

  const handleCommentWholeInNewThread = (comment) => {
    const text = comment.content;

    const newThreadID = post.threads.length + 1;

    let newThreads = [].concat(post.threads, {
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

    setNewPost({
      ...post,
      threads: newThreads,
    });

    let newOpenThreads = postOpenThreads.filter(
      (thread_id) => thread_id <= threadID,
    );
    newOpenThreads.push(newThreadID);
    setNewPostOpenThreads(newOpenThreads);

    const newHighlightToAdd = {
      highlight_id: -1,
      offset: -1,
      length: -1,
      from_thread_id: threadID,
      to_thread_id: newThreadID,
    };
    let newCurrentHighlights = [];
    newCurrentHighlights = postCurrentHighlights.filter(
      (highlight) =>
        highlight.from_thread_id < newHighlightToAdd.from_thread_id,
    );
    newCurrentHighlights.push(newHighlightToAdd);
    setNewPostCurrentHighlights(newCurrentHighlights);

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

    let newThreads = [].concat(post.threads, {
      thread_id: newThreadID,
      parent_thread_id: threadID,
      quote: text,
      quote_by: comment.user_name,
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

    setNewPost({
      ...post,
      threads: newThreads,
    });

    window.getSelection().empty();

    setIsNewThreadPopupOpen(Array(post.comments.length).fill(false));

    let newOpenThreads = postOpenThreads.filter(
      (thread_id) => thread_id <= threadID,
    );
    newOpenThreads.push(newThreadID);
    setNewPostOpenThreads(newOpenThreads);

    let newCurrentHighlights = [];
    newCurrentHighlights = postCurrentHighlights.filter(
      (highlight) =>
        highlight.from_thread_id < newHighlightToAdd.from_thread_id,
    );
    newCurrentHighlights.push(newHighlightToAdd);
    setNewPostCurrentHighlights(newCurrentHighlights);

    setIsCommentBoxOpen(false);
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

    const newThreads = post.threads.filter(
      (thread) => thread.thread_id !== threadID,
    );
    newThreads.push(newThread);

    setNewPost({ ...post, threads: newThreads });

    editor.commands.clearContent();

    setIsCommentBoxOpen(false);

    setWasNewCommentAdded(true);

    setTimeout(() => {
      document.getElementById(`child-thread-${threadID}`).scrollTo({
        top: 999999,
        behavior: "smooth",
      });
    }, 25);
  };

  const editor = useEditor({
    extensions: [StarterKit],
    autofocus: thread.comments.length === 0 ? true : false,
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

      setIsNewThreadPopupOpen(Array(post.comments.length).fill(false));
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
      x: e.clientX - bounds.left + 35,
      y: e.clientY - bounds.top + 65,
    });

    const newIsNewThreadPopupOpen = isNewThreadPopupOpen;
    newIsNewThreadPopupOpen[id] = true;
    setIsNewThreadPopupOpen(newIsNewThreadPopupOpen);
  };

  const handleOpenWholeCommentThread = (comment) => {
    setNewPostOpenThreads(
      getNewPostOpenThreads(comment.whole_to_thread_id, post),
    );
    setNewPostCurrentHighlights(
      getNewPostCurrentHighlights(
        {
          highlight_id: -1,
          offset: -1,
          length: -1,
          from_thread_id: threadID,
          to_thread_id: comment.whole_to_thread_id,
        },
        postCurrentHighlights,
      ),
    );
    setIsCommentBoxOpen(false);
  };

  return (
    <div
      id={`child-thread-${threadID}`}
      className="post-child-thread h-full w-[calc((100vw-14rem)/2)] overflow-y-scroll rounded-none border-0 bg-[#FFFFFF] shadow-none 2xl:w-[48.5rem]"
    >
      <div className="px-5 pb-0 pt-5">
        <span
          className={`${satoshi.className} mb-4 flex items-center text-sm font-semibold text-neutral-700`}
        >
          <Avatar className="mr-2 inline-flex h-6 w-6 text-[0.6rem]">
            <AvatarImage
              src={`/avatars/${thread.quote_by.toLowerCase()}.png`}
            />
            <AvatarFallback>{thread.quote_by[0]}</AvatarFallback>
          </Avatar>
          {thread.quote_by}
        </span>
        <div className="border-l-8 border-[#FF5F1F]/20 pl-3 text-neutral-700">
          {thread.quote}
        </div>
        {!isCommentBoxOpen && (
          <div>
            <Button
              onClick={(e) => {
                setIsCommentBoxOpen(true);
                editor.commands.focus();
              }}
              className="mb-6 mt-5 h-8 w-full cursor-text justify-normal rounded-sm bg-neutral-100 py-2 pl-2 text-sm font-normal text-neutral-400 shadow-none hover:bg-neutral-100"
              variant="secondary"
            >
              <Avatar className="mr-2 inline-flex h-5 w-5 text-[0.6rem]">
                <AvatarImage src={`/avatars/alex.png`} />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              Add a comment...
            </Button>
          </div>
        )}
      </div>
      <div className="p-5">
        {isCommentBoxOpen && (
          <div
            className={
              "relative mb-12 min-h-[8rem] w-full rounded-sm border border-neutral-400 bg-[#FFFFFF] px-5 pt-5"
            }
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
        {thread.comments.map((comment) => (
          <div
            className={`${
              comment.comment_id === thread.comments.length - 1 &&
              wasNewCommentAdded
                ? "new-comment"
                : ""
            } group relative mt-5 w-full rounded-sm border bg-[#FFFFFF] p-5`}
            key={comment.comment_id}
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
                    from_thread_id: threadID,
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
            {isNewThreadPopupOpen[comment.comment_id] && (
              <Button
                onClick={(e) => {
                  handleCommentInNewThread(comment);
                }}
                className="new-thread-popup-btn absolute z-50 rounded-sm border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition transition duration-200 duration-200 hover:bg-neutral-100"
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
    </div>
  );
};

export default ChildThread;
