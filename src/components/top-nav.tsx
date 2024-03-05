"use client";

import { usePostStore } from "@/state";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TopNav = () => {
  const { post, setNewPost } = usePostStore();

  return (
    <div className="z-50 hidden h-[3.25rem] w-screen items-center justify-between border-b border-neutral-200 bg-[#FFFFFF] text-sm md:flex">
      <div className="hidden h-full w-56 items-center border-r border-neutral-200 bg-[#F7F7F7] px-2 md:flex">
        <Link
          href="#"
          className="flex w-full items-center rounded-sm p-2 font-medium text-neutral-700 hover:bg-neutral-200/80"
        >
          <Image
            src="/dummy-company-logo.png"
            width="0"
            height="0"
            sizes="100vh"
            className="flex h-auto w-5 rounded-sm"
            alt="Dummy company logo"
          />
          <span className="ml-2 flex text-sm">A28 Studios</span>
        </Link>
      </div>
      <div className="z-50 hidden w-[calc(100vw-14rem)] items-center justify-between px-5 md:flex">
        <div className="text-neutral-500">{post.title}</div>
        <div>
          <Avatar className="h-6 w-6 border border-neutral-200 text-[0.6rem]">
            <AvatarImage src={`/avatars/alex.png`} />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
