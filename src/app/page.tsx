import Link from "next/link";
import LogoSVG from "@/components/logo-svg";
import ComparisonSVG from "@/components/comparison-svg";
import { Button } from "@/components/ui/button";
import { satoshi } from "./fonts";
import Image from "next/image";

export default function Home() {
  return (
    <main
      className={`home-main flex h-[100dvh] w-screen justify-center overflow-y-auto scroll-smooth bg-[#F3F4F6] text-base font-normal leading-[1.4rem] text-neutral-800`}
    >
      <div className="flex h-fit min-h-screen w-full flex-col items-center max-md:m-0 max-md:px-6">
        <div
          className={`absolute z-[9999] mt-2 flex w-[calc(100vw-2rem)] flex-row items-center justify-between rounded-full border border-neutral-100 bg-white/80 p-1 shadow-sm backdrop-blur-md md:mt-5 md:w-[56rem]`}
        >
          <div>
            <Link href="/" id="cq2-main-logo">
              <LogoSVG className="ml-2 w-10 md:ml-3" />
            </Link>
          </div>
          <div className="flex flex-row">
            <div className="hidden md:flex">
              <Link href="/app">
                <Button
                  className={`${satoshi.className} h-8 rounded-full border border-transparent bg-transparent p-3 text-xs text-neutral-700 shadow-none duration-100 hover:bg-neutral-200 md:h-8 md:px-3 md:py-4 md:text-sm`}
                >
                  Discussions
                </Button>
              </Link>
            </div>
            <div className="hidden md:flex">
              <Link href="https://github.com/cq2-co/cq2">
                <Button
                  className={`${satoshi.className} h-8 rounded-full border border-transparent bg-transparent p-3 text-xs text-neutral-700 shadow-none duration-100 hover:bg-neutral-200 md:h-8 md:px-3 md:py-4 md:text-sm`}
                >
                  GitHub
                </Button>
              </Link>
            </div>
            <div className="mr-2 hidden md:flex">
              <Link href="https://github.com/orgs/cq2-co/discussions/1">
                <Button
                  className={`${satoshi.className} h-8 rounded-full border border-transparent bg-transparent p-3 text-xs text-neutral-700 shadow-none duration-100 hover:bg-neutral-200 md:h-8 md:px-3 md:py-4 md:text-sm`}
                >
                  Feedback
                </Button>
              </Link>
            </div>
            <div className="mr-2">
              <Link href="/app/demo">
                <Button
                  className={`${satoshi.className} h-8 rounded-full border border-[#FF5F1F] bg-transparent p-3 text-xs text-[#FF5F1F] shadow-none duration-100 hover:bg-[#FF5F1F]/10 md:h-8 md:p-4 md:text-sm`}
                >
                  Try demo
                </Button>
              </Link>
            </div>
            <div>
              <Link href="/app/new">
                <Button
                  className={`${satoshi.className} h-8 rounded-full border border-[#FF5F1F] bg-[#FF5F1F] p-3 text-xs text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90 md:h-8 md:p-4 md:text-sm`}
                >
                  New discussion
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p
            className={`${satoshi.className} home-title mt-48 bg-gradient-to-t from-[#000]/70 to-[#000] bg-clip-text text-center text-[3.5rem] font-semibold leading-[3.8rem] text-transparent md:mt-72 md:text-8xl md:leading-tight`}
          >
            A <span className={`${satoshi.className} italic`}>better</span> way
            to discuss
          </p>
          <p
            className={`${satoshi.className} home-subtitle mt-6 text-center text-xl font-medium text-neutral-500 md:text-3xl md:leading-[1.7rem]`}
          >
            CQ2 is the free and open source tool for complex discussions.
          </p>
        </div>
        <div className="relative mb-52 mt-16 w-full md:mt-24 xl:w-[76rem]">
          <Image
            src="/demo.png"
            width="0"
            height="0"
            sizes="100vw"
            className="home-demo absolute z-10 h-auto w-full rounded-md border border-neutral-200 shadow-md md:rounded-xl"
            alt="CQ2 demo screenshot"
            unoptimized={true}
            priority={true}
          />
          <div className="bg-home-gradient h-[18rem] md:h-[60rem]"></div>
        </div>
        <div className="ml-0 mt-36 flex w-full items-center justify-center rounded-xl bg-transparent bg-white px-4 py-8 md:mt-[40rem] lg:ml-0 lg:w-[76rem] lg:py-16 2xl:ml-[1.25rem] min-[1800px]:w-[102rem] min-[1800px]:bg-transparent min-[1800px]:p-0">
          <ComparisonSVG />
        </div>
        <div className="mt-36 flex w-full flex-col items-center justify-center rounded-xl bg-[#1D1C1A] p-8 text-base font-normal leading-[1.4rem] text-neutral-400 md:mt-52 md:p-52 md:text-2xl md:leading-[2.2rem] xl:w-[76rem]">
          <div className="w-full md:w-[48rem]">
            <p>
              There are no chat/forum platforms built for complex discussions.
            </p>
            <p className="mt-6 md:mt-12">
              Discussions using existing platforms often turn into a mess of
              sub-discussions around quotes. You're forced to mentally manage
              who quoted what from where. People talk over one another and
              topics get mixed up.
            </p>
            <p className="mt-6 md:mt-12">
              Meetings are hit-or-miss. When it comes to complex and lengthy
              discussions, they often go nowhere. Many meetings benefit from
              taking a break to analyse deeper or reflect further, but there is
              never enough time.
            </p>
          </div>
        </div>
        <div className="mt-36 flex w-full flex-col items-center rounded-xl bg-[#fff] p-8 md:mt-52 md:p-52 xl:w-[76rem]">
          <p
            className={`${satoshi.className} bg-gradient-to-t from-[#000]/70 to-[#000] bg-clip-text pb-0 text-center text-3xl font-semibold text-transparent md:w-[76rem] md:pb-2 md:text-5xl`}
          >
            <span className={`${satoshi.className} italic`}>Organise</span> your
            discussion chaos
          </p>
          <p
            className={`${satoshi.className} mt-8 w-full text-center text-xl font-medium text-neutral-500 md:w-[68rem] md:text-3xl md:leading-[2.8rem]`}
          >
            CQ2 lets you create organised discussions around specific quotes.
            Hyper-focus on one thing at a time. No more losing context. No more
            copy-pasting quotes.
          </p>
          <div className="mt-12 flex flex-row">
            <div className="mr-2">
              <Link href="/app/new">
                <Button
                  className={`${satoshi.className} h-8 rounded-full border border-[#FF5F1F] bg-[#FF5F1F] p-3 text-xs text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90 md:h-10 md:p-5 md:text-lg`}
                >
                  New discussion
                </Button>
              </Link>
            </div>
            <div>
              <Link href="/app/demo">
                <Button
                  className={`${satoshi.className} h-8 rounded-full border border-[#FF5F1F] bg-transparent p-3 text-xs text-[#FF5F1F] shadow-none duration-100 hover:bg-[#FF5F1F]/10 md:h-10 md:p-5 md:text-lg`}
                >
                  Try demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-36 flex w-full flex-col items-center justify-center rounded-xl bg-[#1D1C1A] px-8 py-8 text-base font-normal leading-[1.4rem] text-neutral-400 md:mt-52 md:p-52 md:text-2xl md:leading-[2.2rem] xl:w-[76rem]">
          <div className="w-full md:w-[48rem]">
            <p>
              If you use CQ2 regularly or for work, consider upgrading to a paid
              plan. You would get a faster experience, accounts for you and your
              team members, and priority feature requests and support. If you're
              interested, let us know{" "}
              <Link
                href="https://tally.so/r/nP6Xyd"
                className="underline duration-100 hover:text-neutral-300"
              >
                here
              </Link>
              .
            </p>
          </div>
        </div>
        <div
          className={`${satoshi.className} mb-8 mt-32 flex w-full flex-row justify-between text-sm text-[#979797] md:mt-48 md:w-[76rem]`}
        >
          <div>© 2024 CQ2</div>
          <div className="flex flex-row">
            <div className="mr-6">
              <Link
                href="mailto:anand@cq2.co"
                className="duration-100 hover:underline"
              >
                Contact
              </Link>
            </div>
            <div className="mr-6">
              <Link
                href="https://github.com/cq2-co/cq2"
                className="duration-100 hover:underline"
              >
                GitHub
              </Link>
            </div>
            <div>
              <Link href="/privacy" className="duration-100 hover:underline">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
