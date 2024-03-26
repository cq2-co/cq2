"use client";

import Link from "next/link";
import { ChevronRight, Link as LucideLink } from "lucide-react";
import { Button } from "./ui/button";
import { useDiscussionStore } from "@/state";
import { satoshi } from "@/app/fonts";
import { usePathname } from "next/navigation";
import LogoSVG from "@/components/logo-svg";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const TopNav = () => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const pathname = usePathname();

  return (
    <div
      className={`${satoshi.className} z-50 flex h-[2.5rem] w-screen items-center justify-between border-b border-neutral-200 bg-[#FFFFFF] text-sm`}
    >
      <div className="flex h-full w-[5rem] items-center justify-center border-r border-neutral-200">
        <Link
          href="/"
          className="m-2 flex w-fit items-center"
          id="cq2-main-logo"
        >
          <LogoSVG className="h-5" />
        </Link>
      </div>
      <div className="z-50 hidden w-[calc(100vw)] items-center justify-between pl-[0.9rem] pr-2 md:flex">
        <div className="flex flex-row items-center font-medium">
          <Link
            href="/discussions"
            className="text-neutral-500 hover:underline"
          >
            Discussions
          </Link>
          {pathname.includes("/discussions/") && (
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
          {pathname.includes("/demo") && (
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
          {pathname === "/new" && (
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
          {pathname !== "/new" && pathname.includes("/discussions/") && (
            <Button
              className="flex h-6 items-center rounded-lg p-1.5 text-xs font-medium text-neutral-600 shadow-none transition duration-100 hover:bg-neutral-50"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${NEXT_PUBLIC_BASE_URL}/discussions/${discussion._id}`,
                );
                toast("Copied link to clipboard");
              }}
            >
              <LucideLink className="mr-1 h-3 w-3" strokeWidth={3} />
              Copy link
            </Button>
          )}
          {(pathname === "/" || pathname === "/privacy") && (
            <div className="font-medium">
              <Link href="/demo" className="text-neutral-500 hover:underline">
                Demo
              </Link>
              <Link
                href="https://github.com/cq2-co/cq2"
                className="ml-6 text-neutral-500 hover:underline"
              >
                GitHub
              </Link>
              <Link
                href="mailto:anand@cq2.co"
                className="ml-6 text-neutral-500 hover:underline"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="ml-6 mr-3 text-neutral-500 hover:underline"
              >
                Privacy
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="z-50 flex items-center justify-between pl-[0.9rem] pr-2 md:hidden">
        <div>
          {pathname === "/" && (
            <div className="font-medium">
              <Link
                href="https://github.com/cq2-co/cq2"
                className="ml-6 mr-3 text-neutral-500 hover:underline"
              >
                GitHub
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
