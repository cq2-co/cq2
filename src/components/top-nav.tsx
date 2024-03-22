"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, SquarePen, Link as LucideLink } from "lucide-react";
import { Button } from "./ui/button";
import { useDiscussionStore } from "@/state";
import { satoshi } from "@/app/fonts";
import { usePathname } from "next/navigation";
import LogoSVG from "@/components/logo-svg";

const TopNav = () => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const pathname = usePathname();

  return (
    <div className="z-50 flex h-[3.25rem] w-screen items-center justify-between border-b border-neutral-200 bg-[#FFFFFF] text-sm">
      <div className="flex h-full w-[5.5rem] items-center border-r border-neutral-200 px-2">
        <Link
          href="/"
          className="m-2 flex w-fit items-center"
          id="cq2-main-logo"
        >
          <LogoSVG className="ml-2 w-10 md:ml-1" />
        </Link>
      </div>
      <div className="z-50 hidden w-[calc(100vw)] items-center justify-between pl-[0.9rem] pr-2 md:flex">
        <div className="font-medium">
          {pathname.includes("/demo") && (
            <>
              <span className="text-neutral-500">Discussions</span>
              <ChevronRight
                className="mx-2 inline-block h-3 w-3 text-neutral-500"
                strokeWidth={3}
              />
              {}
              <span className="text-neutral-700">
                AGI Ruin: A List of Lethalities
              </span>
            </>
          )}
          {/* <Link
            href="/discussions"
            className="text-neutral-500 hover:underline"
          >
            Discussions
          </Link>
          {pathname.includes("/discussions/") && (
            <>
              <ChevronRight
                className="mx-2 inline-block h-3 w-3 text-neutral-500"
                strokeWidth={3}
              />
              {}
              <span className="text-neutral-700">{discussion.title}</span>
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
                Generative AI for our filmmaking?
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
          )} */}
        </div>
        <div>
          {pathname !== "/new" && pathname.includes("/discussions/") && (
            <Button
              className="flex h-8 w-8 items-center rounded-lg p-2 font-medium shadow-none transition duration-100 hover:bg-neutral-100"
              variant="outline"
            >
              <LucideLink
                className="h-4 w-4 text-neutral-700"
                strokeWidth={3}
              />
            </Button>
          )}
          {pathname === "/" && (
            <div className="font-medium">
              <Link
                href="https://github.com/cq2-co/cq2"
                className="mr-3 text-neutral-500 hover:underline"
              >
                GitHub
              </Link>
              {/* <Link
                href="/privacy"
                className="ml-6 mr-3 text-neutral-500 hover:underline"
              >
                Privacy
              </Link> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
