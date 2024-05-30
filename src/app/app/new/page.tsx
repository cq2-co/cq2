"use client";

import { Button } from "@/components/ui/button";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NewDiscussion = () => {
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          "Set the context, provide info, your thoughts, questions, etc., for the discussion...",
      }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  const [discussionTitle, setDiscussionTitle] = useState("");
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

    setDiscussionTitle(value);
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

    if (!discussionTitle) {
      toast.error("Please write a title for the discussion.");
      return;
    }

    if (!descriptionHTML || descriptionHTML === "<p></p>") {
      toast.error("Please write a description for the discussion.");
      return;
    }

    if (!cq2UserName && !userName) {
      toast.error("Please enter your name.");
      return;
    }

    createNewDiscussion({
      title: discussionTitle,
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

  const createNewDiscussion = async (discussionTitleAndContent) => {
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discussionTitleAndContent),
      });

      if (!res.ok) {
        toast.error("Please try again later.");
        return;
      }

      const data = await res.json();

      if (typeof window !== "undefined") {
        const cq2CreatedDiscussions = localStorage.getItem(
          "cq2CreatedDiscussions",
        );

        if (!cq2CreatedDiscussions) {
          const initCq2CreatedDiscussions = {
            discussions: [
              {
                _id: data._id,
                title: data.title,
                user_name: data.user_name,
                created_on: data.created_on,
              },
            ],
          };

          localStorage.setItem(
            "cq2CreatedDiscussions",
            JSON.stringify(initCq2CreatedDiscussions),
          );
        } else {
          let cq2CreatedDiscussionsJSON = JSON.parse(cq2CreatedDiscussions);

          cq2CreatedDiscussionsJSON.discussions.push({
            _id: data._id,
            title: data.title,
            user_name: data.user_name,
            created_on: data.created_on,
          });

          localStorage.setItem(
            "cq2CreatedDiscussions",
            JSON.stringify(cq2CreatedDiscussionsJSON),
          );
        }
      }

      router.push(`/app/discussions/${data._id}`);
    } catch (error) {
      toast.error("Please try again later.");
    }
  };

  return (
    <div className="flex h-[calc(100vh-2.5rem)] w-screen flex-col items-center overflow-y-auto scroll-smooth pt-28">
      <div className="h-fit w-[48rem] px-5 pb-24">
        <input
          placeholder="Title"
          className="w-full appearance-none border-none text-4xl font-bold leading-tight text-gray-700 placeholder:text-gray-300 focus:outline-none"
          type="text"
          autoFocus={true}
          onChange={handleTitleChange}
        />
        <EditorContent
          editor={editor}
          className="new-discussion-editor mt-10 min-h-[24rem]"
        />
        {!loading && !cq2UserName && (
          <input
            placeholder="Your name"
            className="mt-10 w-full appearance-none border-none text-base font-medium text-gray-400 placeholder:text-gray-300 focus:outline-none"
            type="text"
            onChange={handleNameChange}
          />
        )}
        <Button className="mt-10 h-8 rounded-2xl p-3" onClick={handleSubmit}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default NewDiscussion;
