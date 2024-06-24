import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { BubbleMenu } from "@tiptap/react";
import {
  Bold,
  Check,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useCallback, useState } from "react";

const CQ2BubbleMenu = ({ editor }) => {
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const [link, setLink] = useState("");

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

    setLink(value);
  };

  const setLinkFromPopover = useCallback(() => {
    if (link === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: link })
      .run();
  }, [editor, link]);

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center justify-center rounded-lg border border-neutral-200 bg-white p-0.5 shadow-xl"
    >
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${
          editor.isActive("bold")
            ? "text-cq2Orange-600 hover:text-cq2Orange-600"
            : "text-neutral-700 hover:text-neutral-700"
        } h-7 w-7 rounded-md p-1.5`}
        variant="ghost"
      >
        <Bold className="h-4 w-4" strokeWidth={2.5} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${
          editor.isActive("italic")
            ? "text-cq2Orange-600 hover:text-cq2Orange-600"
            : "text-neutral-700 hover:text-neutral-700"
        } h-7 w-7 rounded-md p-1.5`}
        variant="ghost"
      >
        <Italic className="h-4 w-4" strokeWidth={2.5} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${
          editor.isActive("underline")
            ? "text-cq2Orange-600 hover:text-cq2Orange-600"
            : "text-neutral-700 hover:text-neutral-700"
        } h-7 w-7 rounded-md p-1.5`}
        variant="ghost"
      >
        <Underline className="h-4 w-4" strokeWidth={2.5} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${
          editor.isActive("strike")
            ? "text-cq2Orange-600 hover:text-cq2Orange-600"
            : "text-neutral-700 hover:text-neutral-700"
        } h-7 w-7 rounded-md p-1.5`}
        variant="ghost"
      >
        <Strikethrough className="h-4 w-4" strokeWidth={2.5} />
      </Button>
      <Separator className="mx-1 h-4 bg-neutral-200" orientation="vertical" />
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${
          editor.isActive("heading", { level: 1 })
            ? "text-cq2Orange-600 hover:text-cq2Orange-600"
            : "text-neutral-700 hover:text-neutral-700"
        } h-7 w-7 rounded-md p-0.5`}
        variant="ghost"
      >
        <Heading1 className="h-[1.6rem] w-[1.6rem]" strokeWidth={1.6} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${
          editor.isActive("heading", { level: 2 })
            ? "text-cq2Orange-600 hover:text-cq2Orange-600"
            : "text-neutral-700 hover:text-neutral-700"
        } h-7 w-7 rounded-md p-0.5`}
        variant="ghost"
      >
        <Heading2 className="h-[1.6rem] w-[1.6rem]" strokeWidth={1.6} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${
          editor.isActive("heading", { level: 3 })
            ? "text-cq2Orange-600 hover:text-cq2Orange-600"
            : "text-neutral-700 hover:text-neutral-700"
        } h-7 w-7 rounded-md p-0.5`}
        variant="ghost"
      >
        <Heading3 className="h-[1.6rem] w-[1.6rem]" strokeWidth={1.6} />
      </Button>
      <Separator className="mx-1 h-4 bg-neutral-200" orientation="vertical" />
      <Popover open={isLinkPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            className={`${
              editor.isActive("link")
                ? "text-cq2Orange-600 hover:text-cq2Orange-600"
                : "text-neutral-700 hover:text-neutral-700"
            } h-7 w-7 rounded-md p-1.5`}
            variant="ghost"
            onClick={() => {
              if (!editor.isActive("link")) {
                setIsLinkPopoverOpen(true);
              } else {
                editor.chain().focus().unsetLink().run();
              }
            }}
          >
            <Link className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="flex h-full w-64 space-x-1 rounded-lg border border-neutral-200 bg-white p-0.5 shadow-xl"
          side="right"
          sideOffset={16}
          onInteractOutside={() => setIsLinkPopoverOpen(false)}
        >
          <Input
            id="width"
            placeholder="Paste link..."
            className="h-7 rounded-md text-neutral-700"
            onChange={handleLinkChange}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                setLinkFromPopover();
                setIsLinkPopoverOpen(false);
              }
            }}
          />
          <Button
            type="submit"
            variant={"ghost"}
            className="h-7 w-7 rounded-md p-1.5"
            onClick={(e) => {
              setLinkFromPopover();
              setIsLinkPopoverOpen(false);
            }}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Button>
        </PopoverContent>
      </Popover>
    </BubbleMenu>
  );
};

export default CQ2BubbleMenu;
