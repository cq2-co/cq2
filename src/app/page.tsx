"use client";

import Link from "next/link";
import LogoSVG from "@/components/logo-svg";
import { Button } from "@/components/ui/button";
import { satoshi, prata } from "./fonts";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import demoScreenshot from "../../public/demo.png";

export default function Home() {
  return (
    <main
      className={`w-screem flex h-[100dvh] justify-center overflow-y-auto scroll-smooth bg-[#FFFFFF] text-base font-normal leading-[1.4rem] text-neutral-800`}
    >
      <div className="flex h-fit min-h-screen w-full flex-col items-center max-md:m-0 max-md:px-6">
        <div
          className={`absolute z-[9999] mt-2 flex w-[calc(100vw-2rem)] flex-row items-center justify-between rounded-sm border border-neutral-100 bg-white/80 p-2 shadow-md backdrop-blur-md md:mt-5 md:w-[42rem]`}
        >
          <div>
            <Link href="#" id="cq2-main-logo">
              <LogoSVG className="ml-2 w-10 md:ml-1" />
            </Link>
          </div>
          <div className="flex flex-row">
            <div className="mr-5">
              <Link href="/demo/posts/ai-posts/example">
                <Button
                  className={`${satoshi.className} h-8 bg-transparent p-0 text-sm font-medium text-neutral-800 shadow-none duration-100 hover:bg-transparent hover:text-neutral-500 md:h-8 md:text-base`}
                >
                  Try demo
                </Button>
              </Link>
            </div>
            <div>
              <Link href="https://tally.so/r/nGdzAO">
                <Button
                  className={`${satoshi.className} h-8 rounded-sm bg-[#FF5F1F] p-3 text-sm font-medium text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90 md:h-8 md:p-3 md:text-base`}
                >
                  Get early access
                  <ArrowRight
                    className="ml-2 mt-0.5 h-5 w-5"
                    strokeWidth={1.8}
                  />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p
            className={`${prata.className} home-title mt-48 w-[calc(100vw-2rem)] text-center text-[2.8rem] font-bold md:mt-72 md:w-full md:text-7xl`}
          >
            <span className="hidden md:block">
              <span className="block leading-[3.5rem] text-neutral-900 md:leading-[6rem]">
                Thoughtful &
              </span>
              <span className="block leading-[3.5rem] text-neutral-900 md:leading-[5rem]">
                coherent communication
              </span>
            </span>
            <span className="block md:hidden">
              <span className="block leading-[3.5rem] text-neutral-900 md:leading-[6rem]">
                Thoughtful
              </span>
              <span className="block leading-[3.5rem] text-neutral-900 md:leading-[6rem]">
                &
              </span>
              <span className="block leading-[3.5rem] text-neutral-900 md:leading-[6rem]">
                coherent
              </span>
              <span className="block leading-[3.5rem] text-neutral-900 md:leading-[6rem]">
                communication
              </span>
            </span>
          </p>
          <p
            className={`${satoshi.className} home-subtitle mt-8 text-center text-xl font-medium text-neutral-500 md:text-2xl md:leading-[1.7rem]`}
          >
            CQ2 is the work communication tool for written-first teams.
          </p>
        </div>
        <div className="header-btns mt-12 flex flex-row">
          <div className="mr-5">
            <Link href="https://tally.so/r/nGdzAO">
              <Button
                className={`${satoshi.className} h-8 rounded-sm bg-[#FF5F1F] p-3 text-sm font-medium text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90 md:h-8 md:p-3 md:text-base`}
              >
                Get early access
              </Button>
            </Link>
          </div>
          <div>
            <Link href="/demo/posts/ai-posts/example">
              <Button
                className={`${satoshi.className} h-8 bg-transparent p-0 text-sm font-medium text-neutral-800 shadow-none duration-100 hover:bg-transparent hover:text-neutral-500 md:h-8 md:text-base`}
              >
                Try demo
                <ArrowRight className="ml-2 mt-0.5 h-5 w-5" strokeWidth={1.8} />
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-16 w-full md:mt-28 xl:w-[76rem]">
          <Image
            src={demoScreenshot}
            className="home-demo z-10 h-auto w-full rounded-sm border border-neutral-200 shadow-sm md:rounded-sm"
            alt="CQ2 demo screenshot"
            priority={true}
          />
        </div>
        <div className="mt-36 flex flex-col items-center justify-center text-center text-base font-normal text-neutral-400 md:mt-56 md:text-2xl md:leading-[2.2rem]">
          <div className="w-full md:w-[76rem]">
            <p
              className={`${prata.className} mb-5 pb-0 text-3xl font-bold text-neutral-900 md:pb-5 md:text-5xl`}
            >
              Unique interface that mirrors how you think
            </p>
          </div>
          <div className="w-full md:w-[56rem]">
            <p
              className={`${satoshi.className} pb-0 text-lg font-medium text-neutral-500 md:pb-2 md:text-xl`}
            >
              CQ2's n-level sliding panes design with quote-level threading
              helps you organise, process and discuss things, spatially. No more
              tangling of sub-discussions around quotes — create focused threads
              in organized panes around any specific quote, as well as any
              specific comment. No more copy-pasting quotes — just select the
              text and create a new thread at a click of a button. Have a clear
              view of all the comments and parent threads of a thread, at all
              times. Easily identify parts of the discussion which were
              overlooked.
            </p>
          </div>
        </div>
        <div className="mt-36 flex flex-col items-center md:mt-56">
          <p
            className={`${prata.className} text-center text-3xl font-semibold text-neutral-900 md:w-[76rem] md:text-5xl`}
          >
            Organise your communication chaos
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`${satoshi.className} text-bold flex w-auto flex-col text-lg font-medium text-neutral-500 md:w-[76rem] md:text-xl`}
          >
            <div className="mt-10 flex flex-col md:mt-12 md:flex-row">
              <div className="basis-6/12 rounded-sm bg-white p-5 md:mr-4 md:p-10">
                <span className="mb-3 block font-semibold text-neutral-900">
                  Posts
                </span>
                Posts are for sharing updates, plans and ideas, and having
                discussions around them.
              </div>
              <div className="mt-4 basis-6/12 rounded-sm bg-white p-5 md:mt-0 md:p-10">
                <span className="mb-3 block font-semibold text-neutral-900">
                  Chat
                </span>
                Chat is the place for things which aren’t big enough for a post,
                and having discussions around them.
              </div>
            </div>
            <div className="mt-2 flex flex-col md:flex-row">
              <div className="basis-6/12 rounded-sm bg-white p-5 md:mr-4 md:p-10">
                <span className="mb-3 block font-semibold text-neutral-900">
                  Channels
                </span>
                Create post and chat channels, and organize them by any category
                — topic, project, etc.
              </div>
              <div className="mt-4 basis-6/12 rounded-sm bg-white p-5 md:mt-0 md:p-10">
                <span className="mb-3 block font-semibold text-neutral-900">
                  Inbox
                </span>
                The updates relevant to you — unread replies and mentions, and
                posts from the projects and people you follow — in one place.
              </div>
            </div>
            <div className="mt-4 flex flex-col md:flex-row">
              <div className="basis-6/12 rounded-sm bg-white p-5 md:mr-4 md:p-10">
                <span className="mb-3 block font-semibold text-neutral-900">
                  AI
                </span>
                Auto summarize discussions, generate actionables and their
                corresponding assignees, and identify unanswered questions or
                overlooked parts of a discussion.
              </div>
              <div className="mt-4 basis-6/12 rounded-sm bg-white p-5 md:mt-0 md:p-10">
                <span className="mb-3 block font-semibold text-neutral-900">
                  Focus
                </span>
                Work heads-down with Focus Mode — no distractions, no hijacking
                your attention.
              </div>
            </div>
            <div className="mt-4 flex flex-col md:flex-row">
              <div className="basis-6/12 rounded-sm bg-white p-5 md:mr-4 md:p-10">
                <span className="mb-3 block font-semibold text-neutral-900">
                  Integrations
                </span>
                Connect CQ2 with the tools your team already uses.
              </div>
              <div className="mt-4 basis-6/12 rounded-sm bg-white p-5 md:mt-0 md:p-10">
                <span className="mb-3 block font-semibold text-neutral-900">
                  Open
                </span>
                CQ2 is open source — you’re welcome to read, review, or
                contribute to it. Optionally, run your own instance for greater
                control over your data and design.
              </div>
            </div>
          </div>
        </div>
        <div className="mb-36 mt-36 flex flex-col items-center justify-center text-center text-base font-normal text-neutral-400 md:mt-56 md:text-2xl md:leading-[2.2rem]">
          <div className="w-full md:w-[56rem]">
            <p
              className={`${prata.className} mb-5 pb-0 text-3xl font-bold text-neutral-900 md:pb-5 md:text-5xl`}
            >
              Early access
            </p>
            <p
              className={`${satoshi.className} mb-10 pb-0 text-lg font-medium text-neutral-500 md:pb-2 md:text-xl`}
            >
              CQ2 is currently under heavy development. If our passion for
              thoughtful and coherent communication resonates with you, we would
              love to learn about your team, your frustrations with existing
              communication tools, and better understand how CQ2 can help.
            </p>
            <div className="flex flex-row items-center justify-center">
              <div className="mr-5">
                <Link href="https://tally.so/r/nGdzAO">
                  <Button
                    className={`${satoshi.className} h-8 rounded-sm bg-[#FF5F1F] p-3 text-sm font-medium text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90 md:h-8 md:p-3 md:text-base`}
                  >
                    Get early access
                  </Button>
                </Link>
              </div>
              <div>
                <Link href="/demo/posts/ai-posts/example">
                  <Button
                    className={`${satoshi.className} h-8 bg-transparent p-0 text-sm font-medium text-neutral-800 shadow-none duration-100 hover:bg-transparent hover:text-neutral-500 md:h-8 md:text-base`}
                  >
                    Try demo
                    <ArrowRight
                      className="ml-2 mt-0.5 h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${satoshi.className} mb-8 mt-32 flex w-full flex-row justify-between text-sm font-medium text-neutral-500 md:mt-48 md:w-[76rem]`}
        >
          <div>© 2024 CQ2</div>
          <div className="flex flex-row">
            <div className="mr-4">
              <Link
                href="mailto:anand@cq2.co"
                className="duration-100 hover:underline"
              >
                Contact
              </Link>
            </div>
            <div className="mr-4">
              <Link
                href="https://github.com/cq2-co/cq2"
                className="duration-100 hover:underline"
              >
                GitHub
              </Link>
            </div>
            <div>
              <Link
                href="https://x.com/cq2_co"
                className="duration-100 hover:underline"
              >
                X
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
