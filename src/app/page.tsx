"use client";

import Link from "next/link";
import LogoSVG from "@/components/logo-svg";
import { Button } from "@/components/ui/button";
import { satoshi } from "./fonts";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main
      className={`w-screem flex h-[100dvh] justify-center overflow-y-auto scroll-smooth bg-[#F5F5F4] text-base font-normal leading-[1.4rem] text-neutral-800`}
    >
      <div className="flex h-fit min-h-screen w-full flex-col items-center max-md:m-0 max-md:px-6">
        <div
          className={`absolute z-[9999] mt-2 flex w-[calc(100vw-1rem)] flex-row items-center justify-between rounded-full border border-neutral-100 bg-white/80 p-2 shadow-sm backdrop-blur-md md:mt-5 md:w-[42rem]`}
        >
          <div>
            <Link href="#" id="cq2-main-logo">
              <LogoSVG className="ml-2 w-10 md:ml-3" />
            </Link>
          </div>
          <div className="flex flex-row">
            <div className="mr-2">
              <Link href="/demo">
                <Button
                  className={`${satoshi.className} h-8 rounded-full bg-neutral-500 p-3 text-xs text-neutral-50 shadow-none duration-100 hover:bg-neutral-500/90 md:h-10 md:p-4 md:text-sm`}
                >
                  Try demo
                </Button>
              </Link>
            </div>
            <div>
              <Link href="https://tally.so/r/nGdzAO">
                <Button
                  className={`${satoshi.className} h-8 rounded-full bg-[#FF5F1F] p-3 text-xs text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90 md:h-10 md:p-4 md:text-sm`}
                >
                  Get early access
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p
            className={`${satoshi.className} home-title mt-48 bg-gradient-to-t from-[#000]/70 to-[#000] bg-clip-text text-center text-6xl font-semibold text-transparent md:mt-72 md:text-8xl`}
          >
            A <span className={`${satoshi.className} italic`}>better</span> way
            to discuss
          </p>
          <p
            className={`${satoshi.className} home-subtitle mt-8 text-center text-xl font-light text-neutral-600 md:text-3xl md:leading-[1.7rem]`}
          >
            CQ2 is a tool for thoughtful and coherent discussions.
          </p>
        </div>
        <div className="relative mb-56 mt-16 w-full md:mt-24 xl:w-[76rem]">
          <Image
            src="/demo.png"
            width="0"
            height="0"
            sizes="100vw"
            className="home-demo absolute z-10 h-auto w-full rounded-lg border border-neutral-200 shadow-md md:rounded-xl"
            alt="CQ2 demo screenshot"
            unoptimized={true}
            priority={true}
          />
          <div className="bg-home-gradient h-[18rem] md:h-[60rem]"></div>
        </div>
        <div className="mt-[8rem] flex flex-col items-center justify-center rounded-xl bg-[#1D1C1A] px-8 py-8 text-base font-normal leading-[1.4rem] text-neutral-400 md:mt-[40rem] md:p-56 md:text-2xl md:leading-[2.2rem]">
          <div className="w-full md:w-[48rem]">
            <p>
              Discussions using existing written communication tools often turn
              into a tangle of sub-discussions around quotes, making it hard to
              follow. There&apos;s no clear view of all the comments in a
              specific sub-discussion and how the sub-discussion is related to
              its parent, forcing constant scrolling and hopping between
              comments to gather context for a meaningful response.
            </p>
            <p className="mt-6 md:mt-14">
              Meetings are hit-or-miss. When it comes to complex and lengthy
              discussions, they often go nowhere. Instead of thoughtful
              responses, you often get knee-jerk reactions. Many meetings
              benefit from taking a break to analyse deeper or reflect further,
              but there is never enough time.
            </p>
          </div>
        </div>
        <div className="mt-36 flex flex-col items-center md:mt-56">
          <p
            className={`${satoshi.className} bg-gradient-to-t from-[#000]/80 to-[#000] bg-clip-text pb-0 text-center text-3xl font-semibold text-transparent md:w-[76rem] md:pb-2 md:text-5xl`}
          >
            CQ2 helps you{" "}
            <span className={`${satoshi.className} italic`}>organise</span> your
            discussion chaos
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`${satoshi.className} flex w-auto flex-col text-base text-neutral-700 md:w-[76rem] md:text-lg`}
          >
            <div className="mt-8 flex flex-col md:mt-16 md:flex-row">
              <div className="basis-6/12 rounded-xl bg-white p-5 md:mr-4 md:p-10">
                <span className="mb-3 block text-xl font-bold">
                  Quote-level
                </span>
                Create organised, focused threads around any specific quote, as
                well as any specific message. No more copy-pasting quotes — just
                select the text and create a new thread. See which parts of the
                discussion became sub-discussions and which were overlooked.
              </div>
              <div className="mt-4 basis-6/12 rounded-xl bg-white p-5 md:mt-0 md:p-10">
                <span className="mb-3 block text-xl font-bold">
                  N-level sliding panes
                </span>
                Go as deep as needed with n-level sliding pane threads. See all
                the comments and parent threads of a specific sub-discussions in
                the same view.
              </div>
            </div>
            <div className="mt-4 flex flex-col md:flex-row">
              <div className="basis-6/12 rounded-xl bg-white p-5 md:mr-4 md:p-10">
                <span className="mb-3 block text-xl font-bold">
                  Open-source
                </span>
                Our source code is available on GitHub — feel free to read,
                review, or contribute to it. Optionally, run your own instance
                for greater control over your data and design.
              </div>
              <div className="mt-4 basis-6/12 rounded-xl bg-white p-5 md:mt-0 md:p-10">
                <span className="mb-3 block text-xl font-bold">
                  <Sparkles />
                </span>
                More features coming up in future!
              </div>
            </div>
          </div>
        </div>
        <div className="mt-36 flex flex-col items-center justify-center rounded-xl bg-[#1D1C1A] px-8 py-8 text-base font-normal leading-[1.4rem] text-neutral-400 md:mt-56 md:p-56 md:text-2xl md:leading-[2.2rem]">
          <div className="w-full md:w-[48rem]">
            <p>
              CQ2 is currently under heavy development, and if our passion for
              thoughtful and coherent discussions resonates with you, we would
              love to learn about your team, your frustrations with discussions
              and better understand how CQ2 can help.
            </p>
          </div>
        </div>
        <div
          className={`${satoshi.className} mb-8 mt-32 flex w-full flex-row justify-between text-sm text-[#979797] md:mt-48 md:w-[76rem]`}
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
