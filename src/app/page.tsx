import ComparisonSVG from "@/components/comparison-svg";
import LogoSVG from "@/components/logo-svg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import demoImage from "../../public/demo.png";
import { satoshi } from "./fonts";

export default function Home() {
  return (
    <main
      className={`home-bg flex h-[100dvh] w-screen justify-center overflow-y-auto scroll-smooth bg-[#FFF] text-base font-normal leading-[1.4rem] text-neutral-800`}
    >
      <div className="flex h-fit min-h-screen w-full flex-col items-center max-md:m-0 max-md:px-6">
        <div
          className={`absolute z-[9999] mt-2 flex w-[calc(100vw-2rem)] flex-row items-center justify-between border border-neutral-200/75 bg-white/80 p-1 shadow-sm backdrop-blur-md md:mt-5 md:w-[48rem]`}
        >
          <div>
            <Link href="/" id="cq2-main-logo">
              <LogoSVG className="ml-2 w-10 md:ml-3" />
            </Link>
          </div>
          <div className="flex flex-row">
            <div className="mr-2 flex">
              <Link href="https://github.com/cq2-co/cq2">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-transparent bg-transparent p-3 text-xs text-neutral-700 shadow-none duration-100 hover:bg-neutral-200 md:h-8 md:px-3 md:py-4 md:text-sm`}
                >
                  GitHub
                </Button>
              </Link>
            </div>
            <div className="mr-2 flex">
              <Link href="https://github.com/orgs/cq2-co/discussions/1">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-transparent bg-transparent p-3 text-xs text-neutral-700 shadow-none duration-100 hover:bg-neutral-200 md:h-8 md:px-3 md:py-4 md:text-sm`}
                >
                  Feedback
                </Button>
              </Link>
            </div>
            <div className="mr-2 flex">
              <Link href="mailto:anand@cq2.co">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-transparent bg-transparent p-3 text-xs text-neutral-700 shadow-none duration-100 hover:bg-neutral-200 md:h-8 md:px-3 md:py-4 md:text-sm`}
                >
                  Contact
                </Button>
              </Link>
            </div>
            <div className="mr-0 hidden md:mr-2 md:flex">
              <Link href="/app/demo">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-[#FF5F1F] bg-transparent p-3 text-xs text-[#FF5F1F] shadow-none duration-100 hover:bg-[#FF5F1F]/5 md:h-8 md:p-4 md:text-sm`}
                >
                  Try demo discussion
                </Button>
              </Link>
            </div>
            <div className="hidden md:flex">
              <Link href="/app/new">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-[#FF5F1F] bg-[#FF5F1F] p-3 text-xs text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90 md:h-8 md:p-4 md:text-sm`}
                >
                  Try new discussion
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p
            className={`${satoshi.className} home-title mt-48 bg-gradient-to-t from-[#000]/70 to-[#000] bg-clip-text text-center text-[3.5rem] font-semibold leading-[3.5rem] text-transparent md:mt-64 md:text-8xl md:leading-tight`}
          >
            A better way to discuss
          </p>
          <p
            className={`${satoshi.className} home-subtitle mt-6 text-center text-xl font-medium text-neutral-500 md:text-3xl md:leading-[1.7rem]`}
          >
            CQ2 is the free and open source tool for complex discussions.
          </p>
        </div>
        <div className="home-cta-btns mt-8 flex flex-row md:mt-12">
          <div className="mr-2">
            <Link href="/app/new">
              <Button
                className={`${satoshi.className} h-8 rounded-none border border-[#FF5F1F] bg-[#FF5F1F] p-3 text-xs text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90 md:h-10 md:p-5 md:text-lg`}
              >
                Try new discussion
              </Button>
            </Link>
          </div>
          <div>
            <Link href="/app/demo">
              <Button
                className={`${satoshi.className} h-8 rounded-none border border-[#FF5F1F] bg-[#fff] p-3 text-xs text-[#FF5F1F] shadow-none duration-100 hover:bg-[#FF5F1F]/5 md:h-10 md:p-5 md:text-lg`}
              >
                Try demo discussion
              </Button>
            </Link>
          </div>
        </div>
        <div className="home-demo mt-16 w-full md:mt-24 xl:w-[76rem]">
          <Image
            src={demoImage}
            className="border border-neutral-200"
            alt="CQ2 demo screenshot"
            priority={true}
          />
        </div>
        <div className="mt-36 flex w-full flex-col items-center justify-center bg-[#1D1C1A] p-8 text-base font-normal leading-[1.4rem] text-neutral-400 md:mt-52 md:p-52 md:text-2xl md:leading-[2.2rem] xl:w-[76rem]">
          <div className="w-full md:w-[48rem]">
            <p>
              There are no chat/forum platforms built for complex discussions.
            </p>
            <p className="mt-6 md:mt-12">
              Discussions using existing platforms turn into a mess of
              unorganised comments. They lack structure. People talk over one
              another and topics get mixed up. Replies to a particular topic are
              spread across different comments and you're forced to mentally
              manage all the quotes and their replies.
            </p>
            <p className="mt-6 md:mt-12">
              In-person discussions are hit-or-miss and most often go nowhere.
              They are extremely hard to provide a good structure for. Instead
              of well-formed thoughts, you often get impulsive responses and hot
              takes. They favour speaking ability. Many discussions benefit from
              taking a break to gather evidence or think more but there's never
              enough time.
            </p>
          </div>
        </div>
        <div className="mt-36 flex w-full flex-col items-center border border-[#FF5F1F] bg-[#fff] p-8 md:mt-52 md:p-52 xl:w-[76rem]">
          <p
            className={`${satoshi.className} bg-gradient-to-t from-[#000]/70 to-[#000] bg-clip-text pb-0 text-center text-3xl font-semibold text-transparent md:w-[76rem] md:pb-2 md:text-5xl`}
          >
            Organise your discussion chaos
          </p>
          <p
            className={`${satoshi.className} mt-8 w-full text-center text-xl font-medium text-neutral-500 md:w-[64rem] md:text-3xl md:leading-[2.8rem]`}
          >
            CQ2 is the only tool specifically built for complex discussions.
            It's in its early stages, but it's the start of something that we
            think will both make discussions immensely enjoyable and radically
            increase productivity.
          </p>
          <div className="mt-12 flex flex-row">
            <div className="mr-2">
              <Link href="/blog/the-best-way-to-have-complex-discussions">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-[#FF5F1F] bg-[#FF5F1F] p-3 text-xs italic text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90 md:h-10 md:p-5 md:text-lg`}
                >
                  The best way to have complex discussions
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div
          className={`${satoshi.className} mt-36 flex w-full flex-col items-center justify-center md:mt-52 xl:w-[76rem]`}
        >
          <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-3">
            <div className="col-span-1 row-span-1 md:col-span-2 md:row-span-3">
              <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#1D1C1A] p-8 text-center md:p-28">
                <h1 className="text-3xl font-semibold text-neutral-300 md:text-5xl">
                  No more mess of unorganised comments
                </h1>
                <h3 className="text-xl font-medium text-neutral-400 md:text-3xl">
                  Create threads inside threads so that each thread stays on
                  topic and organised
                </h3>
              </div>
            </div>
            <div className="row-span-1 flex flex-col items-center justify-center bg-[#1D1C1A] p-8 text-center md:row-span-4 md:p-12">
              <h1 className="mb-4 text-3xl font-semibold text-neutral-300 md:text-3xl">
                Forget quote hell
              </h1>
              <h3 className="text-xl font-medium text-neutral-400 md:text-xl">
                Create threads around specific quotes and find all replies
                related to a topic at one place
              </h3>
            </div>
            <div className="row-span-1 flex flex-col items-center justify-center bg-[#1D1C1A] p-8 text-center text-3xl font-bold md:row-span-3 md:p-12">
              <h1 className="mb-4 text-3xl font-semibold text-neutral-300 md:text-3xl">
                Conclude threads
              </h1>
              <h3 className="text-xl font-medium text-neutral-400 md:text-xl">
                Add conclusions to resolved threads and to the whole discussion
                once it's resolved
              </h3>
            </div>
            <div className="row-span-1 flex flex-col items-center justify-center bg-[#1D1C1A] p-8 text-center text-3xl font-bold md:row-span-3 md:p-12">
              <h1 className="mb-4 text-3xl font-semibold text-neutral-300 md:text-3xl">
                Focus on what matters
              </h1>
              <h3 className="text-xl font-medium text-neutral-400 md:text-xl">
                See which threads have unread comments, which are concluded and
                quickly go to a particular thread using CQ2's tree
              </h3>
            </div>
            <div className="row-span-1 flex flex-col items-center justify-center bg-[#1D1C1A] p-8 text-center text-3xl font-bold md:row-span-2 md:p-12">
              <h1 className="mb-4 text-3xl font-semibold text-neutral-300 md:text-3xl">
                Never lose context of where you are
              </h1>
              <h3 className="text-xl font-medium text-neutral-400 md:text-xl">
                See all parent threads of the current thread in the same view
              </h3>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center bg-[#1D1C1A] px-8 py-8 text-center text-3xl font-bold md:col-span-3 md:px-48 md:py-20">
              <h1 className="mb-4 text-3xl font-semibold text-neutral-300 md:text-3xl">
                And more coming soon!
              </h1>
              <h3 className="text-xl font-medium text-neutral-400 md:text-xl">
                Rich text, workspaces, custom titles for threads, mentions, slow
                mode, useful reactions (and not just emojis) and an AI assistant
                to help you find overlooked parts of the discussion.
              </h3>
            </div>
          </div>
        </div>
        <div className="ml-0 mt-28 flex w-full items-center justify-center bg-transparent px-4 py-8 md:mt-52 lg:ml-0 lg:w-[76rem] lg:py-16 2xl:ml-[1.25rem] min-[1800px]:w-[102rem] min-[1800px]:bg-transparent min-[1800px]:p-0">
          <ComparisonSVG />
        </div>
        <div className="mb-24 mt-28 flex w-full flex-col items-center border border-[#FF5F1F] bg-[#fff] p-8 md:mb-52 md:mt-52 md:p-52 xl:w-[76rem]">
          <p
            className={`${satoshi.className} bg-gradient-to-t from-[#000]/70 to-[#000] bg-clip-text pb-0 text-center text-3xl font-semibold text-transparent md:w-[76rem] md:pb-2 md:text-5xl`}
          >
            Ready for a better way to discuss?
          </p>
          <div className="mt-12 flex flex-row">
            <div className="mr-2">
              <Link href="https://tally.so/r/meB0yJ">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-[#FF5F1F] bg-[#FF5F1F] p-3 text-xs text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90 md:h-10 md:p-5 md:text-lg`}
                >
                  Get early access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
