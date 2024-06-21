"use client";

import CQ2BubbleMenu from "@/components/editor/cq2-bubble-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  cn,
  getNewCQ2DocumentCurrentHighlights,
  getNewCQ2DocumentOpenThreads,
} from "@/lib/utils";
import {
  useCQ2DocumentCurrentHighlightsStore,
  useCQ2DocumentOpenThreadsStore,
  useCQ2DocumentStore,
  useCQ2DocumentUnreadCommentsStore,
  useShowLatestVersionEditorStore,
  useShowOldVersionStore,
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
import {
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

const MainThread = () => {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();

  const { setNewCQ2DocumentOpenThreads } = useCQ2DocumentOpenThreadsStore();
  const { CQ2DocumentCurrentHighlights, setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();
  const { CQ2DocumentUnreadComments, setNewCQ2DocumentUnreadComments } =
    useCQ2DocumentUnreadCommentsStore();

  const { showLatestVersionEditor } = useShowLatestVersionEditorStore();

  const { showOldVersion, setShowOldVersion } = useShowOldVersionStore();

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
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cq2UserName")) {
        setCq2UserName(localStorage.getItem("cq2UserName"));
      }
    }
  }, [setCq2UserName]);

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

  const { showThreadInfoBox, setShowThreadInfoBox } =
    useShowThreadInfoBoxStore();
  const { threadInfoBoxThreadID, setThreadInfoBoxThreadID } =
    useThreadInfoBoxThreadIDStore();
  const { threadInfoBoxCoords, setThreadInfoBoxCoords } =
    useThreadInfoBoxCoordsStore();

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
      selection?.focusNode?.parentElement.closest("p")
    ) {
      toast.warning("Quoting from different paragraphs isn't allowed");

      window.getSelection().empty();

      setIsNewThreadPopupInCommentOpen(
        Array(CQ2Document.version1.comments.length).fill(false),
      );
      setIsNewThreadPopupInCQ2DocumentOpen(false);

      return;
    }

    let demoUserName;

    if (!cq2UserName) {
      if (pathname.includes("/app/demo")) {
        demoUserName = "Ava";
      } else if (!userName) {
        setShowUserNameDialog(true);
        return;
      } else {
        localStorage.setItem("cq2UserName", userName);
        setShowUserNameDialog(false);
      }
    }

    const newThreadID = CQ2Document.version1.threads.length + 1;

    let newHighlightToAdd = {};

    if (comment) {
      const commentTextContainer = document.getElementById(
        `0-${comment.comment_id}-text-container`,
      );

      const xPathRange = fromRange(range, commentTextContainer);

      // if (comment.comment_id === 2) {
      //   const hehe = toRange(
      //     xPathRange.start,
      //     xPathRange.startOffset,
      //     xPathRange.end,
      //     xPathRange.endOffset,
      //     commentTextContainer,
      //   );

      //   const rangeContents = hehe.extractContents();

      //   const bla = rangeContents.cloneNode(true);

      //   console.log("main");
      //   console.log(bla);

      //   hehe.insertNode(rangeContents);
      // }

      newHighlightToAdd = {
        highlight_id: comment.highlights.length,
        start: xPathRange.start,
        startOffset: xPathRange.startOffset,
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
        user_name: cq2UserName || userName || demoUserName,
        content: "",
        created_on: Date.now(),
        highlights: [],
        is_conclusion: false,
        for_new_thread_created: true,
        for_new_thread_created_parent_comment_id: comment.comment_id,
        for_new_thread_created_quote: text.substring(0, 52) + "...",
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

      updateCQ2Document(newCQ2Document);
      setNewCQ2Document(newCQ2Document);
    } else {
      const CQ2DocumentDescriptionContainer = document.getElementById(
        "document-content-container",
      );

      const xPathRange = fromRange(range, CQ2DocumentDescriptionContainer);

      newHighlightToAdd = {
        highlight_id: CQ2Document.version1.highlights.length,
        start: xPathRange.start,
        startOffset: xPathRange.startOffset,
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
            class: cn("list-decimal ml-8"),
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: cn("list-disc ml-8"),
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "cq2-tiptap-blockquote",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: cn("bg-[#F9F9F9] text-neutral-700 p-4 rounded-lg text-sm"),
          },
        },
        code: {
          HTMLAttributes: {
            class: cn("bg-[#F9F9F9] text-neutral-700 p-0.5"),
          },
        },
      }),
      Heading.extend({
        levels: [1, 2],
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];
          const classes: { [index: number]: string } = {
            1: "text-2xl font-semibold",
            2: "text-xl font-semibold",
            3: "text-lg font-semibold",
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
        placeholder: "Write a general comment...",
      }),
      CharacterCount.configure({
        limit: 6000,
      }),
      ShiftEnterCreateExtension,
      Underline,
    ],
    autofocus: true,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  const handleCommentInThread = (isConclusion = false) => {
    let commentHTML = editor.getHTML();

    if (!commentHTML || commentHTML === "<p></p>") {
      return;
    }

    let demoUserName;

    if (!cq2UserName) {
      if (pathname.includes("/app/demo")) {
        demoUserName = "Ava";
      } else if (!userName) {
        setShowUserNameDialog(true);
        return;
      } else {
        localStorage.setItem("cq2UserName", userName);
        setShowUserNameDialog(false);
      }
    }

    const newComments = [].concat(CQ2Document.version1.comments, {
      comment_id: CQ2Document.version1.comments.length,
      thread_id: 0,
      user_name: cq2UserName || userName || demoUserName,
      content: commentHTML,
      created_on: Date.now(),
      highlights: [],
      is_conclusion: isConclusion,
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

    if (typeof window !== "undefined") {
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
      document.getElementById("document-main-thread").scrollTo({
        top: 999999,
        behavior: "smooth",
      });
    }, 25);
  };

  const updateCQ2Document = async (CQ2Document) => {
    if (pathname.includes("/app/demo") || CQ2Document.read_only) {
      return;
    }

    try {
      const res = await fetch("/api/document", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(CQ2Document),
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

    if (
      !text ||
      text.charCodeAt(0) === 10 ||
      showLatestVersionEditor ||
      showOldVersion
    ) {
      return;
    }

    if (comment_id === -1) {
      const docDontentContainerBounds = document
        .getElementById("document-content-container")
        .getBoundingClientRect();

      let xCoord = e.clientX - docDontentContainerBounds.left + 35;
      let yCoord = e.clientY - docDontentContainerBounds.top + 30;

      if (xCoord + 170 > docDontentContainerBounds.width) {
        xCoord = docDontentContainerBounds.width - 180;
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

      let xCoord = e.clientX - commentTextContainerBounds.left + 35;
      let yCoord = e.clientY - commentTextContainerBounds.top + 65;

      if (
        xCoord + 170 > commentTextContainerBounds.width &&
        idx === CQ2Document.version1.comments.length - 1 &&
        yCoord + 40 > commentTextContainerBounds.height
      ) {
        xCoord = e.clientX - commentTextContainerBounds.left - 205;
        yCoord = e.clientY - commentTextContainerBounds.top + 37;
      } else if (xCoord + 170 > commentTextContainerBounds.width) {
        xCoord = commentTextContainerBounds.width - 180;
        yCoord = yCoord + 10;
      } else if (
        idx === CQ2Document.version1.comments.length - 1 &&
        yCoord + 40 > commentTextContainerBounds.height
      ) {
        yCoord = e.clientY - commentTextContainerBounds.top + 37;
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

    const CQ2DocumentMainThread = document.getElementById(
      "document-main-thread",
    );

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
        CQ2DocumentMainThread.scrollTop ||
        (++CQ2DocumentMainThread.scrollTop && CQ2DocumentMainThread.scrollTop--)
      )
    ) {
      if (typeof window !== "undefined") {
        setCQ2DocumentReadUnreadComments();
      }
    } else {
      let lastScrollTop = 0;

      CQ2DocumentMainThread.onscroll = (e) => {
        if (CQ2DocumentMainThread.scrollTop < lastScrollTop) {
          return;
        }

        lastScrollTop =
          CQ2DocumentMainThread.scrollTop <= 0
            ? 0
            : CQ2DocumentMainThread.scrollTop;
        if (
          CQ2DocumentMainThread.scrollTop +
            CQ2DocumentMainThread.offsetHeight >=
          CQ2DocumentMainThread.scrollHeight
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

    const CQ2DocumentMainThread = document.getElementById(
      "document-main-thread",
    );

    if (
      !CQ2DocumentMainThread ||
      !docContentContainer ||
      !docContentContainer.innerHTML
    )
      return;

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

            setNewCQ2DocumentOpenThreads(
              getNewCQ2DocumentOpenThreads(highlight.to_thread_id, CQ2Document),
            );
            setNewCQ2DocumentCurrentHighlights(
              getNewCQ2DocumentCurrentHighlights(
                highlight,
                CQ2DocumentCurrentHighlights,
              ),
            );

            setShowThreadInfoBox(false);
          });

          highlightSpan.addEventListener("mouseover", function (e) {
            e.preventDefault();
            e.stopPropagation();

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
                513;

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

            setShowThreadInfoBox(false);
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

              setNewCQ2DocumentOpenThreads(
                getNewCQ2DocumentOpenThreads(
                  highlight.to_thread_id,
                  CQ2Document,
                ),
              );
              setNewCQ2DocumentCurrentHighlights(
                getNewCQ2DocumentCurrentHighlights(
                  highlight,
                  CQ2DocumentCurrentHighlights,
                ),
              );

              setShowThreadInfoBox(false);
            });

            highlightSpan.removeEventListener("mouseover", function (e) {
              e.preventDefault();
              e.stopPropagation();

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
                  513;

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

              setShowThreadInfoBox(false);
            });
          });
      }
    };
  }, [
    CQ2Document,
    setNewCQ2DocumentCurrentHighlights,
    setNewCQ2DocumentOpenThreads,
  ]);

  useEffect(() => {
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

              setNewCQ2DocumentOpenThreads(
                getNewCQ2DocumentOpenThreads(
                  highlight.to_thread_id,
                  CQ2Document,
                ),
              );
              setNewCQ2DocumentCurrentHighlights(
                getNewCQ2DocumentCurrentHighlights(
                  highlight,
                  CQ2DocumentCurrentHighlights,
                ),
              );

              setShowThreadInfoBox(false);
            });

            highlightSpan.addEventListener("mouseover", function (e) {
              e.preventDefault();
              e.stopPropagation();

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
                  513;

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

              setShowThreadInfoBox(false);
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

                setNewCQ2DocumentOpenThreads(
                  getNewCQ2DocumentOpenThreads(
                    highlight.to_thread_id,
                    CQ2Document,
                  ),
                );
                setNewCQ2DocumentCurrentHighlights(
                  getNewCQ2DocumentCurrentHighlights(
                    highlight,
                    CQ2DocumentCurrentHighlights,
                  ),
                );

                setShowThreadInfoBox(false);
              });

              highlightSpan.removeEventListener("mouseover", function (e) {
                e.preventDefault();
                e.stopPropagation();

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
                    513;

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

                setShowThreadInfoBox(false);
              });
            });
        }
      }
    };
  }, [
    CQ2Document,
    setNewCQ2DocumentCurrentHighlights,
    setNewCQ2DocumentOpenThreads,
  ]);

  return (
    <div
      className={`relative flex h-full w-[calc((100vw)/2)] flex-col border-r border-[#EDEDED] bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.5rem]`}
    >
      <div id="document-main-thread" className="h-full overflow-y-scroll pb-5">
        <div
          className={`sticky top-0 z-40 flex flex-row justify-between border-b border-[#EDEDED] bg-[#FFFFFF] px-5 py-2 text-sm`}
        >
          <div className={`flex items-center font-normal text-neutral-400`}>
            <span className="rounded-lg bg-neutral-100 px-2 py-0 font-medium text-neutral-700">
              Version 1
            </span>
            <span className="mx-2">·</span>
            {CQ2Document.user_name}
            <span className="mx-2">·</span>
            {dayjs(CQ2Document.version1.created_on).format("MMM DD, YYYY")}
          </div>
          <div className={`items-cente flex text-neutral-400`}>
            <span className="mr-1 text-neutral-600">
              {CQ2Document.version1.highlights.length}
            </span>
            {"document "}
            {CQ2Document.version1.highlights.length === 1
              ? "comment"
              : "comments"}
            <span className="mx-2">·</span>
            <span className="mr-1 text-neutral-600">
              {CQ2Document.version1.comments.length}
            </span>
            {" general "}
            {CQ2Document.version1.comments.length === 1
              ? "comment"
              : "comments"}
          </div>
        </div>
        <h1 className="w-full appearance-none border-none px-5 pt-5 text-4xl font-semibold leading-tight text-[#37362f]">
          {CQ2Document.version1.title}
        </h1>
        <div
          onClick={(e) => showNewThreadPopup(e, -1)}
          className="relative p-5"
        >
          <ContentWithHighlight
            containerId="document-content-container"
            content={CQ2Document.version1.content}
            highlights={CQ2Document.version1.highlights}
          />
          {isNewThreadPopupInCQ2DocumentOpen && (
            <Button
              onClick={(e) => handleCommentInNewThread()}
              className="new-thread-popup-btn absolute z-50 rounded-lg border-4 border-[#FFFFFF] bg-[#FFFFFF] p-2 font-normal text-neutral-800 outline outline-1 outline-neutral-200 transition duration-200 hover:bg-neutral-100"
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
        <div className="px-5">
          {CQ2Document.version1.comments.length > 0 && (
            <>
              <Separator className="mb-12 mt-8" />
              <div className="mb-6 flex items-center text-sm font-medium text-neutral-700">
                <MessageCircle className="mr-2 h-3.5 w-3.5" strokeWidth={2.5} />
                General comments
              </div>
            </>
          )}
          {CQ2Document.version1.comments.map((comment, idx) => (
            <div
              key={comment.comment_id}
              className={`${
                comment.comment_id ===
                  CQ2Document.version1.comments.length - 1 && wasNewCommentAdded
                  ? "new-comment"
                  : ""
              } group relative mt-5 w-full rounded-lg border ${
                comment.is_conclusion
                  ? "border-green-500 bg-green-500/5"
                  : "border-[#EDEDED]"
              } p-5`}
              id={`0-${comment.comment_id}`}
              onClick={(e) => {
                if (!comment.for_new_thread_created)
                  showNewThreadPopup(e, comment.comment_id, idx);
              }}
            >
              <div
                className={`mb-3 flex h-6 flex-row justify-between text-sm font-semibold text-neutral-700`}
              >
                <div id="comment-name-created-on">
                  {comment.user_name}
                  <span className="ml-3 text-xs font-normal text-neutral-400">
                    {dayjs(comment.created_on).format("DD/MM/YY hh:mm A")}
                  </span>
                </div>
              </div>
              {!comment.for_new_thread_created ? (
                <div>
                  <ContentWithHighlight
                    containerId={`0-${comment.comment_id}-text-container`}
                    content={comment.content}
                    highlights={comment.highlights}
                  />
                </div>
              ) : (
                <div>
                  <span className="text-neutral-500">
                    Created a new thread for:
                  </span>{" "}
                  <span
                    className="cursor-pointer font-medium text-neutral-700 underline"
                    onClick={() => {
                      const forNewThreadCreatedParentComment =
                        document.getElementById(
                          `0-${comment.for_new_thread_created_parent_comment_id}`,
                        );
                      const topPos = forNewThreadCreatedParentComment.offsetTop;
                      document.getElementById("document-main-thread").scrollTo({
                        top: topPos - 55,
                        behavior: "smooth",
                      });
                    }}
                  >
                    {comment.for_new_thread_created_quote}
                  </span>
                </div>
              )}
              {isNewThreadPopupInCommentOpen[comment.comment_id] &&
                !comment.for_new_thread_created && (
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
      </div>
      {showUnreadIndicator &&
        CQ2DocumentUnreadComments[0] > 0 &&
        !showLatestVersionEditor &&
        !showOldVersion &&
        !pathname.includes("/app/demo") && (
          <div
            className={`absolute bottom-24 left-1/2 z-40 w-fit -translate-x-1/2 rounded-lg border border-[#EDEDED] bg-white px-3 py-1 text-xs font-normal text-neutral-400 shadow-md`}
          >
            Unread comments
            <span className="beacon" />
          </div>
        )}
      {!showLatestVersionEditor && !showOldVersion && (
        <div className={`relative m-5 w-auto rounded-lg bg-[#f7f7f5]`}>
          {editor && <CQ2BubbleMenu editor={editor} />}
          <EditorContent
            editor={editor}
            className="CQ2Document-editor min-h-[2.5rem] pl-1 pr-[2.5rem] text-neutral-700"
          />
          <Button
            className={`${
              editor?.getHTML() !== "<p></p>"
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
      <Dialog open={showUserNameDialog} onOpenChange={setShowUserNameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>What&#39;s your name?</DialogTitle>
          </DialogHeader>
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                placeholder="Your name"
                className="mt-2 w-full rounded-lg border border-neutral-400 bg-[#FFFFFF] py-2 pl-4 text-base text-neutral-700 placeholder:text-[#adb5bd] focus:outline-none"
                type="text"
                onChange={handleUserNameChange}
                onKeyDown={(e) =>
                  e.keyCode === 13 ? handleCommentInThread() : null
                }
              />
              <Button
                className="absolute bottom-[0.3rem] right-[0.3rem] h-8 w-8 rounded-lg bg-neutral-800 p-[0.5rem] font-normal text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-700"
                onClick={() => handleCommentInThread()}
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

export default MainThread;
