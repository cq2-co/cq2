"use client";

import CQ2BubbleMenu from "@/components/editor/cq2-bubble-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  cn,
  getNewCQ2DocumentCurrentHighlightsFromCurrentHighlights,
  getNewCQ2DocumentOpenThreads,
} from "@/lib/utils";
import {
  useCQ2DocumentCurrentHighlightsStore,
  useCQ2DocumentOpenThreadsStore,
  useCQ2DocumentStore,
  useCQ2DocumentUnreadCommentsStore,
  useShowThreadInfoBoxStore,
  useThreadInfoBoxCoordsStore,
  useThreadInfoBoxThreadIDStore,
} from "@/state";
import CharacterCount from "@tiptap/extension-character-count";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  EditorContent,
  Extension,
  mergeAttributes,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import dayjs from "dayjs";
import parse from "html-react-parser";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CircleCheckBig,
  Ellipsis,
  MessageSquare,
  MessageSquareQuote,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { fromRange } from "xpath-range";
import ContentWithHighlight from "./content-with-highlight";

const V1ChildThread = ({ threadID }) => {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const { CQ2DocumentOpenThreads, setNewCQ2DocumentOpenThreads } =
    useCQ2DocumentOpenThreadsStore();
  const { CQ2DocumentCurrentHighlights, setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();
  const { CQ2DocumentUnreadComments, setNewCQ2DocumentUnreadComments } =
    useCQ2DocumentUnreadCommentsStore();

  const [showUnreadIndicator, setShowUnreadIndicator] = useState(true);

  const [wasNewCommentAdded, setWasNewCommentAdded] = useState(false);

  const [isNewThreadPopupOpen, setIsNewThreadPopupOpen] = useState(
    Array(CQ2Document.version1.comments.length).fill(false),
  );

  const [newThreadPopupCoords, setNewThreadPopupCoords] = useState({});

  const newThreadPopupRef = useRef([]);

  const pathname = usePathname();

  const [showConcludeThreadCommentBox, setShowConcludeThreadCommentBox] =
    useState(false);

  const { showThreadInfoBox, setShowThreadInfoBox } =
    useShowThreadInfoBoxStore();
  const { threadInfoBoxThreadID, setThreadInfoBoxThreadID } =
    useThreadInfoBoxThreadIDStore();
  const { threadInfoBoxCoords, setThreadInfoBoxCoords } =
    useThreadInfoBoxCoordsStore();

  const [cq2UserName, setCq2UserName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("cq2UserName")) {
      setCq2UserName(localStorage.getItem("cq2UserName"));
    } else if (CQ2Document._id === "demo") {
      setCq2UserName("Ava");
    }
  }, [setCq2UserName, pathname, CQ2Document._id]);

  useEffect(() => {
    setTimeout(() => {
      document
        .getElementById("CQ2Document-threads-scrollable-container")
        .scrollTo({
          left: 999999,
          behavior: "smooth",
        });
    }, 30);
  }, [CQ2DocumentOpenThreads]);

  const thread = CQ2Document.version1.threads.filter(
    (_thread) => _thread.thread_id === threadID,
  )[0];

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

      setIsNewThreadPopupOpen(
        Array(CQ2Document.version1.comments.length).fill(false),
      );

      return;
    }

    if (
      selection?.anchorNode?.parentElement.closest("p") !==
        selection?.focusNode?.parentElement.closest("p") ||
      selection?.anchorNode?.parentElement.closest("h1") !==
        selection?.focusNode?.parentElement.closest("h1") ||
      selection?.anchorNode?.parentElement.closest("h2") !==
        selection?.focusNode?.parentElement.closest("h2") ||
      selection?.anchorNode?.parentElement.closest("h3") !==
        selection?.focusNode?.parentElement.closest("h3")
    ) {
      toast.warning("Quoting different paragraphs isn't allowed, yet");

      window.getSelection().empty();

      setIsNewThreadPopupOpen(
        Array(CQ2Document.version1.comments.length).fill(false),
      );

      return;
    }

    const commentTextContainer = document.getElementById(
      `${threadID}-${comment.comment_id}-text-container`,
    );

    const xPathRange = fromRange(range, commentTextContainer);

    const newThreadID = CQ2Document.version1.threads.length + 1;

    const newHighlightToAdd = {
      highlight_id: comment.highlights.length,
      start: xPathRange.start,
      startOffset:
        text[0] === "‎" && xPathRange.startOffset === 0
          ? 1
          : xPathRange.startOffset,
      end: xPathRange.end,
      endOffset: xPathRange.endOffset,
      thread_id: threadID,
      comment_id: comment.comment_id,
      to_thread_id: newThreadID,
    };

    const newHighlights = [].concat(comment.highlights, newHighlightToAdd);

    let newThreads = [].concat(CQ2Document.version1.threads, {
      thread_id: newThreadID,
      from_thread_id: threadID,
      from_comment_id: comment.comment_id,
      from_highlight_id: comment.highlights.length,
      quote: text,
      quote_by: comment.user_name,
      comments: [],
    });

    const newComment = { ...comment, highlights: newHighlights };

    const newThreadComments = thread.comments.filter(
      (_comment) => _comment.comment_id !== comment.comment_id,
    );

    newThreadComments.push(newComment);

    newThreadComments.push({
      comment_id: thread.comments.length,
      thread_id: threadID,
      user_name: cq2UserName,
      content: "",
      created_on: Date.now(),
      highlights: [],
      is_conclusion: false,
      for_child_thread_created: true,
      for_child_thread_created_parent_comment_id: comment.comment_id,
      for_child_thread_created_quote: text.substring(0, 52) + "...",
    });
    newThreadComments.sort((a, b) => a.comment_id - b.comment_id);

    const newThread = { ...thread, comments: newThreadComments };

    newThreads = newThreads.filter((_thread) => _thread.thread_id !== threadID);
    newThreads.push(newThread);

    const newCQ2Document = {
      ...CQ2Document,
      version1: {
        ...CQ2Document.version1,
        threads: newThreads,
      },
    };

    setShowUnreadIndicator(false);

    updateCQ2Document(newCQ2Document);
    setNewCQ2Document(newCQ2Document);

    setWasNewCommentAdded(true);

    window.getSelection().empty();

    setIsNewThreadPopupOpen(
      Array(CQ2Document.version1.comments.length).fill(false),
    );

    let newOpenThreads = CQ2DocumentOpenThreads.filter(
      (thread_id) => thread_id <= threadID,
    );
    newOpenThreads.push(newThreadID);
    setNewCQ2DocumentOpenThreads(newOpenThreads);

    let newCurrentHighlights = [];
    newCurrentHighlights = CQ2DocumentCurrentHighlights.filter(
      (highlight) => highlight.thread_id < newHighlightToAdd.thread_id,
    );
    newCurrentHighlights.push(newHighlightToAdd);
    setNewCQ2DocumentCurrentHighlights(newCurrentHighlights);

    if (CQ2Document._id !== "demo" && typeof window !== "undefined") {
      const CQ2DocumentsReadFromLS = JSON.parse(
        localStorage.getItem("CQ2DocumentsRead"),
      );

      const CQ2DocumentFromLS = CQ2DocumentsReadFromLS.CQ2Documents.filter(
        (CQ2DocumentReadFromLS) =>
          CQ2DocumentReadFromLS._id === CQ2Document._id,
      )[0].threads;

      CQ2DocumentFromLS[threadID] = thread.comments.length;

      const newCQ2DocumentsReadFromLS =
        CQ2DocumentsReadFromLS.CQ2Documents.filter(
          (CQ2DocumentReadFromLS) =>
            CQ2DocumentReadFromLS._id !== CQ2Document._id,
        );

      const newCQ2DocumentsRead = {
        CQ2Documents: newCQ2DocumentsReadFromLS,
      };

      newCQ2DocumentsRead.CQ2Documents.push({
        _id: CQ2Document._id,
        threads: CQ2DocumentFromLS,
      });

      localStorage.setItem(
        "CQ2DocumentsRead",
        JSON.stringify(newCQ2DocumentsRead),
      );

      const unreadComments = {
        0: CQ2Document.version1.comments.length - CQ2DocumentFromLS[0],
      };

      for (let i = 1; i <= CQ2Document.version1.threads.length; i++) {
        unreadComments[i] =
          CQ2Document.version1.threads.filter(
            (_thread) => _thread.thread_id === i,
          )[0].comments.length - CQ2DocumentFromLS[i];
      }

      setNewCQ2DocumentUnreadComments(unreadComments);

      const cq2CommentedCQ2Documents = localStorage.getItem(
        "cq2CommentedCQ2Documents",
      );

      if (!cq2CommentedCQ2Documents) {
        const initCq2CommentedCQ2Documents = {
          CQ2Documents: [
            {
              _id: CQ2Document._id,
              title: CQ2Document.version1.title,
              user_name: CQ2Document.user_name,
              created_on: CQ2Document.version1.created_on,
            },
          ],
        };

        localStorage.setItem(
          "cq2CommentedCQ2Documents",
          JSON.stringify(initCq2CommentedCQ2Documents),
        );
      } else {
        let cq2CommentedCQ2DocumentsJSON = JSON.parse(cq2CommentedCQ2Documents);

        if (
          !cq2CommentedCQ2DocumentsJSON.CQ2Documents.some(
            (cq2CommentedCQ2DocumentJSON) =>
              cq2CommentedCQ2DocumentJSON["_id"] === CQ2Document._id,
          )
        ) {
          cq2CommentedCQ2DocumentsJSON.CQ2Documents.push({
            _id: CQ2Document._id,
            title: CQ2Document.version1.title,
            user_name: CQ2Document.user_name,
            created_on: CQ2Document.version1.created_on,
          });

          localStorage.setItem(
            "cq2CommentedCQ2Documents",
            JSON.stringify(cq2CommentedCQ2DocumentsJSON),
          );
        }
      }
    }
  };

  const concludeThreadWithoutComment = () => {
    let lastComment = thread.comments.pop();

    lastComment.is_conclusion = true;

    const newThreadComments = [].concat(thread.comments, lastComment);
    const newThread = { ...thread, comments: newThreadComments };

    if (thread.from_thread_id !== 0) {
      let newParentThread = CQ2Document.version1.threads.filter(
        (_thread) => _thread.thread_id === thread.from_thread_id,
      )[0];

      newParentThread.comments.push({
        comment_id: newParentThread.comments.length,
        thread_id: newParentThread.thread_id,
        user_name: cq2UserName,
        content: "",
        created_on: Date.now(),
        highlights: [],
        is_conclusion: false,
        for_child_thread_concluded: true,
        for_child_thread_concluded_parent_comment_id: thread.from_comment_id,
        for_child_thread_concluded_quote: thread.quote.substring(0, 52) + "...",
      });

      const newThreads = CQ2Document.version1.threads.filter(
        (_thread) =>
          _thread.thread_id !== threadID &&
          _thread.thread_id !== newParentThread.thread_id,
      );
      newThreads.push(newParentThread);
      newThreads.push(newThread);

      const newCQ2Document = {
        ...CQ2Document,
        version1: {
          ...CQ2Document.version1,
          threads: newThreads,
        },
      };

      updateCQ2Document(newCQ2Document);
      setNewCQ2Document(newCQ2Document);

      if (CQ2Document._id !== "demo" && typeof window !== "undefined") {
        const CQ2DocumentsReadFromLS = JSON.parse(
          localStorage.getItem("CQ2DocumentsRead"),
        );

        const CQ2DocumentFromLS = CQ2DocumentsReadFromLS.CQ2Documents.filter(
          (CQ2DocumentReadFromLS) =>
            CQ2DocumentReadFromLS._id === CQ2Document._id,
        )[0].threads;

        CQ2DocumentFromLS[newParentThread.thread_id] =
          newParentThread.comments.length;

        const newCQ2DocumentsReadFromLS =
          CQ2DocumentsReadFromLS.CQ2Documents.filter(
            (CQ2DocumentReadFromLS) =>
              CQ2DocumentReadFromLS._id !== CQ2Document._id,
          );

        const newCQ2DocumentsRead = {
          CQ2Documents: newCQ2DocumentsReadFromLS,
        };

        newCQ2DocumentsRead.CQ2Documents.push({
          _id: CQ2Document._id,
          threads: CQ2DocumentFromLS,
        });

        localStorage.setItem(
          "CQ2DocumentsRead",
          JSON.stringify(newCQ2DocumentsRead),
        );

        const unreadComments = {
          0: CQ2Document.version1.comments.length - CQ2DocumentFromLS[0],
        };

        for (let i = 1; i <= CQ2Document.version1.threads.length; i++) {
          unreadComments[i] =
            CQ2Document.version1.threads.filter(
              (_thread) => _thread.thread_id === i,
            )[0].comments.length - CQ2DocumentFromLS[i];
        }

        setNewCQ2DocumentUnreadComments(unreadComments);
      }
    } else if (thread.from_comment_id !== -1) {
      let docThread = CQ2Document.version1;

      docThread.comments.push({
        comment_id: docThread.comments.length,
        thread_id: 0,
        user_name: cq2UserName,
        content: "",
        created_on: Date.now(),
        highlights: [],
        is_conclusion: false,
        for_child_thread_concluded: true,
        for_child_thread_concluded_parent_comment_id: thread.from_comment_id,
        for_child_thread_concluded_quote: thread.quote.substring(0, 52) + "...",
      });

      const newThreads = CQ2Document.version1.threads.filter(
        (_thread) => _thread.thread_id !== threadID,
      );
      newThreads.push(newThread);

      const newCQ2Document = {
        ...CQ2Document,
        version1: {
          ...docThread,
          threads: newThreads,
        },
      };

      updateCQ2Document(newCQ2Document);
      setNewCQ2Document(newCQ2Document);

      if (CQ2Document._id !== "demo" && typeof window !== "undefined") {
        const CQ2DocumentsReadFromLS = JSON.parse(
          localStorage.getItem("CQ2DocumentsRead"),
        );

        const CQ2DocumentFromLS = CQ2DocumentsReadFromLS.CQ2Documents.filter(
          (CQ2DocumentReadFromLS) =>
            CQ2DocumentReadFromLS._id === CQ2Document._id,
        )[0].threads;

        CQ2DocumentFromLS[0] = docThread.comments.length;

        const newCQ2DocumentsReadFromLS =
          CQ2DocumentsReadFromLS.CQ2Documents.filter(
            (CQ2DocumentReadFromLS) =>
              CQ2DocumentReadFromLS._id !== CQ2Document._id,
          );

        const newCQ2DocumentsRead = {
          CQ2Documents: newCQ2DocumentsReadFromLS,
        };

        newCQ2DocumentsRead.CQ2Documents.push({
          _id: CQ2Document._id,
          threads: CQ2DocumentFromLS,
        });

        localStorage.setItem(
          "CQ2DocumentsRead",
          JSON.stringify(newCQ2DocumentsRead),
        );

        const unreadComments = {
          0: CQ2Document.version1.comments.length - CQ2DocumentFromLS[0],
        };

        for (let i = 1; i <= CQ2Document.version1.threads.length; i++) {
          unreadComments[i] =
            CQ2Document.version1.threads.filter(
              (_thread) => _thread.thread_id === i,
            )[0].comments.length - CQ2DocumentFromLS[i];
        }

        setNewCQ2DocumentUnreadComments(unreadComments);
      }
    } else {
      const newThreads = CQ2Document.version1.threads.filter(
        (_thread) => _thread.thread_id !== threadID,
      );
      newThreads.push(newThread);

      const newCQ2Document = {
        ...CQ2Document,
        version1: {
          ...CQ2Document.version1,
          threads: newThreads,
        },
      };

      updateCQ2Document(newCQ2Document);
      setNewCQ2Document(newCQ2Document);
    }
  };

  const handleCommentInThread = (isConclusion = false) => {
    let commentHTML;

    if (isConclusion) {
      commentHTML = conclusionEditor.getHTML();
    } else {
      commentHTML = editor.getHTML();
    }

    if (!commentHTML || commentHTML === '<p class="mt-[1em] first:mt-0"></p>') {
      return;
    }

    let processedComment = document.createElement("div");
    processedComment.innerHTML = commentHTML;
    processedComment
      .querySelectorAll("p, h1, h2, h3, code")
      .forEach((_element) => {
        _element.prepend("‎");
      });

    const newThreadComments = [].concat(thread.comments, {
      comment_id: thread.comments.length,
      thread_id: threadID,
      user_name: cq2UserName,
      content: processedComment.innerHTML,
      created_on: Date.now(),
      highlights: [],
      is_conclusion: isConclusion,
    });
    const newThread = { ...thread, comments: newThreadComments };

    if (isConclusion) {
      if (thread.from_thread_id !== 0) {
        let newParentThread = CQ2Document.version1.threads.filter(
          (_thread) => _thread.thread_id === thread.from_thread_id,
        )[0];

        newParentThread.comments.push({
          comment_id: newParentThread.comments.length,
          thread_id: newParentThread.thread_id,
          user_name: cq2UserName,
          content: "",
          created_on: Date.now(),
          highlights: [],
          is_conclusion: false,
          for_child_thread_concluded: true,
          for_child_thread_concluded_parent_comment_id: thread.from_comment_id,
          for_child_thread_concluded_quote:
            thread.quote.substring(0, 52) + "...",
        });

        const newThreads = CQ2Document.version1.threads.filter(
          (_thread) =>
            _thread.thread_id !== threadID &&
            _thread.thread_id !== newParentThread.thread_id,
        );
        newThreads.push(newParentThread);
        newThreads.push(newThread);

        const newCQ2Document = {
          ...CQ2Document,
          version1: {
            ...CQ2Document.version1,
            threads: newThreads,
          },
        };

        updateCQ2Document(newCQ2Document);
        setNewCQ2Document(newCQ2Document);

        conclusionEditor.commands.clearContent();

        if (CQ2Document._id !== "demo" && typeof window !== "undefined") {
          const CQ2DocumentsReadFromLS = JSON.parse(
            localStorage.getItem("CQ2DocumentsRead"),
          );

          const CQ2DocumentFromLS = CQ2DocumentsReadFromLS.CQ2Documents.filter(
            (CQ2DocumentReadFromLS) =>
              CQ2DocumentReadFromLS._id === CQ2Document._id,
          )[0].threads;

          CQ2DocumentFromLS[newParentThread.thread_id] =
            newParentThread.comments.length;

          const newCQ2DocumentsReadFromLS =
            CQ2DocumentsReadFromLS.CQ2Documents.filter(
              (CQ2DocumentReadFromLS) =>
                CQ2DocumentReadFromLS._id !== CQ2Document._id,
            );

          const newCQ2DocumentsRead = {
            CQ2Documents: newCQ2DocumentsReadFromLS,
          };

          newCQ2DocumentsRead.CQ2Documents.push({
            _id: CQ2Document._id,
            threads: CQ2DocumentFromLS,
          });

          localStorage.setItem(
            "CQ2DocumentsRead",
            JSON.stringify(newCQ2DocumentsRead),
          );

          const unreadComments = {
            0: CQ2Document.version1.comments.length - CQ2DocumentFromLS[0],
          };

          for (let i = 1; i <= CQ2Document.version1.threads.length; i++) {
            unreadComments[i] =
              CQ2Document.version1.threads.filter(
                (_thread) => _thread.thread_id === i,
              )[0].comments.length - CQ2DocumentFromLS[i];
          }

          setNewCQ2DocumentUnreadComments(unreadComments);
        }
      } else if (thread.from_comment_id !== -1) {
        let docThread = CQ2Document.version1;

        docThread.comments.push({
          comment_id: docThread.comments.length,
          thread_id: 0,
          user_name: cq2UserName,
          content: "",
          created_on: Date.now(),
          highlights: [],
          is_conclusion: false,
          for_child_thread_concluded: true,
          for_child_thread_concluded_parent_comment_id: thread.from_comment_id,
          for_child_thread_concluded_quote:
            thread.quote.substring(0, 52) + "...",
        });

        const newThreads = CQ2Document.version1.threads.filter(
          (_thread) => _thread.thread_id !== threadID,
        );
        newThreads.push(newThread);

        const newCQ2Document = {
          ...CQ2Document,
          version1: {
            ...docThread,
            threads: newThreads,
          },
        };

        updateCQ2Document(newCQ2Document);
        setNewCQ2Document(newCQ2Document);

        conclusionEditor.commands.clearContent();

        if (CQ2Document._id !== "demo" && typeof window !== "undefined") {
          const CQ2DocumentsReadFromLS = JSON.parse(
            localStorage.getItem("CQ2DocumentsRead"),
          );

          const CQ2DocumentFromLS = CQ2DocumentsReadFromLS.CQ2Documents.filter(
            (CQ2DocumentReadFromLS) =>
              CQ2DocumentReadFromLS._id === CQ2Document._id,
          )[0].threads;

          CQ2DocumentFromLS[0] = docThread.comments.length;

          const newCQ2DocumentsReadFromLS =
            CQ2DocumentsReadFromLS.CQ2Documents.filter(
              (CQ2DocumentReadFromLS) =>
                CQ2DocumentReadFromLS._id !== CQ2Document._id,
            );

          const newCQ2DocumentsRead = {
            CQ2Documents: newCQ2DocumentsReadFromLS,
          };

          newCQ2DocumentsRead.CQ2Documents.push({
            _id: CQ2Document._id,
            threads: CQ2DocumentFromLS,
          });

          localStorage.setItem(
            "CQ2DocumentsRead",
            JSON.stringify(newCQ2DocumentsRead),
          );

          const unreadComments = {
            0: CQ2Document.version1.comments.length - CQ2DocumentFromLS[0],
          };

          for (let i = 1; i <= CQ2Document.version1.threads.length; i++) {
            unreadComments[i] =
              CQ2Document.version1.threads.filter(
                (_thread) => _thread.thread_id === i,
              )[0].comments.length - CQ2DocumentFromLS[i];
          }

          setNewCQ2DocumentUnreadComments(unreadComments);
        }
      } else {
        const newThreads = CQ2Document.version1.threads.filter(
          (_thread) => _thread.thread_id !== threadID,
        );
        newThreads.push(newThread);

        const newCQ2Document = {
          ...CQ2Document,
          version1: {
            ...CQ2Document.version1,
            threads: newThreads,
          },
        };

        updateCQ2Document(newCQ2Document);
        setNewCQ2Document(newCQ2Document);

        conclusionEditor.commands.clearContent();
      }
    } else {
      const newThreads = CQ2Document.version1.threads.filter(
        (_thread) => _thread.thread_id !== threadID,
      );
      newThreads.push(newThread);

      const newCQ2Document = {
        ...CQ2Document,
        version1: {
          ...CQ2Document.version1,
          threads: newThreads,
        },
      };

      updateCQ2Document(newCQ2Document);
      setNewCQ2Document(newCQ2Document);

      editor.commands.clearContent();
    }

    setShowUnreadIndicator(false);
    setWasNewCommentAdded(true);

    if (CQ2Document._id !== "demo" && typeof window !== "undefined") {
      const CQ2DocumentsReadFromLS = JSON.parse(
        localStorage.getItem("CQ2DocumentsRead"),
      );

      const CQ2DocumentFromLS = CQ2DocumentsReadFromLS.CQ2Documents.filter(
        (CQ2DocumentReadFromLS) =>
          CQ2DocumentReadFromLS._id === CQ2Document._id,
      )[0].threads;

      CQ2DocumentFromLS[threadID] = thread.comments.length;

      const newCQ2DocumentsReadFromLS =
        CQ2DocumentsReadFromLS.CQ2Documents.filter(
          (CQ2DocumentReadFromLS) =>
            CQ2DocumentReadFromLS._id !== CQ2Document._id,
        );

      const newCQ2DocumentsRead = {
        CQ2Documents: newCQ2DocumentsReadFromLS,
      };

      newCQ2DocumentsRead.CQ2Documents.push({
        _id: CQ2Document._id,
        threads: CQ2DocumentFromLS,
      });

      localStorage.setItem(
        "CQ2DocumentsRead",
        JSON.stringify(newCQ2DocumentsRead),
      );

      const unreadComments = {
        0: CQ2Document.version1.comments.length - CQ2DocumentFromLS[0],
      };

      for (let i = 1; i <= CQ2Document.version1.threads.length; i++) {
        unreadComments[i] =
          CQ2Document.version1.threads.filter(
            (_thread) => _thread.thread_id === i,
          )[0].comments.length - CQ2DocumentFromLS[i];
      }

      setNewCQ2DocumentUnreadComments(unreadComments);

      const cq2CommentedCQ2Documents = localStorage.getItem(
        "cq2CommentedCQ2Documents",
      );

      if (!cq2CommentedCQ2Documents) {
        const initCq2CommentedCQ2Documents = {
          CQ2Documents: [
            {
              _id: CQ2Document._id,
              title: CQ2Document.version1.title,
              user_name: CQ2Document.user_name,
              created_on: CQ2Document.version1.created_on,
            },
          ],
        };

        localStorage.setItem(
          "cq2CommentedCQ2Documents",
          JSON.stringify(initCq2CommentedCQ2Documents),
        );
      } else {
        let cq2CommentedCQ2DocumentsJSON = JSON.parse(cq2CommentedCQ2Documents);

        if (
          !cq2CommentedCQ2DocumentsJSON.CQ2Documents.some(
            (cq2CommentedCQ2DocumentJSON) =>
              cq2CommentedCQ2DocumentJSON["_id"] === CQ2Document._id,
          )
        ) {
          cq2CommentedCQ2DocumentsJSON.CQ2Documents.push({
            _id: CQ2Document._id,
            title: CQ2Document.version1.title,
            user_name: CQ2Document.user_name,
            created_on: CQ2Document.version1.created_on,
          });

          localStorage.setItem(
            "cq2CommentedCQ2Documents",
            JSON.stringify(cq2CommentedCQ2DocumentsJSON),
          );
        }
      }
    }

    setTimeout(() => {
      document.getElementById(`child-thread-${threadID}`).scrollTo({
        top: 999999,
        behavior: "smooth",
      });
    }, 25);
  };

  const updateCQ2Document = async (_CQ2Document) => {
    if (_CQ2Document._id === "demo") {
      return;
    }

    try {
      const res = await fetch("/api/document", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_CQ2Document),
      });

      if (!res.ok) {
        toast.error("Please try again later.");
        return;
      }
    } catch (error) {
      toast.error("Please try again later.");
    }
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
            class: cn("list-decimal ml-8 mt-[1em] first:mt-0"),
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: cn("list-disc ml-8 mt-[1em] first:mt-0"),
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: cn(
              "border-l-[6px] border-[#b6b6b6] pl-[0.75rem] mt-[1em] first:mt-0",
            ),
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: cn(
              "bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0",
            ),
          },
        },
        code: {
          HTMLAttributes: {
            class: cn("bg-[#F9F9F9] text-neutral-700 p-0.5"),
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: cn("mt-[1.5em] first:mt-0"),
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: cn("mt-[1em] first:mt-0"),
          },
        },
      }),
      Heading.extend({
        levels: [1, 2, 3],
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];
          const classes: { [index: number]: string } = {
            1: "text-2xl font-semibold mt-[1.5em] first:mt-0",
            2: "text-xl font-semibold mt-[1.5em] first:mt-0",
            3: "text-lg font-semibold mt-[1.5em] first:mt-0",
          };
          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]}`,
            }),
            0,
          ];
        },
      }).configure({ levels: [1, 2, 3] }),
      Link.configure({
        HTMLAttributes: {
          class: cn("text-[#797874] underline"),
        },
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: "Write a comment...",
      }),
      Underline,
      ShiftEnterCreateExtension,
      CharacterCount.configure({
        limit: 6000,
      }),
    ],
    autofocus: true,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  const conclusionEditor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: cn("list-decimal ml-8 mt-[1em] first:mt-0"),
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: cn("list-disc ml-8 mt-[1em] first:mt-0"),
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: cn(
              "border-l-[6px] border-[#b6b6b6] pl-[0.75rem] mt-[1em] first:mt-0",
            ),
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: cn(
              "bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm mt-[1em] first:mt-0",
            ),
          },
        },
        code: {
          HTMLAttributes: {
            class: cn("bg-[#F9F9F9] text-neutral-700 p-0.5"),
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: cn("mt-[1.5em] first:mt-0"),
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: cn("mt-[1em] first:mt-0"),
          },
        },
      }),
      Heading.extend({
        levels: [1, 2, 3],
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];
          const classes: { [index: number]: string } = {
            1: "text-2xl font-semibold mt-[1.5em] first:mt-0",
            2: "text-xl font-semibold mt-[1.5em] first:mt-0",
            3: "text-lg font-semibold mt-[1.5em] first:mt-0",
          };
          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]}`,
            }),
            0,
          ];
        },
      }).configure({ levels: [1, 2, 3] }),
      Link.configure({
        HTMLAttributes: {
          class: cn("text-[#797874] underline"),
        },
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: "Write the conclusion...",
      }),
      Underline,
      ShiftEnterCreateExtension,
      CharacterCount.configure({
        limit: 6000,
      }),
    ],
    autofocus: true,
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

      setIsNewThreadPopupOpen(
        Array(CQ2Document.version1.comments.length).fill(false),
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

  const showNewThreadPopup = (e, comment_id, idx) => {
    const selection = window.getSelection();
    const text = selection.toString();

    if (!text) {
      return;
    }

    const commentTextContainerBounds = document
      .getElementById(`${threadID}-${comment_id}-text-container`)
      .getBoundingClientRect();

    let xCoord = e.clientX - commentTextContainerBounds.left + 70;
    let yCoord = e.clientY - commentTextContainerBounds.top + 80;

    if (
      xCoord + 170 > commentTextContainerBounds.width &&
      idx === thread.comments.length - 1 &&
      yCoord + 40 > commentTextContainerBounds.height
    ) {
      xCoord = e.clientX - commentTextContainerBounds.left - 175;
      yCoord = e.clientY - commentTextContainerBounds.top + 37;
    } else if (xCoord + 170 > commentTextContainerBounds.width) {
      xCoord = commentTextContainerBounds.width - 180;
      yCoord = yCoord + 10;
    } else if (
      idx === thread.comments.length - 1 &&
      idx !== 0 &&
      yCoord - 40 > commentTextContainerBounds.height
    ) {
      const childThreadContainer = document.getElementById(
        `child-thread-${threadID}`,
      );
      const hasScrollableContent =
        childThreadContainer.scrollHeight > childThreadContainer.clientHeight;
      const overflowYStyle =
        window.getComputedStyle(childThreadContainer).overflowY;
      const isOverflowHidden = overflowYStyle.indexOf("hidden") !== -1;

      if (hasScrollableContent && !isOverflowHidden) {
        yCoord = e.clientY - commentTextContainerBounds.top + 37;
      }
    }

    setNewThreadPopupCoords({
      x: xCoord,
      y: yCoord,
    });

    const newIsNewThreadPopupOpen = isNewThreadPopupOpen;
    newIsNewThreadPopupOpen[comment_id] = true;
    setIsNewThreadPopupOpen(newIsNewThreadPopupOpen);
  };

  const concludedComment = thread.comments.filter(
    (comment) => comment.is_conclusion === true,
  )[0];

  useEffect(() => {
    if (!CQ2Document._id) {
      return;
    }

    const childThread = document.getElementById(`child-thread-${threadID}`);

    const setCQ2DocumentReadUnreadComments = () => {
      const CQ2DocumentsReadFromLS = JSON.parse(
        localStorage.getItem("CQ2DocumentsRead"),
      );

      const CQ2DocumentFromLS = CQ2DocumentsReadFromLS.CQ2Documents.filter(
        (CQ2DocumentReadFromLS) =>
          CQ2DocumentReadFromLS._id === CQ2Document._id,
      )[0].threads;

      CQ2DocumentFromLS[threadID] = thread.comments.length;

      const newCQ2DocumentsReadFromLS =
        CQ2DocumentsReadFromLS.CQ2Documents.filter(
          (CQ2DocumentReadFromLS) =>
            CQ2DocumentReadFromLS._id !== CQ2Document._id,
        );

      const newCQ2DocumentsRead = {
        CQ2Documents: newCQ2DocumentsReadFromLS,
      };

      newCQ2DocumentsRead.CQ2Documents.push({
        _id: CQ2Document._id,
        threads: CQ2DocumentFromLS,
      });

      localStorage.setItem(
        "CQ2DocumentsRead",
        JSON.stringify(newCQ2DocumentsRead),
      );

      const unreadComments = {
        0: CQ2Document.version1.comments.length - CQ2DocumentFromLS[0],
      };

      for (let i = 1; i <= CQ2Document.version1.threads.length; i++) {
        unreadComments[i] =
          CQ2Document.version1.threads.filter(
            (_thread) => _thread.thread_id === i,
          )[0].comments.length - CQ2DocumentFromLS[i];
      }

      setNewCQ2DocumentUnreadComments(unreadComments);
    };

    if (
      !!!(
        childThread.scrollTop ||
        (++childThread.scrollTop && childThread.scrollTop--)
      )
    ) {
      if (typeof window !== "undefined") {
        setCQ2DocumentReadUnreadComments();
      }
    } else {
      let lastScrollTop = 0;

      childThread.onscroll = (e) => {
        if (childThread.scrollTop < lastScrollTop) {
          return;
        }

        lastScrollTop = childThread.scrollTop <= 0 ? 0 : childThread.scrollTop;
        if (
          childThread.scrollTop + childThread.offsetHeight >=
          childThread.scrollHeight
        ) {
          if (typeof window !== "undefined") {
            setCQ2DocumentReadUnreadComments();
          }
        }
      };
    }
  }, [
    pathname,
    threadID,
    CQ2Document,
    setNewCQ2DocumentUnreadComments,
    thread.comments.length,
  ]);

  useEffect(() => {
    let hidePopupTimeout;

    for (let c = 0; c < thread.comments.length; c++) {
      const hightlightsInComments = thread.comments[c].highlights;

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

              setNewCQ2DocumentOpenThreads(
                getNewCQ2DocumentOpenThreads(
                  highlight.to_thread_id,
                  CQ2Document,
                ),
              );
              setNewCQ2DocumentCurrentHighlights(
                getNewCQ2DocumentCurrentHighlightsFromCurrentHighlights(
                  highlight,
                  CQ2DocumentCurrentHighlights,
                ),
              );

              setShowThreadInfoBox(false);
            });

            highlightSpan.addEventListener("mouseover", function (e) {
              e.preventDefault();
              e.stopPropagation();

              clearTimeout(hidePopupTimeout);

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

                    [
                      ...highlightSpanElement.getElementsByTagName("code"),
                    ].forEach((codeElement) => {
                      codeElement.className =
                        "cq2-highlight-span-inactive-hover";
                    });

                    lastHighlightSpan = highlightSpanElement;
                  });

                const highlightSpanBounds =
                  lastHighlightSpan.getBoundingClientRect();

                const CQ2DocumentsThreadsScrollableContainer =
                  document.getElementById(
                    "CQ2Document-threads-scrollable-container",
                  );

                let xCoord =
                  highlightSpanBounds.right +
                  CQ2DocumentsThreadsScrollableContainer?.scrollLeft +
                  10;

                let yCoord = highlightSpanBounds.top - 513;

                if (
                  xCoord + 512 >=
                  document.documentElement.clientWidth +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft
                ) {
                  xCoord =
                    highlightSpanBounds.left +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                    532;
                }

                const CQ2DocumentsThreadsScrollableContainerHeightMid =
                  CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                    .height /
                    2 -
                  606;

                if (yCoord > CQ2DocumentsThreadsScrollableContainerHeightMid) {
                  yCoord = CQ2DocumentsThreadsScrollableContainerHeightMid;
                }

                setThreadInfoBoxCoords({
                  x: xCoord,
                  y: yCoord,
                });
                setThreadInfoBoxThreadID(highlight.to_thread_id);
                setShowThreadInfoBox(true);
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

                    [
                      ...highlightSpanElement.getElementsByTagName("code"),
                    ].forEach((codeElement) => {
                      codeElement.className = "cq2-highlight-span-inactive";
                    });
                  });
              }

              let isMouseInsideThreadInfoPopup = false;

              const threadInfoBox = document.getElementById("thread-info-box");

              document.body.addEventListener("mousemove", function (e) {
                if (threadInfoBox && threadInfoBox.contains(e.target)) {
                  isMouseInsideThreadInfoPopup = true;
                }
              });

              if (threadInfoBox) {
                threadInfoBox.addEventListener("mouseleave", function () {
                  setShowThreadInfoBox(false);
                });
              }

              hidePopupTimeout = setTimeout(function () {
                if (!isMouseInsideThreadInfoPopup) {
                  setShowThreadInfoBox(false);
                }
              }, 500);
            });
          });
      }
    }

    return () => {
      for (let c = 0; c < thread.comments.length; c++) {
        const hightlightsInComments = thread.comments[c].highlights;

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

                setNewCQ2DocumentOpenThreads(
                  getNewCQ2DocumentOpenThreads(
                    highlight.to_thread_id,
                    CQ2Document,
                  ),
                );
                setNewCQ2DocumentCurrentHighlights(
                  getNewCQ2DocumentCurrentHighlightsFromCurrentHighlights(
                    highlight,
                    CQ2DocumentCurrentHighlights,
                  ),
                );

                setShowThreadInfoBox(false);
              });

              highlightSpan.removeEventListener("mouseover", function (e) {
                e.preventDefault();
                e.stopPropagation();

                clearTimeout(hidePopupTimeout);

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

                      [
                        ...highlightSpanElement.getElementsByTagName("code"),
                      ].forEach((codeElement) => {
                        codeElement.className =
                          "cq2-highlight-span-inactive-hover";
                      });

                      lastHighlightSpan = highlightSpanElement;
                    });

                  const highlightSpanBounds =
                    lastHighlightSpan.getBoundingClientRect();

                  const childThreadContainer = document.getElementById(
                    `child-thread-${threadID}`,
                  );

                  const CQ2DocumentsThreadsScrollableContainer =
                    document.getElementById(
                      "CQ2Document-threads-scrollable-container",
                    );

                  let xCoord =
                    highlightSpanBounds.right +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft +
                    10;

                  let yCoord = highlightSpanBounds.top - 513;

                  if (
                    xCoord + 512 >=
                    document.documentElement.clientWidth +
                      CQ2DocumentsThreadsScrollableContainer?.scrollLeft
                  ) {
                    xCoord =
                      highlightSpanBounds.left +
                      CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                      532;
                  }

                  const CQ2DocumentsThreadsScrollableContainerHeightMid =
                    CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                      .height /
                      2 -
                    606;

                  if (
                    yCoord > CQ2DocumentsThreadsScrollableContainerHeightMid
                  ) {
                    yCoord = CQ2DocumentsThreadsScrollableContainerHeightMid;
                  }

                  setThreadInfoBoxCoords({
                    x: xCoord,
                    y: yCoord,
                  });
                  setThreadInfoBoxThreadID(highlight.to_thread_id);
                  setShowThreadInfoBox(true);
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

                      [
                        ...highlightSpanElement.getElementsByTagName("code"),
                      ].forEach((codeElement) => {
                        codeElement.className = "cq2-highlight-span-inactive";
                      });
                    });
                }

                let isMouseInsideThreadInfoPopup = false;

                const threadInfoBox =
                  document.getElementById("thread-info-box");

                document.body.removeEventListener("mousemove", function (e) {
                  if (threadInfoBox && threadInfoBox.contains(e.target)) {
                    isMouseInsideThreadInfoPopup = true;
                  }
                });

                if (threadInfoBox) {
                  threadInfoBox.removeEventListener("mouseleave", function () {
                    setShowThreadInfoBox(false);
                  });
                }

                hidePopupTimeout = setTimeout(function () {
                  if (!isMouseInsideThreadInfoPopup) {
                    setShowThreadInfoBox(false);
                  }
                }, 500);
              });
            });
        }
      }
    };
  }, [CQ2Document, threadID, thread.comments]);

  const threadHighlightsCount = thread.comments.reduce(
    (acc, comment) => acc + comment.highlights.length,
    0,
  );

  return (
    <div
      className={`CQ2Document-child-thread relative flex h-full w-[calc((100vw)/2)] flex-col rounded-none border-r border-[#EDEDED] bg-[#FFFFFF] shadow-none 2xl:w-[48.5rem]`}
    >
      <div
        className={`sticky top-0 z-40 flex flex-row justify-between border-b border-[#EDEDED] bg-[#FFFFFF] px-5 py-2 text-sm font-normal text-neutral-400`}
      >
        <div className={`flex items-center`}>
          <span className="mr-1 text-neutral-600">
            {thread.comments.length}
          </span>
          {thread.comments.length === 1 ? "comment" : "comments"}
          <span className="mx-2">·</span>
          <span className="mr-1 text-neutral-600">{threadHighlightsCount}</span>
          {" child "}
          {threadHighlightsCount === 1 ? "thread" : "threads"}
        </div>
        {!concludedComment && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-5 w-5 rounded-sm p-0.5">
                <Ellipsis
                  strokeWidth={2}
                  className="h-8 w-8 text-neutral-800"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="cq2-hover-card"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer py-1"
                  onClick={() => concludeThreadWithoutComment()}
                >
                  <CircleCheckBig
                    strokeWidth={3}
                    className="mr-2 h-3.5 w-3.5 text-neutral-400"
                  />
                  <span className=" text-neutral-700">
                    Conclude without new comment
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer py-1"
                  onClick={() => {
                    setShowConcludeThreadCommentBox(true);
                    conclusionEditor.commands.focus();
                  }}
                >
                  <MessageSquare
                    strokeWidth={3}
                    className="mr-2 h-3.5 w-3.5 text-neutral-400"
                  />
                  <span className=" text-neutral-700">
                    Conclude with new comment
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {concludedComment && (
          <span
            className="cursor-pointer rounded-lg bg-green-50 px-2 py-0 font-medium text-green-600"
            onClick={() => {
              const concludedCommentInDOM = document.getElementById(
                `${threadID}-${concludedComment.comment_id}`,
              );
              const topPos = concludedCommentInDOM.offsetTop;
              document.getElementById(`child-thread-${threadID}`).scrollTo({
                top: topPos - 20,
                behavior: "smooth",
              });
            }}
          >
            Concluded
          </span>
        )}
      </div>
      <div
        id={`child-thread-${threadID}`}
        className="flex h-full flex-col overflow-y-scroll"
      >
        <div className={`mx-5 mb-8 mt-5`}>
          <div className="mb-2 flex flex-row items-center">
            <Avatar className="mr-3 flex h-7 w-7 text-xs">
              <AvatarImage src="" />
              <AvatarFallback>{thread.quote_by[0]}</AvatarFallback>
            </Avatar>
            <span className={`flex text-sm font-semibold text-neutral-700`}>
              {thread.quote_by}
            </span>
          </div>
          <div className="ml-[2.5rem] border-l-[6px] border-CQ2Orange-600/50 pl-3 text-neutral-700">
            {parse(thread.quote)}
          </div>
        </div>
        <div>
          {thread.comments.map((comment, idx) => (
            <div
              className={`${
                comment.comment_id === thread.comments.length - 1 &&
                wasNewCommentAdded
                  ? "new-comment"
                  : ""
              } group relative w-full px-5 pb-8`}
              key={comment.comment_id}
              id={`${threadID}-${comment.comment_id}`}
              onClick={(e) => {
                if (!comment.for_child_thread_created)
                  showNewThreadPopup(e, comment.comment_id, idx);
              }}
            >
              {CQ2DocumentUnreadComments[threadID] > 0 &&
              idx ===
                thread.comments.length - CQ2DocumentUnreadComments[threadID] &&
              CQ2Document._id !== "demo" ? (
                <div className="relative">
                  <Separator className="mb-8 bg-blue-600" />
                  <span className="absolute right-0 top-[-0.5rem] rounded-lg bg-blue-50 px-2 py-0 text-xs font-medium text-blue-600">
                    Unread
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <Separator className="mb-8" />
                  <span className="invisible absolute right-0 top-[-0.5rem] rounded-lg bg-blue-50 px-2 py-0 text-xs font-medium text-blue-600">
                    Unread
                  </span>
                </div>
              )}
              <div
                className={`mb-2 flex h-6 flex-row justify-between text-sm font-semibold text-neutral-700`}
              >
                <div
                  id="comment-name-created-on"
                  className="flex flex-row items-center"
                >
                  <Avatar className="mr-3 h-7 w-7 text-xs">
                    <AvatarImage src="" />
                    <AvatarFallback>{comment.user_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span>{comment.user_name}</span>
                    <span className="ml-3 text-xs font-normal text-neutral-400">
                      {dayjs(comment.created_on).format("MMM DD, YYYY")},{" "}
                      {dayjs(comment.created_on).format("hh:mm A")}
                    </span>
                    {comment.is_conclusion && (
                      <span className="ml-3 text-xs font-normal text-green-600">
                        Conclusion
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {!comment.for_child_thread_created &&
                !comment.for_child_thread_concluded && (
                  <div className="ml-[2.5rem]">
                    <ContentWithHighlight
                      containerId={`${threadID}-${comment.comment_id}-text-container`}
                      content={comment.content}
                      highlights={comment.highlights}
                      CQ2DocumentCurrentHighlights={
                        CQ2DocumentCurrentHighlights
                      }
                    />
                  </div>
                )}
              {comment.for_child_thread_created && (
                <div className="ml-[2.5rem]">
                  <span className="text-neutral-400">
                    Created a new thread for:
                  </span>{" "}
                  <span
                    className="cursor-pointer font-medium text-neutral-600 underline"
                    onClick={() => {
                      const forNewThreadCreatedParentComment =
                        document.getElementById(
                          `${threadID}-${comment.for_child_thread_created_parent_comment_id}`,
                        );
                      const topPos = forNewThreadCreatedParentComment.offsetTop;
                      document
                        .getElementById(`child-thread-${threadID}`)
                        .scrollTo({
                          top: topPos - 35,
                          behavior: "smooth",
                        });
                    }}
                  >
                    {comment.for_child_thread_created_quote}
                  </span>
                </div>
              )}
              {comment.for_child_thread_concluded && (
                <div className="ml-[2.5rem]">
                  <span className="text-neutral-400">
                    Concluded the thread for:
                  </span>{" "}
                  <span
                    className="cursor-pointer font-medium text-neutral-600 underline"
                    onClick={() => {
                      const forNewThreadConcludedParentComment =
                        document.getElementById(
                          `${threadID}-${comment.for_child_thread_concluded_parent_comment_id}`,
                        );
                      const topPos =
                        forNewThreadConcludedParentComment.offsetTop;
                      document
                        .getElementById(`child-thread-${threadID}`)
                        .scrollTo({
                          top: topPos - 35,
                          behavior: "smooth",
                        });
                    }}
                  >
                    {comment.for_child_thread_concluded_quote}
                  </span>
                </div>
              )}
              {isNewThreadPopupOpen[comment.comment_id] &&
                !comment.for_child_thread_created && (
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
                      newThreadPopupRef.current[comment.comment_id] = v;
                    }}
                  >
                    <MessageSquareQuote
                      strokeWidth={3}
                      className="mr-2 mt-0.5 h-4 w-4 text-neutral-400"
                    />
                    Comment in new thread
                  </Button>
                )}
            </div>
          ))}
        </div>
      </div>
      {showUnreadIndicator &&
        CQ2DocumentUnreadComments[threadID] > 0 &&
        CQ2Document._id !== "demo" && (
          <div
            className={`absolute bottom-24 left-1/2 z-40 flex w-fit -translate-x-1/2 items-center rounded-lg bg-blue-50 py-1.5 pl-1.5 pr-2 text-sm font-normal text-blue-600`}
          >
            <ArrowDown className="mr-2 h-4 w-4" strokeWidth={2} />
            Unread comments
          </div>
        )}
      {!showConcludeThreadCommentBox && (
        <div
          className={`${
            editor &&
            editor?.getHTML() !== '<p class="mt-[1em] first:mt-0"></p>'
              ? "border border-neutral-300 bg-[#fff]"
              : "border border-[#f7f7f5] bg-[#f7f7f5]"
          } relative z-50 m-5 w-auto rounded-lg`}
        >
          {editor && <CQ2BubbleMenu editor={editor} />}
          <EditorContent
            editor={editor}
            className="CQ2Document-editor min-h-[2.5rem] pl-1 pr-[2.5rem] text-neutral-700"
          />
          <Button
            className={`${
              editor?.getHTML() !== '<p class="mt-[1em] first:mt-0"></p>'
                ? "bg-neutral-800 hover:bg-neutral-700"
                : "bg-neutral-200 hover:bg-neutral-200"
            } absolute bottom-[0.25rem] right-[0.25rem] h-8 w-8 rounded-lg p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200`}
            onClick={() => {
              handleCommentInThread();
            }}
          >
            <ArrowUp className="h-4 w-4" strokeWidth={3} />
          </Button>
        </div>
      )}
      {showConcludeThreadCommentBox && (
        <div
          className={`${
            conclusionEditor &&
            conclusionEditor?.getHTML() !==
              '<p class="mt-[1em] first:mt-0"></p>'
              ? "border border-neutral-300 bg-[#fff]"
              : "border border-green-50 bg-green-50"
          } relative z-50 m-5 w-auto rounded-lg`}
        >
          {conclusionEditor && <CQ2BubbleMenu editor={conclusionEditor} />}
          <EditorContent
            editor={conclusionEditor}
            className="CQ2-thread-conclusion-editor min-h-[2.5rem] pl-1 pr-[2.5rem] text-neutral-700"
          />
          {conclusionEditor?.getHTML() !==
          '<p class="mt-[1em] first:mt-0"></p>' ? (
            <Button
              className="absolute bottom-[0.25rem] right-[0.25rem] h-8 w-8 rounded-lg bg-green-500 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-green-600"
              onClick={() => {
                handleCommentInThread(true);
                setShowConcludeThreadCommentBox(false);
              }}
            >
              <Check className="h-4 w-4" strokeWidth={3} />
            </Button>
          ) : (
            <Button
              className="absolute right-[0.25rem] top-[0.25rem] h-8 w-8 rounded-lg bg-transparent p-[0.5rem] font-normal text-neutral-400 shadow-none transition duration-200 hover:bg-neutral-100"
              onClick={() => {
                setShowConcludeThreadCommentBox(false);
                editor.commands.clearContent();
                editor.commands.focus();
              }}
            >
              <X className="h-4 w-4" strokeWidth={3} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default V1ChildThread;
