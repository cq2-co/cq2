"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";

const NewDiscussion = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write what you want to discuss about...",
      }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  return (
    <div className="flex h-[calc(100vh-3.25rem)] w-screen flex-col items-center overflow-y-scroll scroll-smooth pt-28">
      <div className="h-fit w-[48rem] px-5 pb-24">
        <input
          placeholder="Title"
          className="mb-4 w-full appearance-none border-none text-4xl font-bold leading-tight text-gray-700 placeholder:text-gray-300 focus:outline-none"
          type="text"
          autoFocus={true}
        />
        <EditorContent
          editor={editor}
          className="new-discussion-editor min-h-[24rem]"
        />
        <Button className="mt-16 h-8 rounded-lg p-3">Start</Button>
      </div>
    </div>
  );
};

export default NewDiscussion;
