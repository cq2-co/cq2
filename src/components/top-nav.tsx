"use client";

import Link from "next/link";
import { ChevronRight, Link as LucideLink, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useDiscussionStore } from "@/state";
import { satoshi } from "@/app/fonts";
import { usePathname } from "next/navigation";
import LogoSVG from "@/components/logo-svg";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const TopNav = () => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const pathname = usePathname();

  return (
    <div
      className={`${satoshi.className} z-50 hidden h-[2.5rem] w-screen items-center justify-between border-b border-neutral-200 bg-[#FFFFFF] text-sm md:flex`}
    >
      <div className="flex h-full w-[5rem] items-center justify-center border-r border-neutral-200">
        <Link href="/" className="flex w-fit items-center" id="cq2-main-logo">
          <LogoSVG className="h-4" />
        </Link>
      </div>
      <div className="z-50 hidden w-[calc(100vw)] items-center justify-between pl-[0.9rem] pr-2 md:flex">
        <div className="flex flex-row items-center font-medium">
          <Link href="/app" className="text-neutral-500 hover:underline">
            Discussions
          </Link>
          {pathname.includes("/app/discussions/") && (
            <>
              <ChevronRight
                className="mx-2 h-3 w-3 text-neutral-500"
                strokeWidth={3}
              />
              {discussion.title && (
                <span className="text-neutral-700">{discussion.title}</span>
              )}
              {!discussion.title && <Skeleton className="h-4 w-64 pt-4" />}
            </>
          )}
          {pathname === "/app/demo" && (
            <>
              <ChevronRight
                className="mx-2 inline-block h-3 w-3 text-neutral-500"
                strokeWidth={3}
              />
              {}
              <span className="text-neutral-700">
                AGI Ruin: A List of Lethalities (from{" "}
                <a
                  className="underline"
                  target="_blank"
                  href="https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities#sSfjskRzAuDcWmFWg"
                >
                  LessWrong
                </a>
                )
              </span>
            </>
          )}
          {pathname === "/app/new" && (
            <>
              <ChevronRight
                className="mx-2 inline-block h-3 w-3 text-neutral-500"
                strokeWidth={3}
              />
              {}
              <span className="text-neutral-700">New</span>
            </>
          )}
        </div>
        <div>
          <div className="flex flex-row">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="flex h-6 items-center rounded-lg border border-neutral-400 bg-white p-1.5 text-xs font-medium text-neutral-600 shadow-none transition duration-100 hover:bg-neutral-50"
                  variant="outline"
                >
                  <HelpCircle className="mr-1 h-3 w-3" strokeWidth={3} />
                  Help
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[30rem] rounded-xl p-3"
                align="end"
                sideOffset={16}
              >
                <div
                  className={`${satoshi.className} flex w-auto flex-col text-base text-neutral-700`}
                >
                  <div className="rounded-xl bg-neutral-100 p-4">
                    To create a new discussion in CQ2, give a title, a
                    short/long description about the discussion and your name.
                    No login required. Share the link with the participants to
                    invite them.
                  </div>
                  <div className="mt-3 rounded-xl bg-neutral-100 p-4">
                    General messages about the discussion and their replies go
                    in the main/first thread. To reply to a particular quote
                    from the main description or from any message, select the
                    text and click on the popped-up button to create a new,
                    focused thread and reply there. You can reply to the whole
                    message as well, instead of a particular quote inside it, by
                    using the reply button on the top-right of the message.
                  </div>
                  <div className="mt-3 rounded-xl bg-neutral-100 p-4">
                    If someone has already created a thread for a particular
                    quote, the quote would appear highlighted. You can click on
                    it to open its corresponding thread. If someone has already
                    created a thread for a whole message, there would be a
                    highlighted comments button on the top-right of the message.
                    You can click on it to open its corresponding thread.
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {pathname !== "/app/new" &&
              pathname.includes("/app/discussions/") && (
                <Button
                  className="ml-2 flex h-6 items-center rounded-lg border border-neutral-400 bg-white p-1.5 text-xs font-medium text-neutral-600 shadow-none transition duration-100 hover:bg-neutral-50"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${NEXT_PUBLIC_BASE_URL}/app/discussions/${discussion._id}`,
                    );
                    toast("Copied link to clipboard");
                  }}
                >
                  <LucideLink className="mr-1 h-3 w-3" strokeWidth={3} />
                  Copy link
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
