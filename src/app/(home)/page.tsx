import { manrope } from "@/app/fonts";
import GitHubLogoSVG from "@/components/github-logo";
import LogoTextSVG from "@/components/logo-text-svg";
import SiteTopNav from "@/components/site-top-nav";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import demoImage from "../../../public/demo.png";

export default function Home() {
  return (
    <main
      className={`${manrope.className} flex h-[100dvh] flex-col overflow-x-hidden overflow-y-hidden bg-[#fff] p-2 sm:p-5 xl:flex-row`}
    >
      <div className="mr-5 hidden w-[16%] justify-center rounded-xl bg-gradient-to-b from-[#fff] to-[#eeeeee] px-0 py-10 xl:flex 2xl:justify-start 2xl:px-10">
        <div className="flex flex-col justify-between 2xl:w-full">
          <div>
            <Link href="/" className="block w-fit">
              <LogoTextSVG className="mt-[0.3rem] h-[1.35rem]" />
            </Link>
          </div>
          <div className="my-10 h-full border-l border-neutral-300" />
          <div className="flex flex-col 2xl:w-full">
            <Link
              href="https://github.com/cq2-co/cq2"
              className="mb-10 block w-fit"
            >
              <GitHubLogoSVG className="h-[1.35rem] w-[1.35rem]" />
            </Link>
            <Link href="/app/document/demo/v1" className="mb-2 block w-fit">
              <Button className="group h-8 w-auto rounded-lg border border-CQ2Orange-600 bg-transparent text-sm font-medium text-CQ2Orange-600 shadow-none transition duration-200 hover:bg-CQ2Orange-600/5 md:h-8 md:p-4 md:text-sm">
                Live demo
                <ArrowRight
                  className="ml-2 h-4 w-4 transition duration-200 group-hover:-rotate-45"
                  strokeWidth={2}
                />
              </Button>
            </Link>
            <Link href="https://tally.so/r/meB0yJ" className="block 2xl:w-full">
              <Button className="group flex h-8 w-auto flex-row justify-between rounded-lg border border-CQ2Orange-600 bg-CQ2Orange-600 text-sm font-medium text-neutral-50 shadow-none transition duration-200 hover:border-CQ2Orange-500 hover:bg-CQ2Orange-500 md:h-8 md:p-4 md:text-sm 2xl:w-full">
                <span>Get early access</span>
                <ArrowRight
                  className="ml-2 h-4 w-4 transition duration-200 group-hover:-rotate-45 2xl:ml-0"
                  strokeWidth={2}
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-col justify-between rounded-md bg-gradient-to-b from-[#fff] to-[#c0c0c0] sm:rounded-xl xl:w-[84%]">
        <div className="flex justify-center pt-2 xl:hidden">
          <SiteTopNav />
        </div>
        <div className="px-5 pt-5 sm:px-10 sm:pt-10">
          <p className="home-title text-2xl font-medium text-neutral-500">
            An open-source, self-hostable tool for RFCs, designed for
            thoughtfulness and coherence.
          </p>
        </div>
        <div className="px-5 pb-5 sm:px-10 sm:pb-10">
          <Image
            src={demoImage}
            className="home-hero-img rounded-sm border border-neutral-200 shadow-xl sm:rounded-lg md:rounded-lg xl:mt-0"
            alt="CQ2 demo screenshot"
            priority={true}
            unoptimized={true}
          />
        </div>
      </div>
    </main>
  );
}
