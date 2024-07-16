import { manrope } from "@/app/fonts";
import GitHubLogoSVG from "@/components/github-logo";
import LogoSVGNeutral from "@/components/logo-svg-neutral";
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
        <div className="flex flex-col justify-between">
          <div>
            <Link href="/" className="block w-fit">
              <LogoSVGNeutral className="mt-2 h-[1.35rem] w-[1.35rem] fill-[#ff4f00] transition duration-200 hover:fill-[#303030]" />
            </Link>
          </div>
          <div className="flex flex-col">
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
            <Link href="https://tally.so/r/meB0yJ" className="block w-fit">
              <Button className="group h-8 w-auto rounded-lg border border-CQ2Orange-600 bg-CQ2Orange-600 text-sm font-medium text-neutral-50 shadow-none transition duration-200 hover:border-CQ2Orange-500 hover:bg-CQ2Orange-500 md:h-8 md:p-4 md:text-sm">
                Get early access
                <ArrowRight
                  className="ml-2 h-4 w-4 transition duration-200 group-hover:-rotate-45"
                  strokeWidth={2}
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-col justify-between rounded-xl bg-gradient-to-b from-[#fff] to-[#c0c0c0] p-5 sm:p-10 xl:w-[84%]">
        <div className="flex w-full flex-row justify-between xl:hidden">
          <div className="flex items-center">
            <Link href="/" className="block w-fit">
              <LogoSVGNeutral className="h-[1.75rem] w-[1.75rem] fill-[#ff4f00] transition duration-200 hover:fill-[#303030] sm:h-[1.35rem] sm:w-[1.35rem]" />
            </Link>
          </div>
          <div className="flex flex-row items-center">
            <Link
              href="https://github.com/cq2-co/cq2"
              className="mr-5 block w-fit sm:mr-10"
            >
              <GitHubLogoSVG className="h-[1.35rem] w-[1.35rem]" />
            </Link>
            <Link href="/app/document/demo/v1" className="mr-2 block w-fit">
              <Button className="group hidden h-8 w-auto rounded-lg border border-CQ2Orange-600 bg-transparent text-sm font-medium text-CQ2Orange-600 shadow-none transition duration-200 hover:bg-CQ2Orange-600/5 sm:flex md:h-8 md:p-4 md:text-sm">
                Live demo
                <ArrowRight
                  className="ml-2 h-4 w-4 transition duration-200 group-hover:-rotate-45"
                  strokeWidth={2}
                />
              </Button>
              <Button className="flex h-8 w-auto rounded-lg border border-CQ2Orange-600 bg-transparent text-sm font-medium text-CQ2Orange-600 shadow-none transition duration-200 hover:bg-CQ2Orange-600/5 sm:hidden md:h-8 md:p-4 md:text-sm">
                Demo
              </Button>
            </Link>
            <Link href="https://tally.so/r/meB0yJ" className="block w-fit">
              <Button className="group hidden h-8 w-auto rounded-lg border border-CQ2Orange-600 bg-CQ2Orange-600 text-sm font-medium text-neutral-50 shadow-none transition duration-200 hover:border-CQ2Orange-500 hover:bg-CQ2Orange-500 sm:flex md:h-8 md:p-4 md:text-sm">
                Get early access
                <ArrowRight
                  className="ml-2 h-4 w-4 transition duration-200 group-hover:-rotate-45"
                  strokeWidth={2}
                />
              </Button>
              <Button className="flex h-8 w-auto rounded-lg border border-CQ2Orange-600 bg-CQ2Orange-600 text-sm font-medium text-neutral-50 shadow-none transition duration-200 hover:border-CQ2Orange-500 hover:bg-CQ2Orange-500 sm:hidden md:h-8 md:p-4 md:text-sm">
                Early access
              </Button>
            </Link>
          </div>
        </div>
        <div>
          <p className="home-title mb-2 text-3xl font-semibold text-neutral-700">
            Meet CQ2.
          </p>
          <p className="home-desc text-xl font-normal text-neutral-500 sm:w-1/2 xl:w-full">
            An open-source, self-hostable tool for RFCs, designed for
            thoughtfulness and coherence.
          </p>
        </div>
        <div>
          <Image
            src={demoImage}
            className="home-hero-img rounded-sm border border-neutral-200 shadow-lg sm:rounded-lg md:rounded-lg xl:mt-0"
            alt="CQ2 demo screenshot"
            priority={true}
            unoptimized={true}
          />
        </div>
      </div>
    </main>
  );
}
