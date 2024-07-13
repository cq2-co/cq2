"use client";

import CQ2BubbleMenu from "@/components/editor/cq2-bubble-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCQ2DocumentStore, useShowOldVersionStore } from "@/state";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, mergeAttributes, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Check, X } from "lucide-react";
import { Link as NVTLink } from "next-view-transitions";
import { toast } from "sonner";

const V2Editor = () => {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const { showOldVersion, setShowOldVersion } = useShowOldVersionStore();

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
      Underline,
    ],
    content: CQ2Document.version1.content.replace("‎", ""),
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

    let processedComment = document.createElement("div");
    processedComment.innerHTML = newVersionContentHTML;
    processedComment
      .querySelectorAll("p, h1, h2, h3, code")
      .forEach((_element) => {
        _element.prepend("‎");
      });

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
        content: processedComment.innerHTML,
        is_concluded: false,
      },
    };

    updateCQ2Document(newCQ2Document);
    setNewCQ2Document(newCQ2Document);

    setShowOldVersion(false);
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

  return (
    <div className="relative flex h-full w-[calc((100vw)/2)] flex-col rounded-none border-r border-[#EDEDED] bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.4rem]">
      <div className="sticky top-0 z-40 flex flex-row justify-between border-b border-[#EDEDED] bg-[#FFFFFF] px-5 py-2 text-sm">
        <div className="flex flex-row items-center justify-center text-neutral-400">
          <span className="rounded-lg bg-blue-50 px-2 py-0 font-medium text-blue-600">
            Version 2
          </span>
          <span className="mx-2">·</span>
          Draft
        </div>
        <div className="flex flex-row">
          <NVTLink
            className="flex h-5 items-center justify-center rounded-lg border border-white pl-1 pr-2 font-medium text-[#5f5d5b] shadow-none transition duration-200 hover:border-neutral-100 hover:bg-neutral-100"
            href={`/app/document/${CQ2Document._id}/v1`}
          >
            <X className="mr-1 h-4 w-4 text-[#91918e]" strokeWidth={2.5} />
            Cancel
          </NVTLink>
          <div className="ml-2">
            <NVTLink
              id="psuedo-publish-nvtlink"
              href={`/app/document/${CQ2Document._id}/v2`}
            />
            <Button
              id="v2-publish-btn"
              className={`flex h-5 items-center justify-center rounded-lg bg-neutral-800 pl-1 pr-2 font-medium text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-600`}
              onClick={() => {
                document.getElementById("psuedo-publish-nvtlink")?.click();
                handleSubmit();
              }}
            >
              <Check
                className="mr-1 h-4 w-4 text-neutral-400"
                strokeWidth={2.5}
              />
              Publish
            </Button>
          </div>
        </div>
      </div>
      <div className="h-full overflow-y-scroll">
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

export default V2Editor;
