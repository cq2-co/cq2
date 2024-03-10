"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Inbox, Hash, Files, ChevronDown, MoveLeft } from "lucide-react";
import { satoshi } from "@/app/fonts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLeftNavCurrentlyOpenedStore } from "@/state";

const LeftNav = () => {
  const { leftNavCurrentlyOpened, setLeftNavCurrentlyOpened } =
    useLeftNavCurrentlyOpenedStore();

  return (
    <div className="fixed z-50 mt-[3.25rem] hidden h-[calc(100vh-3.25rem)] w-56 flex-col border-r border-neutral-200 bg-[#F7F7F7] py-2 md:flex">
      <div className="mt-2">
        <Link
          href="/demo"
          className={`${
            leftNavCurrentlyOpened === "/demo"
              ? "bg-neutral-200/80 font-semibold"
              : "font-normal"
          } mx-2 flex items-center rounded-sm px-2 py-1 transition duration-100 hover:bg-neutral-200/80`}
        >
          <Inbox className="h-5 w-5 text-neutral-400" strokeWidth={2} />
          <span className="ml-2 flex text-sm text-neutral-600">Inbox</span>
        </Link>
      </div>
      <div className="mt-7">
        <span className="mb-2 ml-0.5 flex w-full items-center rounded-sm text-xs font-semibold text-neutral-400">
          <ChevronDown className="mr-0.5 h-3 w-3" strokeWidth={2} />
          ARTIFICIAL INTELLIGENCE
        </span>
        <Link
          href="/demo/chat/ai-chat"
          className={`${
            leftNavCurrentlyOpened === "/demo/chat/ai-chat"
              ? "bg-neutral-200/80 font-semibold"
              : "font-normal"
          } mx-2 flex items-center rounded-sm px-2 py-1 transition duration-100 hover:bg-neutral-200/80`}
        >
          <Hash className="h-5 w-5 text-neutral-400" strokeWidth={2} />
          <span className="ml-2 flex text-sm text-neutral-600">ai-chat</span>
        </Link>
        <Link
          href="/demo/posts/ai-posts"
          className={`${
            leftNavCurrentlyOpened === "/demo/posts/ai-posts"
              ? "bg-neutral-200/80 font-semibold"
              : "font-normal"
          } mx-2 mt-1 flex items-center rounded-sm px-2 py-1 transition duration-100 hover:bg-neutral-200/80`}
        >
          <Files className="h-5 w-5 text-neutral-400" strokeWidth={2} />
          <span className="ml-2 flex text-sm text-neutral-600">ai-posts</span>
        </Link>
      </div>
      <div className="mt-auto">
        <span className="mb-2 ml-0.5 flex w-full items-center rounded-sm text-xs font-semibold text-neutral-400">
          <ChevronDown className="mr-0.5 h-3 w-3" strokeWidth={2} />
          DIRECT MESSAGES
        </span>
        <Link
          href="/demo/dm/kyoko"
          className={`${
            leftNavCurrentlyOpened === "/demo/dm/ava"
              ? "bg-neutral-200/80 font-semibold"
              : "font-normal"
          } mx-2 flex items-center rounded-sm px-2 py-1 transition duration-100 hover:bg-neutral-200/80`}
        >
          <Avatar className="h-5 w-5 text-[0.6rem]">
            <AvatarImage src={`/avatars/kyoko.png`} />
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
          <span className="ml-2 flex text-sm text-neutral-600">Kyoko</span>
        </Link>
      </div>
      <div className="mx-2 mb-[1.4rem] mt-auto flex flex-col">
        <div className="mb-5 ml-2 text-[0.7rem] text-neutral-400">
          <span className="block">DEMO PREVIEW</span>
          <span className="block">LIMITED FUNCTIONALITY</span>
        </div>
        <div className="mb-5 ml-2 text-[0.8rem]">
          <Link
            href="/"
            className={`flex w-fit items-center text-neutral-500 transition duration-100 hover:text-neutral-700`}
          >
            <MoveLeft className="mr-1 h-3 w-3" strokeWidth={2} />
            Go back to homepage
          </Link>
        </div>
        <Link href="https://tally.so/r/nGdzAO" className="w-full">
          <Button
            className={`${satoshi.className} ml-2 h-10 w-48 rounded-sm bg-[#FF5F1F] p-3 text-sm font-medium text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90`}
          >
            Get early access
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LeftNav;
