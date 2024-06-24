import SiteTopNav from "@/components/site-top-nav";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import demoImage from "../../../public/demo.png";
import { satoshi } from "../fonts";

export default function Home() {
  return (
    <main
      className={`flex h-[100dvh] flex-col items-center overflow-y-auto overflow-x-hidden scroll-smooth bg-[#fff] px-[1rem] md:px-[5rem] 2xl:px-[16rem]`}
    >
      <SiteTopNav />
      <div className="mt-48 flex w-full flex-col items-center md:mt-56">
        <p
          className={`${satoshi.className} text-center text-[3.5rem] font-medium leading-[3.5rem] text-neutral-800 md:text-8xl md:leading-[6rem]`}
        >
          Document. Discuss. Decide.
        </p>
        <p
          className={`${satoshi.className} mt-8 text-center text-lg font-normal leading-[1.5rem] text-neutral-500 md:text-2xl md:leading-[2.4rem]`}
        >
          Meet CQ2. A document collaboration tool, designed for thoughtfulness
          and coherence.
        </p>
      </div>
      <div className="mt-8 flex flex-row md:mt-12">
        <div className="mr-2">
          <Link href="https://tally.so/r/meB0yJ">
            <Button
              className={`${satoshi.className} border-CQ2Orange-600 bg-CQ2Orange-600 hover:bg-CQ2Orange-600/90 h-10 rounded-lg border p-5 text-base text-neutral-50 shadow-none duration-100 md:h-10 md:p-5 md:text-lg`}
            >
              Get early access
            </Button>
          </Link>
        </div>
        <div>
          <Link href="/app/demo">
            <Button
              className={`${satoshi.className} border-CQ2Orange-600 text-CQ2Orange-600 hover:bg-CQ2Orange-600/5 h-10 rounded-lg border bg-transparent p-5 text-base shadow-none duration-100 md:h-10 md:p-5 md:text-lg`}
            >
              Try demo
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-20 w-full md:mt-28">
        <Image
          src={demoImage}
          className="rounded-lg border border-[#EDEDED] md:rounded-lg"
          alt="CQ2 demo screenshot"
          priority={true}
          unoptimized={true}
        />
      </div>
      <div
        className={`${satoshi.className} mt-36 flex w-full flex-col items-center justify-center rounded-lg bg-[#202326] p-8 text-lg font-normal leading-[1.5rem] text-[#767676] md:mt-52 md:p-52 md:text-2xl md:leading-[2.2rem]`}
      >
        <div className="w-full md:w-[56rem]">
          <p className="text-[#fff]">Document discussions are broken.</p>
          <p className="mt-10 md:mt-12">
            Document editing tools such as Google Docs and Notion Pages are
            built for producing content, not for thoughtfully engaging with
            content. Using those tools to have a discussion on a document and
            come to a conclusion is an unpleasant experience.
          </p>
          <p className="mt-6 md:mt-8">
            Comments are hardly given any importance. They are cramped in a tiny
            column, jammed into the side. There are no threads, resulting in
            people talking over each other and topics getting mixed up. They
            lack proper revision history tracking, making it hard to find what
            the original content was before a change made after a discussion.
          </p>
          <p className="mt-6 md:mt-8">
            Forum platforms such as Discourse are also used to discuss
            documents. They lack threads and inline comments. Replies to topics
            are spread all over the place and discussions turn into a mess.
          </p>
        </div>
      </div>
      <div className="mb-5 mt-36 flex w-full flex-col items-center rounded-lg bg-[#f8f8f8] p-8 md:my-64 md:p-52">
        <p
          className={`${satoshi.className} pb-0 text-center text-3xl font-medium leading-[2.25rem] text-neutral-800 md:w-[76rem] md:pb-2 md:text-5xl`}
        >
          Ready for a better way to collaborate?
        </p>
        <p
          className={`${satoshi.className} mt-8 w-full text-center text-lg font-normal leading-[1.5rem] text-neutral-500 md:w-[64rem] md:text-2xl md:leading-[2rem]`}
        >
          CQ2 offers a better way to discuss documents and finish with clear,
          well-documented decisions — comments are given equal importance as the
          document, threads inside threads are allowed, there's a better way of
          handling revisions and history tracking, and more.
        </p>
        <div className="mt-10 flex flex-row md:mt-12">
          <div className="mr-2">
            <Link href="https://tally.so/r/meB0yJ">
              <Button
                className={`${satoshi.className} border-CQ2Orange-600 bg-CQ2Orange-600 hover:bg-CQ2Orange-600/90 h-10 rounded-lg border p-5 text-base text-neutral-50 shadow-none duration-100 md:h-10 md:p-5 md:text-lg`}
              >
                Get early access
              </Button>
            </Link>
          </div>
          <div>
            <Link href="/app/demo">
              <Button
                className={`${satoshi.className} border-CQ2Orange-600 text-CQ2Orange-600 hover:bg-CQ2Orange-600/5 h-10 rounded-lg border bg-transparent p-5 text-base shadow-none duration-100 md:h-10 md:p-5 md:text-lg`}
              >
                Try demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
