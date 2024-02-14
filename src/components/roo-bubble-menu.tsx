"use client";

import { type Editor, BubbleMenu } from "@tiptap/react";
import { Bold, Italic } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

type Props = {
  editor: Editor | null;
};

const RooBubbleMenu = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="mt-12">
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <Toggle
          size="md"
          aria-label="Toggle bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          pressed={editor.isActive("bold")}
          className="h-6 w-6 hover:bg-gray-200 hover:text-black data-[state=on]:bg-gray-200"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="md"
          aria-label="Toggle italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          pressed={editor.isActive("italic")}
          className="ml-1 h-6 w-6 hover:bg-gray-200 hover:text-black data-[state=on]:bg-gray-200"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
      </BubbleMenu>
    </div>
  );
};

export default RooBubbleMenu;
