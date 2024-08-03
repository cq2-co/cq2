"use client";

import CQ2BubbleMenu from "@/components/editor/cq2-bubble-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mergeAttributes } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NewCQ2Document = () => {
  const router = useRouter();

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
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
    autofocus: true,
  });

  const [userName, setUserName] = useState("");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

    setUserName(value);
  };

  const [loading, setLoading] = useState(true);

  const [cq2UserName, setCq2UserName] = useState("");

  const [submitInProcess, setSubmitInProcess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cq2UserName")) {
        setCq2UserName(localStorage.getItem("cq2UserName"));
      }
    }
    setLoading(false);
  }, [setCq2UserName]);

  const handleSubmit = () => {
    const descriptionHTML = editor.getHTML();

    const CQ2DocumentTitle =
      document.getElementById("cq2-document-title")?.innerText;

    if (!CQ2DocumentTitle) {
      toast.info("Please write a title for the document.");
      return;
    }

    if (
      !descriptionHTML ||
      descriptionHTML === '<p class="mt-[1em] first:mt-0"></p>'
    ) {
      toast.info("Please write the content for the document.");
      return;
    }

    if (!cq2UserName && !userName) {
      toast.info("Please enter your name.");
      return;
    }

    setSubmitInProcess(true);

    let processedComment = document.createElement("div");
    processedComment.innerHTML = descriptionHTML;
    processedComment
      .querySelectorAll("p, h1, h2, h3, code")
      .forEach((_element) => {
        _element.prepend("‎");
      });

    createNewCQ2Document({
      user_name: cq2UserName || userName,
      version1: {
        created_on: Date.now(),
        thread_id: 0,
        title: CQ2DocumentTitle,
        content: processedComment.innerHTML,
        is_resolved: false,
      },
    });

    if (!cq2UserName) {
      localStorage.setItem("cq2UserName", userName);
    }
  };

  const createNewCQ2Document = async (initCQ2Document) => {
    try {
      const res = await fetch("/api/document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initCQ2Document),
      });

      if (!res.ok) {
        toast.error("Please try again later.");
        return;
      }

      const data = await res.json();

      if (typeof window !== "undefined") {
        const cq2CreatedCQ2Documents = localStorage.getItem(
          "cq2CreatedCQ2Documents",
        );

        if (!cq2CreatedCQ2Documents) {
          const initCq2CreatedCQ2Documents = {
            CQ2Documents: [
              {
                _id: data._id,
                title: data.version1.title,
                user_name: data.user_name,
                created_on: data.version1.created_on,
              },
            ],
          };

          localStorage.setItem(
            "cq2CreatedCQ2Documents",
            JSON.stringify(initCq2CreatedCQ2Documents),
          );
        } else {
          let cq2CreatedCQ2DocumentsJSON = JSON.parse(cq2CreatedCQ2Documents);

          cq2CreatedCQ2DocumentsJSON.CQ2Documents.push({
            _id: data._id,
            title: data.version1.title,
            user_name: data.user_name,
            created_on: data.version1.created_on,
          });

          localStorage.setItem(
            "cq2CreatedCQ2Documents",
            JSON.stringify(cq2CreatedCQ2DocumentsJSON),
          );
        }
      }

      router.push(`/app/document/${data._id}/v1`);
    } catch (error) {
      toast.error("Please try again later.");
    }
  };

  const [isBrowserFirefox, setIsBrowserFirefox] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.indexOf("Firefox") > -1) setIsBrowserFirefox(true);
  }, []);

  return (
    <div className="flex h-[calc(100vh-3rem)] w-screen flex-col items-center overflow-y-auto scroll-smooth py-32">
      <div className="h-fit w-[48rem] px-5">
        {isBrowserFirefox ? (
          <h1
            contentEditable
            className="cq2-title-h1 w-full cursor-text appearance-none border-none text-4xl font-semibold leading-tight text-[#37362f] focus:outline-none"
            placeHolder="Title"
            id="cq2-document-title"
          />
        ) : (
          <h1
            contentEditable="plaintext-only"
            className="cq2-title-h1 w-full cursor-text appearance-none border-none text-4xl font-semibold leading-tight text-[#37362f] focus:outline-none"
            placeHolder="Title"
            id="cq2-document-title"
          />
        )}
        {editor && <CQ2BubbleMenu editor={editor} />}
        <EditorContent
          editor={editor}
          className="new-CQ2Document-editor mt-10 min-h-[24rem]"
        />
        {!loading && !cq2UserName && (
          <input
            placeholder="Your name"
            className="mt-10 w-full appearance-none border-none text-base font-normal text-gray-400 placeholder:text-gray-300 focus:outline-none"
            type="text"
            onChange={handleNameChange}
          />
        )}
        <Button
          className="mt-16 h-8 rounded-sm p-3"
          onClick={() => handleSubmit()}
          disabled={submitInProcess}
        >
          {submitInProcess && (
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <LoaderCircle
                className="h-5 w-5 text-[#91918e]"
                strokeWidth={2}
              />
            </svg>
          )}
          {submitInProcess ? "Publishing" : "Publish"}
        </Button>
      </div>
    </div>
  );
};

export default NewCQ2Document;
