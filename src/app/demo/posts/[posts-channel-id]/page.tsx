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
    setTopNavTitle("AI Posts");
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
          AI Posts
        </div>
        <div
          className={`mb-12 mt-3 flex items-center text-lg font-normal text-neutral-400`}
        >
          Where we discuss topics around AI
        </div>
        <div className={`mb-12 mt-3 flex items-center`}>
          <Link
            href="/demo/posts/ai-posts/13242"
            className={`${satoshi.className} w-full rounded-sm bg-neutral-50 p-5 text-lg font-medium text-neutral-600 transition duration-200 hover:bg-neutral-100`}
          >
            Generative AI for our filmmaking?
            <div
              className={`${satoshi.className} mt-3 flex items-center text-sm font-normal text-neutral-400`}
            >
              <Avatar className="mr-2 inline-flex h-6 w-6 border border-white text-[0.6rem]">
                <AvatarImage src={`/avatars/caleb.png`} />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <div className="font-semibold text-neutral-600">
                Caleb
                <span className="ml-3 text-xs font-normal text-neutral-400">
                  {dayjs(1708620881590).format("DD/MM/YY")}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
