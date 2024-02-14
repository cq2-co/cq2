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
        placeholder: "Start typing...",
      }),
    ],
    autofocus: true,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  return (
    <div className="w-2/5">
      <input
        placeholder="Title"
        className="mb-4 w-full appearance-none border-none text-4xl font-bold leading-tight text-gray-700 placeholder:text-gray-300 focus:outline-none"
        type="text"
      />
      <EditorContent editor={editor} className="min-h-[32rem]" />
      <Button className="mb-24 mt-16">Start</Button>
    </div>
  );
};

export default NewDiscussion;
