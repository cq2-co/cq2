"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
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
            class: cn("bg-neutral-100 text-neutral-700 p-4 rounded-xl text-sm"),
          },
        },
        code: {
          HTMLAttributes: {
            class: cn("bg-neutral-100 text-neutral-700 p-0.5"),
          },
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: cn("text-[#797874] underline"),
        },
      }),
      Placeholder.configure({
        placeholder:
          "Set the context, provide info, your thoughts, questions, etc., for the CQ2Document...",
      }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  const [CQ2DocumentTitle, setCQ2DocumentTitle] = useState("");
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

    setCQ2DocumentTitle(value);
  };

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
      title: CQ2DocumentTitle,
      content: descriptionHTML,
      read_only: 0,
      thread_id: 0,
      created_on: Date.now(),
      user_name: cq2UserName || userName,
    });

    if (!cq2UserName) {
      localStorage.setItem("cq2UserName", userName);
    }
  };

  const createNewCQ2Document = async (CQ2DocumentTitleAndContent) => {
    try {
      const res = await fetch("/api/document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(CQ2DocumentTitleAndContent),
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
                title: data.title,
                user_name: data.user_name,
                created_on: data.created_on,
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
            title: data.title,
            user_name: data.user_name,
            created_on: data.created_on,
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
    <div className="flex h-[calc(100vh-2.5rem)] w-screen flex-col items-center overflow-y-auto scroll-smooth pt-28">
      <div className="h-fit w-[48rem] px-5 pb-24">
        <input
          placeholder="Title"
          className="w-full appearance-none border-none text-4xl font-bold leading-tight text-[#37362f] placeholder:text-gray-300 focus:outline-none"
          type="text"
          autoFocus={true}
          onChange={handleTitleChange}
        />
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
        <Button className="mt-16 h-8 rounded-2xl p-3" onClick={handleSubmit}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default NewCQ2Document;
