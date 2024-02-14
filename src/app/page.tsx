"use client";

import Link from "next/link";
import LogoSVG from "@/components/logo-svg";
import { Button } from "@/components/ui/button";
import { dmSans } from "./fonts";

export default function Home() {
  return (
    <main
      className={`flex h-[100dvh] justify-center overflow-y-auto scroll-smooth bg-white text-base font-normal leading-[1.3rem] text-neutral-700`}
    >
      <div className="relative mx-48 h-fit min-h-screen max-w-[28rem] border-l border-r border-[#e9e9e9] bg-white p-4 max-md:m-0 max-md:px-6">
        <div className="mt-4 w-14">
          <Link href="#" id="cq2-main-logo">
            <LogoSVG className="w-14" />
          </Link>
        </div>
        <p
          className={`${dmSans.className} mt-20 bg-gradient-to-t from-[#FF5F1F]/90 to-[#FF5F1F] bg-clip-text text-2xl font-medium text-transparent`}
        >
          CQ2 is a tool for thoughtful and coherent discussions.
        </p>
        <p className="mt-10">
          Discussions using existing written communication tools often turn into
          a tangle of sub-discussions around quotes, making it hard to follow.
          There&apos;s no clear view of all the comments in a specific
          sub-discussion and how the sub-discussion is related to its parent,
          forcing constant scrolling and hopping between comments to gather
          context for a meaningful response. On top of all that, it&apos;s tough
          to tell if any key points were overlooked.
        </p>
        <p className="mt-5">
          Meetings are hit-or-miss. When it comes to complex and lengthy
          discussions, they often go nowhere. Instead of thoughtful responses,
          you often get knee-jerk reactions. Many meetings benefit from taking a
          break to analyse deeper or reflect further, but there is never enough
          time.
        </p>
        <p className="mt-14">CQ2 is a better way to discuss:</p>
        <div className="mt-5 flex flex-col text-sm text-neutral-700">
          <div className="flex flex-row">
            <div className="mr-4 basis-6/12 rounded-sm bg-neutral-100 p-4">
              Create organised threads around specific quotes
            </div>
            <div className="basis-6/12 rounded-sm bg-neutral-100 p-4">
              Go as deep as needed with n-level threads
            </div>
          </div>
          <div className="mt-4 flex flex-row">
            <div className="mr-4 basis-6/12 rounded-sm bg-neutral-100 p-4">
              See all the comments and parent threads of a specific thread in
              the same view
            </div>
            <div className="basis-6/12 rounded-sm bg-neutral-100 p-4">
              See which parts of the discussion became sub-discussions and which
              were overlooked
            </div>
          </div>
          <div className="mt-4 flex flex-row">
            <div className="mr-4 basis-6/12 rounded-sm bg-neutral-100 p-4">
              No more copy-pasting quotes
            </div>
            <div className="basis-6/12 rounded-sm bg-neutral-100 p-4">
              Open-source, and more features coming up in future!
            </div>
          </div>
        </div>
        <p className="mt-14">
          We are currently under heavy development, and would love to learn
          about your team, your frustrations with discussions, and shape the
          future of CQ2, together.
        </p>
        <p className="mt-14">
          <Link href="https://tally.so/r/nGdzAO">
            <Button
              className={`${dmSans.className} rounded-sm bg-[#FF5F1F] px-4 py-4 text-sm text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90`}
            >
              Get early access
            </Button>
          </Link>
          <Link href="/demo">
            <Button
              className={`${dmSans.className} ml-4 rounded-sm bg-neutral-600 px-4 py-4 text-sm text-neutral-50 shadow-none duration-100 hover:bg-neutral-600/90`}
            >
              Try demo
            </Button>
          </Link>
        </p>
        <div
          className={`${dmSans.className} mt-32 flex flex-row justify-between`}
        >
          <div>
            <Link
              href="mailto:anand@cq2.co"
              className="text-neutral-500 duration-100 hover:underline"
            >
              Email
            </Link>
          </div>
          <div className="flex flex-row">
            <div className="mr-4">
              <Link
                href="https://github.com/cq2-co/cq2"
                className="text-neutral-500 duration-100 hover:underline"
              >
                GitHub
              </Link>
            </div>
            <div>
              <Link
                href="https://x.com/cq2_co"
                className="text-neutral-500 duration-100 hover:underline"
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
