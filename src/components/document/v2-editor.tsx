"use client";

import { manrope } from "@/app/fonts";
import CQ2BubbleMenu from "@/components/editor/cq2-bubble-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCQ2DocumentStore, useShowOldVersionStore } from "@/state";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, mergeAttributes, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import dayjs from "dayjs";
import { Check, LoaderCircle, X } from "lucide-react";
import { Link as NVTLink } from "next-view-transitions";
import { useState } from "react";
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

  const [submitInProcess, setSubmitInProcess] = useState(false);

  const handleSubmit = () => {
    setSubmitInProcess(true);

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
        is_resolved: true,
      },
      version2: {
        created_on: Date.now(),
        thread_id: 0,
        title: CQ2DocumentTitle,
        content: processedComment.innerHTML,
        is_resolved: false,
      },
    };

    updateCQ2Document(newCQ2Document);
    setNewCQ2Document(newCQ2Document);
  };

  const updateCQ2Document = async (_CQ2Document) => {
    if (_CQ2Document._id === "demo") {
      const sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
      };

      await sleep(1500);
      document.getElementById("psuedo-publish-nvtlink")?.click();
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

      document.getElementById("psuedo-publish-nvtlink")?.click();
    } catch (error) {
      toast.error("Please try again later.");
    }
  };

  return (
    <div
      className={`flex flex-col items-center overflow-y-scroll bg-[#FFFFFF] shadow-none ${
        !showOldVersion
          ? "h-full w-screen pt-32"
          : "mr-0 h-[calc(100vh-4rem)] w-[calc(((100vw)/2)-0.5rem)] pt-8 2xl:w-[45.5rem]"
      }
      `}
      data-is-full={!showOldVersion ? "true" : "false"}
    >
      <div className={!showOldVersion ? "w-[44rem]" : "w-full"}>
        <h5
          className={`${manrope.className} mx-4 mb-5 w-fit rounded-sm bg-blue-50 px-1 py-0 text-xs font-medium tracking-wider text-blue-600`}
        >
          FINAL
        </h5>
        <h1
          contentEditable="plaintext-only"
          className="cq2-title-h1 w-full appearance-none border-none px-4 text-4xl font-semibold leading-tight text-[#37362f] focus:outline-none"
          placeHolder="Title"
          id="cq2-document-title"
        >
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
        <div className="relative pb-16 pt-12">
          {editor && <CQ2BubbleMenu editor={editor} />}
          <EditorContent
            editor={editor}
            className="latest-version-CQ2Document-editor min-h-[24rem]"
          />
        </div>
        <div className="mx-5 mb-16 flex flex-row">
          <div>
            <NVTLink
              id="psuedo-publish-nvtlink"
              href={`/app/document/${CQ2Document._id}/v2`}
            />
            <Button
              id="v2-publish-btn"
              className={`h-7 rounded-sm bg-neutral-800 p-2.5 text-neutral-50 shadow-none transition duration-200 hover:bg-neutral-600`}
              onClick={() => {
                handleSubmit();
              }}
              disabled={submitInProcess}
            >
              {submitInProcess ? (
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <LoaderCircle
                    className="mr-2 h-4 w-4 text-neutral-400 transition duration-200"
                    strokeWidth={3}
                  />
                </svg>
              ) : (
                <Check
                  className="mr-2 h-4 w-4 text-neutral-400 transition duration-200"
                  strokeWidth={3}
                />
              )}
              {submitInProcess ? "Publishing" : "Publish"}
            </Button>
          </div>
          <div className="ml-2">
            <NVTLink href={`/app/document/${CQ2Document._id}/v1`}>
              <Button
                className={`h-7 rounded-sm bg-transparent p-2.5 text-neutral-500 shadow-none transition duration-200 hover:bg-neutral-100`}
              >
                <X
                  className="mr-2 h-4 w-4 text-neutral-400 transition duration-200"
                  strokeWidth={3}
                />
                Cancel
              </Button>
            </NVTLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V2Editor;
