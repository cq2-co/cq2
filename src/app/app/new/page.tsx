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
      Placeholder.configure({
        placeholder: "Write something...",
      }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  const [userName, setUserName] = useState("");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

    setUserName(value);
  };

  const [loading, setLoading] = useState(true);

  const [cq2UserName, setCq2UserName] = useState("");

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
      toast.error("Please write a title for the document.");
      return;
    }

    if (!descriptionHTML || descriptionHTML === "<p></p>") {
      toast.error("Please write a description for the document.");
      return;
    }

    if (!cq2UserName && !userName) {
      toast.error("Please enter your name.");
      return;
    }

    createNewCQ2Document({
      read_only: 0,
      user_name: cq2UserName || userName,
      version1: {
        created_on: Date.now(),
        thread_id: 0,
        title: CQ2DocumentTitle,
        content: descriptionHTML,
        is_concluded: false,
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

      router.push(`/app/document/${data._id}`);
    } catch (error) {
      toast.error("Please try again later.");
    }
  };

  return (
    <div className="flex h-[calc(100vh-2.5rem)] w-screen flex-col items-center overflow-y-auto scroll-smooth py-32">
      <div className="h-fit w-[48rem] px-5">
        <h1
          contentEditable="plaintext-only"
          className="cq2-title-h1 w-full appearance-none border-none text-4xl font-semibold leading-tight text-[#37362f] focus:outline-none"
          placeHolder="Title"
          autoFocus={true}
          id="cq2-document-title"
        />
        {editor && <CQ2BubbleMenu editor={editor} />}
        <EditorContent
          editor={editor}
          className="new-CQ2Document-editor mt-10 min-h-[24rem]"
        />
        {!loading && !cq2UserName && (
          <input
            placeholder="Your name"
            className="mt-10 w-full appearance-none border-none text-base font-medium text-gray-400 placeholder:text-gray-300 focus:outline-none"
            type="text"
            onChange={handleNameChange}
          />
        )}
        <Button className="mt-16 h-8 rounded-xl p-3" onClick={handleSubmit}>
          Publish
        </Button>
      </div>
    </div>
  );
};

export default NewCQ2Document;
