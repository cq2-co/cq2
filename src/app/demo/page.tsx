"use client";

import { useTopNavTitleStore, useLeftNavCurrentlyOpenedStore } from "@/state";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { satoshi } from "@/app/fonts";
import Link from "next/link";

export default function Posts() {
  const { topNavTitle, setTopNavTitle } = useTopNavTitleStore();

  useEffect(() => {
    setTopNavTitle("Inbox");
  }, [setTopNavTitle]);

  const { leftNavCurrentlyOpened, setLeftNavCurrentlyOpened } =
    useLeftNavCurrentlyOpenedStore();

  const pathname = usePathname();

  useEffect(() => {
    setLeftNavCurrentlyOpened(pathname);
  }, [setLeftNavCurrentlyOpened, pathname]);

  return (
    <div className="ml-56 hidden h-[calc(100vh-3.25rem)] w-[calc(100vw-14rem)] justify-center overflow-y-scroll scroll-smooth rounded-none border-0 bg-[#FFFFFF] pt-28 md:flex">
      <div className="h-fit w-[48rem] px-5 pb-24">
        <div
          className={`${satoshi.className} text-4xl font-bold leading-[2.5rem] text-neutral-700`}
        >
          Inbox
        </div>
        <div
          className={`mb-12 mt-3 flex items-center text-lg font-normal text-neutral-400`}
        >
          You've no unread replies, mentions or posts.
        </div>
      </div>
    </div>
  );
}
