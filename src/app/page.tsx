"use client";

import { satoshi } from "@/app/fonts";
import { SquarePen, MessagesSquare } from "lucide-react";
import Link from "next/link";

export default function Discussions() {
  return (
    <div className="flex h-[calc(100vh-3.25rem)] w-screen justify-center overflow-y-scroll scroll-smooth rounded-none border-0 bg-[#FFFFFF] pt-28">
      <div className="h-fit w-[48rem] px-5 pb-24">
        <div
          className={`${satoshi.className} text-4xl font-bold leading-[2.5rem] text-neutral-700`}
        >
          CQ2
        </div>
        <div
          className={`mb-12 mt-3 flex items-center text-xl font-normal text-neutral-500`}
        >
          The free and open source tool for complex discussions.
        </div>
        <div>
          <Link
            href="https://tally.so/r/nGdzAO"
            className={`${satoshi.className} inline-flex w-fit items-center rounded-lg bg-[#FF5F1F] px-2 py-1 text-sm font-medium text-white transition duration-200 hover:bg-[#FF5F1F]/90`}
          >
            Get early access
          </Link>
          <Link
            href="/demo"
            className={`${satoshi.className} ml-2 inline-flex w-fit items-center rounded-lg bg-[#9b9b9b] px-2 py-1 text-sm font-medium text-white transition duration-200 hover:bg-[#9b9b9b]/90`}
          >
            Try the demo
          </Link>
        </div>
        {/* <div>
          <Link
            href="/new"
            className={`${satoshi.className} inline-flex w-fit items-center rounded-lg bg-[#FF5F1F] px-2 py-1 text-sm font-medium text-white transition duration-200 hover:bg-[#FF5F1F]/90`}
          >
            <SquarePen className="mr-2 inline-block h-3 w-3" strokeWidth={3} />
            New discussion
          </Link>
          <Link
            href="/discussions"
            className={`${satoshi.className} ml-2 inline-flex w-fit items-center rounded-lg bg-[#9b9b9b] px-2 py-1 text-sm font-medium text-white transition duration-200 hover:bg-[#9b9b9b]/90`}
          >
            <MessagesSquare
              className="mr-2 inline-block h-3 w-3"
              strokeWidth={3}
            />
            Your discussions
          </Link>
        </div> */}
        <div
          className={`${satoshi.className} mt-28 text-xl font-bold text-neutral-700`}
        >
          How-to
        </div>
        <div className={`mb-12 mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            Create a new discussion — give a title and a short/long description
            about the discussion. No login required. Share the discussion link
            with the participants to invite them.
          </p>
          <p className="mt-4">
            General messages about the discussion and their replies go in the
            main/first thread. To reply to a particular quote from the main
            description or from any message, select the text and click on the
            popped-up button to create a new thread and reply there. You can
            reply to a whole message as well, instead of a particular quote, by
            using the button on the top-right of the message.
          </p>
          <p className="mt-4">
            Want better clarity? Try the{" "}
            <Link href="/demo" className="text-neutral-700 hover:underline">
              demo
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
