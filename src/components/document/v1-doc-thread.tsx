"use client";

import { manrope } from "@/app/fonts";
import CQ2BubbleMenu from "@/components/editor/cq2-bubble-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { Link as TiptapLink } from "@tiptap/extension-link";
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
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  MessageCircle,
  MessageSquareQuote,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { fromRange } from "xpath-range";
import ContentWithHighlight from "./content-with-highlight";

const V1DocThread = () => {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();

  const { CQ2DocumentOpenThreads, setNewCQ2DocumentOpenThreads } =
    useCQ2DocumentOpenThreadsStore();
  const { CQ2DocumentCurrentHighlights, setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();
  const { CQ2DocumentUnreadComments, setNewCQ2DocumentUnreadComments } =
    useCQ2DocumentUnreadCommentsStore();

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
    if (typeof window !== "undefined" && localStorage.getItem("cq2UserName")) {
      setCq2UserName(localStorage.getItem("cq2UserName"));
    } else if (CQ2Document._id === "demo") {
      setCq2UserName("Ava");
    } else {
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (width > 900) {
        setShowUserNameDialog(true);
      }
    }
  }, [setCq2UserName, pathname, CQ2Document._id]);

  const [wasNewCommentAdded, setWasNewCommentAdded] = useState(false);

  const [isNewThreadPopupInCommentOpen, setIsNewThreadPopupInCommentOpen] =
    useState(Array(CQ2Document.version1.comments.length).fill(false));

  const [
    isNewThreadPopupInCQ2DocumentOpen,
    setIsNewThreadPopupInCQ2DocumentOpen,
  ] = useState(false);

  const [newThreadPopupCoords, setNewThreadPopupCoords] = useState({});

  const newThreadPopupInCommentRef = useRef([]);
  const newThreadPopupInCQ2DocumentRef = useRef();

  const { setShowThreadInfoBox } = useShowThreadInfoBoxStore();
  const { setThreadInfoBoxThreadID } = useThreadInfoBoxThreadIDStore();
  const { setThreadInfoBoxCoords } = useThreadInfoBoxCoordsStore();

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

      setIsNewThreadPopupInCommentOpen(
        Array(CQ2Document.version1.comments.length).fill(false),
      );
      setIsNewThreadPopupInCQ2DocumentOpen(false);

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

      setIsNewThreadPopupInCommentOpen(
        Array(CQ2Document.version1.comments.length).fill(false),
      );
      setIsNewThreadPopupInCQ2DocumentOpen(false);

      return;
    }

    const newThreadID = CQ2Document.version1.threads.length + 1;

    let newHighlightToAdd = {};

    if (comment) {
      const commentTextContainer = document.getElementById(
        `0-${comment.comment_id}-text-container`,
      );

      const xPathRange = fromRange(range, commentTextContainer);

      newHighlightToAdd = {
        highlight_id: comment.highlights.length,
        start: xPathRange.start,
        startOffset:
          text[0] === "‎" && xPathRange.startOffset === 0
            ? 1
            : xPathRange.startOffset,
        end: xPathRange.end,
        endOffset: xPathRange.endOffset,
        thread_id: 0,
        comment_id: comment.comment_id,
        to_thread_id: newThreadID,
      };

      const newHighlights = [].concat(comment.highlights, newHighlightToAdd);

      const newThreads = [].concat(CQ2Document.version1.threads, {
        thread_id: newThreadID,
        from_thread_id: 0,
        from_comment_id: comment.comment_id,
        from_highlight_id: comment.highlights.length,
        quote: text,
        quote_by: comment.user_name,
        comments: [],
      });

      const newComment = { ...comment, highlights: newHighlights };

      const newComments = CQ2Document.version1.comments.filter(
        (_comment) => _comment.comment_id !== comment.comment_id,
      );

      newComments.push(newComment);

      newComments.push({
        comment_id: CQ2Document.version1.comments.length,
        thread_id: 0,
        user_name: cq2UserName,
        content: "",
        created_on: Date.now(),
        highlights: [],
        is_resolution: false,
        for_child_thread_created: true,
        for_child_thread_created_parent_comment_id: comment.comment_id,
        for_child_thread_created_quote: text.substring(0, 52) + "...",
      });

      newComments.sort((a, b) => a.comment_id - b.comment_id);

      const newCQ2Document = {
        ...CQ2Document,
        version1: {
          ...CQ2Document.version1,
          threads: newThreads,
          comments: newComments,
        },
      };

      setShowUnreadIndicator(false);

      updateCQ2Document(newCQ2Document);
      setNewCQ2Document(newCQ2Document);

      setWasNewCommentAdded(true);

      if (CQ2Document._id !== "demo" && typeof window !== "undefined") {
        const CQ2DocumentsReadFromLS = JSON.parse(
          localStorage.getItem("CQ2DocumentsRead"),
        );

        const CQ2DocumentFromLS = CQ2DocumentsReadFromLS.CQ2Documents.filter(
          (CQ2DocumentReadFromLS) =>
            CQ2DocumentReadFromLS._id === CQ2Document._id,
        )[0].threads;

        CQ2DocumentFromLS[0] = CQ2Document.version1.comments.length;

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
              (thread) => thread.thread_id === i,
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
          let cq2CommentedCQ2DocumentsJSON = JSON.parse(
            cq2CommentedCQ2Documents,
          );

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
    } else {
      const CQ2DocumentDescriptionContainer = document.getElementById(
        "document-content-container",
      );

      const xPathRange = fromRange(range, CQ2DocumentDescriptionContainer);

      newHighlightToAdd = {
        highlight_id: CQ2Document.version1.highlights.length,
        start: xPathRange.start,
        startOffset:
          text[0] === "‎" && xPathRange.startOffset === 0
            ? 1
            : xPathRange.startOffset,
        end: xPathRange.end,
        endOffset: xPathRange.endOffset,
        thread_id: 0,
        comment_id: -1,
        to_thread_id: newThreadID,
      };

      const newHighlights = [].concat(
        CQ2Document.version1.highlights,
        newHighlightToAdd,
      );

      const newThreads = [].concat(CQ2Document.version1.threads, {
        thread_id: newThreadID,
        from_thread_id: 0,
        from_comment_id: -1,
        from_highlight_id: CQ2Document.version1.highlights.length,
        quote: text,
        quote_by: CQ2Document.user_name,
        comments: [],
      });

      const newCQ2Document = {
        ...CQ2Document,
        version1: {
          ...CQ2Document.version1,
          threads: newThreads,
          highlights: newHighlights,
        },
      };

      updateCQ2Document(newCQ2Document);
      setNewCQ2Document(newCQ2Document);
    }

    window.getSelection().empty();

    setIsNewThreadPopupInCommentOpen(
      Array(CQ2Document.version1.comments.length).fill(false),
    );
    setIsNewThreadPopupInCQ2DocumentOpen(false);

    setNewCQ2DocumentOpenThreads([newThreadID]);

    setNewCQ2DocumentCurrentHighlights([newHighlightToAdd]);
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
              "bg-[#F9F9F9] text-neutral-700 p-4 rounded-sm text-sm mt-[1em] first:mt-0",
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
      TiptapLink.configure({
        HTMLAttributes: {
          class: cn("text-[#797874] underline"),
        },
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: "Write a comment...",
      }),
      CharacterCount.configure({
        limit: 6000,
      }),
      ShiftEnterCreateExtension,
      Underline,
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  const handleCommentInThread = (isResolution = false) => {
    let commentHTML = editor.getHTML();

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

    const newComments = [].concat(CQ2Document.version1.comments, {
      comment_id: CQ2Document.version1.comments.length,
      thread_id: 0,
      user_name: cq2UserName,
      content: processedComment.innerHTML,
      created_on: Date.now(),
      highlights: [],
      is_resolution: isResolution,
    });

    const newCQ2Document = {
      ...CQ2Document,
      version1: {
        ...CQ2Document.version1,
        comments: newComments,
      },
    };

    setShowUnreadIndicator(false);

    updateCQ2Document(newCQ2Document);
    setNewCQ2Document(newCQ2Document);

    editor.commands.clearContent();

    setWasNewCommentAdded(true);

    if (CQ2Document._id !== "demo" && typeof window !== "undefined") {
      const CQ2DocumentsReadFromLS = JSON.parse(
        localStorage.getItem("CQ2DocumentsRead"),
      );

      const CQ2DocumentFromLS = CQ2DocumentsReadFromLS.CQ2Documents.filter(
        (CQ2DocumentReadFromLS) =>
          CQ2DocumentReadFromLS._id === CQ2Document._id,
      )[0].threads;

      CQ2DocumentFromLS[0] = CQ2Document.version1.comments.length;

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
            (thread) => thread.thread_id === i,
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
      document.getElementById("document-doc-thread").scrollTo({
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
      (newThreadPopupInCQ2DocumentRef.current &&
        !e.composedPath().includes(newThreadPopupInCQ2DocumentRef.current))
    ) {
      window.getSelection().empty();

      setIsNewThreadPopupInCommentOpen(
        Array(CQ2Document.version1.comments.length).fill(false),
      );
      setIsNewThreadPopupInCQ2DocumentOpen(false);
    }
  };

  useEffect(() => {
    if (
      isNewThreadPopupInCommentOpen.every((v) => v === false) &&
      !isNewThreadPopupInCQ2DocumentOpen
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

  const showNewThreadPopup = (e, comment_id, idx = -1) => {
    const selection = window.getSelection();
    const text = selection.toString();

    if (!text || text.charCodeAt(0) === 10) {
      return;
    }

    if (comment_id === -1) {
      const docDontentContainerBounds = document
        .getElementById("document-content-container")
        .getBoundingClientRect();

      let xCoord = e.clientX - docDontentContainerBounds.left + 35;
      let yCoord = e.clientY - docDontentContainerBounds.top + 75;

      if (xCoord + 170 > docDontentContainerBounds.width) {
        xCoord = docDontentContainerBounds.width - 210;
        yCoord = yCoord + 10;
      }

      setNewThreadPopupCoords({
        x: xCoord,
        y: yCoord,
      });

      setIsNewThreadPopupInCQ2DocumentOpen(true);
    } else {
      const commentTextContainerBounds = document
        .getElementById(`0-${comment_id}-text-container`)
        .getBoundingClientRect();

      let xCoord = e.clientX - commentTextContainerBounds.left + 70;
      let yCoord = e.clientY - commentTextContainerBounds.top + 80;

      if (
        xCoord + 170 > commentTextContainerBounds.width &&
        idx === CQ2Document.version1.comments.length - 1 &&
        yCoord + 40 > commentTextContainerBounds.height
      ) {
        xCoord = e.clientX - commentTextContainerBounds.left - 175;
        yCoord = e.clientY - commentTextContainerBounds.top + 37;
      } else if (xCoord + 170 > commentTextContainerBounds.width) {
        xCoord = commentTextContainerBounds.width - 180;
        yCoord = yCoord + 10;
      } else if (
        idx === CQ2Document.version1.comments.length - 1 &&
        idx !== 0 &&
        yCoord - 40 > commentTextContainerBounds.height
      ) {
        const documentDocThreadContainer = document.getElementById(
          "document-doc-thread",
        );
        const hasScrollableContent =
          documentDocThreadContainer.scrollHeight >
          documentDocThreadContainer.clientHeight;
        const overflowYStyle = window.getComputedStyle(
          documentDocThreadContainer,
        ).overflowY;
        const isOverflowHidden = overflowYStyle.indexOf("hidden") !== -1;

        if (hasScrollableContent && !isOverflowHidden) {
          yCoord = e.clientY - commentTextContainerBounds.top + 37;
        }
      }

      if (idx === 0) {
        yCoord = yCoord - 35;

        if (xCoord + 170 > commentTextContainerBounds.width) {
          xCoord = commentTextContainerBounds.width - 180;
          yCoord = yCoord + 10;
        }
      }

      setNewThreadPopupCoords({
        x: xCoord,
        y: yCoord,
      });

      const newIsNewThreadPopupOpen = isNewThreadPopupInCommentOpen;
      newIsNewThreadPopupOpen[comment_id] = true;
      setIsNewThreadPopupInCommentOpen(newIsNewThreadPopupOpen);
    }
  };

  useEffect(() => {
    if (!CQ2Document._id) {
      return;
    }

    const CQ2DocumentDocThread = document.getElementById("document-doc-thread");

    const setCQ2DocumentReadUnreadComments = () => {
      const CQ2DocumentsReadFromLS = JSON.parse(
        localStorage.getItem("CQ2DocumentsRead"),
      );

      const CQ2DocumentFromLS = CQ2DocumentsReadFromLS.CQ2Documents.filter(
        (CQ2DocumentReadFromLS) =>
          CQ2DocumentReadFromLS._id === CQ2Document._id,
      )[0].threads;

      CQ2DocumentFromLS[0] = CQ2Document.version1.comments.length;

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
            (thread) => thread.thread_id === i,
          )[0].comments.length - CQ2DocumentFromLS[i];
      }

      setNewCQ2DocumentUnreadComments(unreadComments);
    };

    if (
      !!!(
        CQ2DocumentDocThread.scrollTop ||
        (++CQ2DocumentDocThread.scrollTop && CQ2DocumentDocThread.scrollTop--)
      )
    ) {
      if (typeof window !== "undefined") {
        setCQ2DocumentReadUnreadComments();
      }
    } else {
      let lastScrollTop = 0;

      CQ2DocumentDocThread.onscroll = (e) => {
        if (CQ2DocumentDocThread.scrollTop < lastScrollTop) {
          return;
        }

        lastScrollTop =
          CQ2DocumentDocThread.scrollTop <= 0
            ? 0
            : CQ2DocumentDocThread.scrollTop;
        if (
          CQ2DocumentDocThread.scrollTop + CQ2DocumentDocThread.offsetHeight >=
          CQ2DocumentDocThread.scrollHeight
        ) {
          if (typeof window !== "undefined") {
            setCQ2DocumentReadUnreadComments();
          }
        }
      };
    }
  }, [CQ2Document, pathname, setNewCQ2DocumentUnreadComments]);

  useEffect(() => {
    const docContentContainer = document.getElementById(
      "document-content-container",
    );

    const CQ2DocumentDocThread = document.getElementById("document-doc-thread");

    if (
      !CQ2DocumentDocThread ||
      !docContentContainer ||
      !docContentContainer.innerHTML
    )
      return;

    let hidePopupTimeout;

    for (let i = 0; i < CQ2Document.version1.highlights.length; i++) {
      const highlight = CQ2Document.version1.highlights[i];

      document
        .querySelectorAll(
          `span[data-info='${highlight.thread_id}-${highlight.comment_id}-${highlight.highlight_id}-${highlight.to_thread_id}']`,
        )
        .forEach((highlightSpan) => {
          highlightSpan.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (CQ2DocumentDocThread.dataset.isFull === "true") {
              CQ2DocumentDocThread.scrollBy({
                top: -96,
              });
            }

            setNewCQ2DocumentOpenThreads(
              getNewCQ2DocumentOpenThreads(highlight.to_thread_id, CQ2Document),
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
              e.target.closest("span").className !== "cq2-highlight-span-active"
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
                    codeElement.className = "cq2-highlight-span-inactive-hover";
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

              let yCoord =
                highlightSpanBounds.top - 20 - window.innerHeight / 2;

              if (
                xCoord + 352 >=
                document.documentElement.clientWidth +
                  CQ2DocumentsThreadsScrollableContainer?.scrollLeft
              ) {
                xCoord =
                  highlightSpanBounds.left +
                  CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                  372;
              }

              const CQ2DocumentsThreadsScrollableContainerHeightMid =
                CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                  .height /
                  2 -
                456;

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
              e.target.closest("span").className !== "cq2-highlight-span-active"
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

    return () => {
      for (let i = 0; i < CQ2Document.version1.highlights.length; i++) {
        const highlight = CQ2Document.version1.highlights[i];

        document
          .querySelectorAll(
            `span[data-info='${highlight.thread_id}-${highlight.comment_id}-${highlight.highlight_id}-${highlight.to_thread_id}']`,
          )
          .forEach((highlightSpan) => {
            highlightSpan.removeEventListener("click", function (e) {
              e.preventDefault();
              e.stopPropagation();

              if (CQ2DocumentDocThread.dataset.isFull === "true") {
                CQ2DocumentDocThread.scrollBy({
                  top: -96,
                });
              }

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

                const CQ2DocumentsThreadsScrollableContainer =
                  document.getElementById(
                    "CQ2Document-threads-scrollable-container",
                  );

                let xCoord =
                  highlightSpanBounds.right +
                  CQ2DocumentsThreadsScrollableContainer?.scrollLeft +
                  10;

                let yCoord =
                  highlightSpanBounds.top - 20 - window.innerHeight / 2;

                if (
                  xCoord + 352 >=
                  document.documentElement.clientWidth +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft
                ) {
                  xCoord =
                    highlightSpanBounds.left +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                    372;
                }

                const CQ2DocumentsThreadsScrollableContainerHeightMid =
                  CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                    .height /
                    2 -
                  456;

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

              const threadInfoBox = document.getElementById("thread-info-box");

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
    };
  }, [CQ2Document]);

  useEffect(() => {
    let hidePopupTimeout;

    for (let c = 0; c < CQ2Document.version1.comments.length; c++) {
      const hightlightsInComments = CQ2Document.version1.comments[c].highlights;

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

              const documentDocThread = document.getElementById(
                "document-doc-thread",
              );

              if (documentDocThread.dataset.isFull === "true") {
                documentDocThread.scrollBy({
                  top: -96,
                });
              }

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

                let yCoord =
                  highlightSpanBounds.top - 20 - window.innerHeight / 2;

                if (
                  xCoord + 352 >=
                  document.documentElement.clientWidth +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft
                ) {
                  xCoord =
                    highlightSpanBounds.left +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                    372;
                }

                const CQ2DocumentsThreadsScrollableContainerHeightMid =
                  CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                    .height /
                    2 -
                  456;

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
      for (let c = 0; c < CQ2Document.version1.comments.length; c++) {
        const hightlightsInComments =
          CQ2Document.version1.comments[c].highlights;

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

                const documentDocThread = document.getElementById(
                  "document-doc-thread",
                );

                if (documentDocThread.dataset.isFull === "true") {
                  documentDocThread.scrollBy({
                    top: -96,
                  });
                }

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

                  const CQ2DocumentsThreadsScrollableContainer =
                    document.getElementById(
                      "CQ2Document-threads-scrollable-container",
                    );

                  let xCoord =
                    highlightSpanBounds.right +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft +
                    10;

                  let yCoord =
                    highlightSpanBounds.top - 20 - window.innerHeight / 2;

                  if (
                    xCoord + 352 >=
                    document.documentElement.clientWidth +
                      CQ2DocumentsThreadsScrollableContainer?.scrollLeft
                  ) {
                    xCoord =
                      highlightSpanBounds.left +
                      CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                      372;
                  }

                  const CQ2DocumentsThreadsScrollableContainerHeightMid =
                    CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                      .height /
                      2 -
                    456;

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
  }, [CQ2Document]);

  return (
    <div
      id="document-doc-thread"
      className={`flex flex-col items-center overflow-y-scroll bg-[#FFFFFF] shadow-none ${
        CQ2DocumentOpenThreads.length === 0
          ? "h-full w-screen pt-32"
          : "mr-4 h-[calc(100vh-4rem)] w-[calc(((100vw)/2)-0.5rem)] pt-8 2xl:w-[45.5rem]"
      }
      `}
      data-is-full={CQ2DocumentOpenThreads.length === 0 ? "true" : "false"}
    >
      <div className="w-[44rem]">
        <h5
          className={`${manrope.className} mx-4 mb-5 w-fit rounded-sm bg-CQ2Orange-50 px-1 py-0 text-xs font-medium tracking-wider text-CQ2Orange-600`}
        >
          DRAFT
        </h5>
        <h1 className="w-full appearance-none border-none px-4 text-4xl font-semibold leading-tight text-[#37362f]">
          {CQ2Document.version1.title}
        </h1>
        <div className="mt-5 px-4 text-base font-normal text-neutral-600">
          <span className="mr-2 text-neutral-400">by</span>
          {CQ2Document.user_name}
        </div>
        <div className="mt-1 px-4 text-base font-normal text-neutral-600">
          <span className="mr-2 text-neutral-400">on</span>
          {dayjs(CQ2Document.version1.created_on).format("MMM DD YYYY")}
          {", "}
          {dayjs(CQ2Document.version1.created_on).format("hh:mm A")}
        </div>
        <div className="px-4">
          <Separator className="mt-16" />
        </div>
        <div
          onClick={(e) => showNewThreadPopup(e, -1)}
          className="relative px-4 pb-16 pt-16"
        >
          <ContentWithHighlight
            containerId="document-content-container"
            content={CQ2Document.version1.content}
            highlights={CQ2Document.version1.highlights}
            CQ2DocumentCurrentHighlights={CQ2DocumentCurrentHighlights}
          />
          {isNewThreadPopupInCQ2DocumentOpen && (
            <Button
              onClick={(e) => handleCommentInNewThread()}
              className="new-thread-popup-btn absolute z-50 rounded-sm border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition duration-200 hover:bg-neutral-100"
              style={{
                left: newThreadPopupCoords.x,
                top: newThreadPopupCoords.y,
              }}
              key={0}
              ref={(v) => {
                newThreadPopupInCQ2DocumentRef.current = v;
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
        <div>
          {CQ2Document.version1.comments.length > 0 && (
            <div className="px-4">
              <Separator className="mb-16" />
              <div className="mb-10 flex w-full items-center text-sm font-medium text-neutral-600">
                <MessageCircle
                  className="ml-2 mr-4 h-4 w-4"
                  strokeWidth={2.5}
                />
                <span>{CQ2Document.version1.comments.length}</span>
                <span className="ml-1">general comments</span>
                {CQ2DocumentUnreadComments[0] > 0 &&
                  CQ2DocumentUnreadComments[0] ===
                    CQ2Document.version1.comments.length &&
                  CQ2Document._id !== "demo" && (
                    <span className="ml-3 rounded-sm bg-blue-50 px-2 py-0 text-xs font-medium text-blue-600">
                      All unread
                    </span>
                  )}
              </div>
            </div>
          )}
          {CQ2Document.version1.comments.map((comment, idx) => (
            <div
              key={comment.comment_id}
              className={`${
                comment.comment_id ===
                  CQ2Document.version1.comments.length - 1 && wasNewCommentAdded
                  ? "new-comment"
                  : ""
              } group relative w-full px-4 pb-8`}
              id={`0-${comment.comment_id}`}
              onClick={(e) => {
                if (!comment.for_child_thread_created)
                  showNewThreadPopup(e, comment.comment_id, idx);
              }}
            >
              {idx !== 0 &&
                (CQ2DocumentUnreadComments[0] > 0 &&
                idx ===
                  CQ2Document.version1.comments.length -
                    CQ2DocumentUnreadComments[0] &&
                CQ2Document._id !== "demo" ? (
                  <div className="relative">
                    <Separator className="mb-8 bg-blue-600" />
                    <span className="absolute right-0 top-[-0.5rem] rounded-sm bg-blue-50 px-2 py-0 text-xs font-medium text-blue-600">
                      Unread
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <Separator className="mb-8" />
                    <span className="invisible absolute right-0 top-[-0.5rem] rounded-sm bg-blue-50 px-2 py-0 text-xs font-medium text-blue-600">
                      Unread
                    </span>
                  </div>
                ))}
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
                  </div>
                </div>
              </div>
              {!comment.for_child_thread_created &&
                !comment.for_child_thread_resolved && (
                  <div className="ml-[2.5rem]">
                    <ContentWithHighlight
                      containerId={`0-${comment.comment_id}-text-container`}
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
                          `0-${comment.for_child_thread_created_parent_comment_id}`,
                        );
                      const topPos = forNewThreadCreatedParentComment.offsetTop;
                      document.getElementById("document-doc-thread").scrollTo({
                        top: topPos + 5,
                        behavior: "smooth",
                      });
                    }}
                  >
                    {comment.for_child_thread_created_quote}
                  </span>
                </div>
              )}
              {comment.for_child_thread_resolved && (
                <div className="ml-[2.5rem]">
                  <span className="text-neutral-400">
                    Resolved the thread for:
                  </span>{" "}
                  <span
                    className="cursor-pointer font-medium text-neutral-600 underline"
                    onClick={() => {
                      const forNewThreadResolvedParentComment =
                        document.getElementById(
                          `0-${comment.for_child_thread_resolved_parent_comment_id}`,
                        );
                      const topPos =
                        forNewThreadResolvedParentComment.offsetTop;
                      document.getElementById("document-doc-thread").scrollTo({
                        top: topPos - 35,
                        behavior: "smooth",
                      });
                    }}
                  >
                    {comment.for_child_thread_resolved_quote}
                  </span>
                </div>
              )}
              {isNewThreadPopupInCommentOpen[comment.comment_id] &&
                !comment.for_child_thread_created && (
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
                      newThreadPopupInCommentRef.current[comment.comment_id] =
                        v;
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
        {showUnreadIndicator &&
          CQ2DocumentUnreadComments[0] > 0 &&
          CQ2Document._id !== "demo" && (
            <div
              className={`absolute bottom-24 left-1/2 z-40 flex w-fit -translate-x-1/2 items-center rounded-sm bg-blue-50 py-1.5 pl-1.5 pr-2 text-sm font-normal text-blue-600`}
            >
              <ArrowDown className="mr-2 h-4 w-4" strokeWidth={2} />
              Unread comments
            </div>
          )}
        <div
          className={`${
            editor &&
            editor?.getHTML() !== '<p class="mt-[1em] first:mt-0"></p>'
              ? "border border-neutral-300 bg-[#fff]"
              : "border border-[#f7f7f5] bg-[#f7f7f5]"
          } ${
            CQ2DocumentOpenThreads.length === 0 ? "mb-4" : ""
          } relative mx-4 mt-8 w-auto rounded-sm`}
        >
          {editor && <CQ2BubbleMenu editor={editor} />}
          <EditorContent
            editor={editor}
            className="CQ2Document-editor min-h-[2.5rem] pl-1 pr-[2.5rem] text-neutral-700"
          />
          <Button
            className={`${
              editor &&
              editor?.getHTML() !== '<p class="mt-[1em] first:mt-0"></p>'
                ? "bg-neutral-800 hover:bg-neutral-700"
                : "bg-neutral-200 hover:bg-neutral-200"
            } absolute bottom-[0.25rem] right-[0.25rem] h-8 w-8 rounded-sm p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200`}
            onClick={() => {
              handleCommentInThread();
            }}
          >
            <ArrowUp className="h-4 w-4" strokeWidth={3} />
          </Button>
        </div>
      </div>
      <Dialog open={showUserNameDialog} onOpenChange={setShowUserNameDialog}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                placeholder="Enter your name"
                className="w-full rounded-sm border border-neutral-400 bg-[#FFFFFF] py-2 pl-4 text-base text-neutral-700 placeholder:text-[#adb5bd] focus:outline-none"
                type="text"
                onChange={handleUserNameChange}
                onKeyDown={(e) => {
                  if (e.keyCode === 13 && typeof window !== "undefined") {
                    localStorage.setItem("cq2UserName", userName);
                    setCq2UserName(userName);
                    setShowUserNameDialog(false);
                  }
                }}
              />
              <Button
                className="absolute bottom-[0.3rem] right-[0.3rem] h-8 w-8 rounded-sm bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-700"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("cq2UserName", userName);
                    setCq2UserName(userName);
                    setShowUserNameDialog(false);
                  }
                }}
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

export default V1DocThread;
