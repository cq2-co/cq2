"use client";

import { satoshi } from "@/app/fonts";
import { SquarePen, MessagesSquare, Box } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import demoScreenshot from "../../public/demo.png";

export default function HomePage() {
  return (
    <div className="flex h-[calc(100vh-2.5rem)] w-screen justify-center overflow-y-scroll scroll-smooth rounded-none border-0 bg-[#FFFFFF] pt-28">
      <div className="h-fit w-[48rem] px-5 pb-48">
        <div
          className={`${satoshi.className} text-4xl font-bold leading-[2.5rem] text-neutral-700`}
        >
          CQ2
        </div>
        <div
          className={`${satoshi.className} mb-12 mt-3 flex items-center text-xl font-medium text-neutral-500`}
        >
          The free and open source tool for complex discussions.
        </div>
        <div className="hidden md:flex">
          <Link
            href="/new"
            className={`${satoshi.className} inline-flex w-fit items-center rounded-lg bg-[#FF5F1F] px-2 py-1 text-sm font-medium text-white transition duration-200 hover:bg-[#FF5F1F]/90`}
          >
            <SquarePen className="mr-2 inline-block h-3 w-3" strokeWidth={3} />
            New discussion
          </Link>
          <Link
            href="/discussions"
            className={`${satoshi.className} ml-2 inline-flex w-fit items-center rounded-lg border border-neutral-300 px-2 py-1 text-sm font-medium text-neutral-500 transition duration-200 hover:bg-neutral-500/5`}
          >
            <MessagesSquare
              className="mr-2 inline-block h-3 w-3"
              strokeWidth={3}
            />
            Your discussions
          </Link>
        </div>
        <div className="flex flex-col md:hidden">
          <p className="w-fit bg-[#FF5F1F]/10 p-1 text-xs text-[#FF5F1F]">
            CQ2 is not optimized for mobile use.
          </p>
          <p className="mt-1 w-fit bg-[#FF5F1F]/10 p-1 text-xs text-[#FF5F1F]">
            Please try on a desktop or laptop.
          </p>
        </div>
        <div className="mt-16 w-full md:mt-28">
          <Image
            src={demoScreenshot}
            className="z-10 h-auto w-full rounded-sm border border-neutral-200 shadow-sm md:rounded-sm"
            alt="CQ2 demo screenshot"
            priority={true}
            unoptimized={true}
          />
        </div>
        <div className="mt-4 hidden md:flex">
          <Link
            href="/demo"
            className={`${satoshi.className} inline-flex w-fit items-center rounded-lg border border-[#FF5F1F] px-2 py-1 text-sm font-medium text-[#FF5F1F] transition duration-200 hover:bg-[#FF5F1F]/5`}
          >
            <Box className="mr-2 inline-block h-3 w-3" strokeWidth={3} />
            Try demo
          </Link>
        </div>
        <div
          className={`${satoshi.className} mt-28 text-xl font-bold text-neutral-700`}
        >
          Why
        </div>
        <div className={`mb-12 mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            Discussions using existing written communication tools often turn
            into a mess of sub-discussions around quotes. People talk over one
            another and topics get mixed up. There&apos;s no clear view of all
            the messages in a specific sub-discussion and the context of the
            sub-discussion, forcing constant scrolling and hopping between
            messages to figure out who quoted what from where and gather context
            for a meaningful response.
          </p>
          <p className="mt-4">
            Meetings are hit-or-miss. When it comes to complex and lengthy
            discussions, they often go nowhere. Many meetings benefit from
            taking a break to analyse deeper or reflect further, but there is
            never enough time.
          </p>
          <p className="mt-4">
            CQ2's unique sliding panes design with quote-level and n-level
            threads helps you hyper-focus on one thing at a time. No more losing
            context. No more copy-pasting quotes.
          </p>
        </div>
        <div
          className={`${satoshi.className} mt-28 text-xl font-bold text-neutral-700`}
        >
          How
        </div>
        <div className={`mb-6 mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            Create a new discussion in CQ2 — give a title, a short/long
            description about the discussion and your name. No login required.
            Share the link with the participants to invite them.
          </p>
          <p className="mt-4">
            General messages about the discussion and their replies go in the
            main/first thread. To reply to a particular quote from the main
            description or from any message, select the text and click on the
            popped-up button to create a new, focused thread and reply there.
            You can reply to a whole message as well, instead of a particular
            quote, by using the button on the top-right of the message.
          </p>
        </div>
        <div className="hidden md:flex">
          <Link
            href="/new"
            className={`${satoshi.className} inline-flex w-fit items-center rounded-lg bg-[#FF5F1F] px-2 py-1 text-sm font-medium text-white transition duration-200 hover:bg-[#FF5F1F]/90`}
          >
            <SquarePen className="mr-2 inline-block h-3 w-3" strokeWidth={3} />
            New discussion
          </Link>
          <Link
            href="/demo"
            className={`${satoshi.className} ml-2 inline-flex w-fit items-center rounded-lg border border-[#FF5F1F] px-2 py-1 text-sm font-medium text-[#FF5F1F] transition duration-200 hover:bg-[#FF5F1F]/5`}
          >
            <Box className="mr-2 inline-block h-3 w-3" strokeWidth={3} />
            Try demo
          </Link>
        </div>
        <div
          className={`${satoshi.className} mt-28 text-xl font-bold text-neutral-700`}
        >
          Upgrade
        </div>
        <div className={`mb-12 mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            CQ2 currently runs on free tier plans of hosting and database
            services, which may result in slow performance. If you use CQ2
            regularly or for work, consider upgrading to a paid plan. You would
            get a faster experience, accounts for you and your team members,
            ability to keep your discussions indefinitely and get early access
            to new features. If you&#39;re interested, let us know{" "}
            <Link href="https://tally.so/r/nP6Xyd" className="underline">
              here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
