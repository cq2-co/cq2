"use client";

import CQ2BubbleMenu from "@/components/editor/cq2-bubble-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useCQ2DocumentCurrentHighlightsStore,
  useCQ2DocumentOpenThreadsStore,
  useCQ2DocumentStore,
  useShowLatestVersionEditorStore,
} from "@/state";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, mergeAttributes, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const LatestVersionEditor = () => {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const { showLatestVersionEditor, setShowLatestVersionEditor } =
    useShowLatestVersionEditorStore();
  const { CQ2DocumentOpenThreads, setNewCQ2DocumentOpenThreads } =
    useCQ2DocumentOpenThreadsStore();
  const { setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();

  const pathname = usePathname();

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
            class: cn("bg-[#F9F9F9] text-neutral-700 p-4 rounded-xl text-sm"),
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
      Underline,
    ],
    content: CQ2Document.version1.content,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
    autofocus: true,
  });

  const handleSubmit = () => {
    const newVersionContentHTML = editor.getHTML();

    const CQ2DocumentTitle =
      document.getElementById("cq2-document-title")?.innerText;

    const newCQ2Document = {
      ...CQ2Document,
      version1: {
        ...CQ2Document.version1,
        is_concluded: true,
      },
      version2: {
        created_on: Date.now(),
        thread_id: 0,
        title: CQ2DocumentTitle,
        content: newVersionContentHTML,
        is_concluded: false,
      },
    };

    updateCQ2Document(newCQ2Document);
    setNewCQ2Document(newCQ2Document);

    setShowLatestVersionEditor(false);
    setNewCQ2DocumentOpenThreads([]);
    setNewCQ2DocumentCurrentHighlights([]);
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

  return (
    <div className="relative flex h-full w-[calc((100vw)/2)] flex-col rounded-none border-r border-[#EDEDED] bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.5rem]">
      <div className="h-full overflow-y-scroll">
        <div className="sticky top-0 z-40 flex flex-row justify-between border-b border-[#EDEDED] bg-[#FFFFFF] px-5 py-2 text-sm">
          <div className="flex flex-row items-center justify-center text-neutral-400">
            <span className="rounded-lg bg-blue-50 px-2 py-0 font-medium text-blue-600">
              Version 2
            </span>
            <span className="mx-2">·</span>
            Draft
          </div>
          <Button
            className={`mr-0 h-5 rounded-lg bg-neutral-800 px-2 py-0 font-medium text-neutral-50 shadow-none duration-100 hover:bg-neutral-600`}
            onClick={handleSubmit}
          >
            Publish
          </Button>
        </div>
        <div className="relative">
          <h1
            contentEditable="plaintext-only"
            className="cq2-title-h1 w-full appearance-none border-none px-5 pt-5 text-4xl font-semibold leading-tight text-[#37362f] focus:outline-none"
            placeHolder="Title"
            id="cq2-document-title"
          >
            {CQ2Document.version1.title}
          </h1>
          {editor && <CQ2BubbleMenu editor={editor} />}
          <EditorContent
            editor={editor}
            className="latest-version-CQ2Document-editor min-h-[24rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default LatestVersionEditor;
