import { manrope } from "@/app/fonts";
import GitHubLogoSVG from "@/components/github-logo";
import LogoTextSVG from "@/components/logo-text-svg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const SiteTopNav = () => {
  return (
    <div
      className={`sticky top-3 z-[9999] flex w-[min(48rem,calc(100vw-2rem))] flex-row items-center justify-between rounded-sm border border-[#EDEDED]/75 bg-white/80 py-1 pl-4 pr-1 shadow-sm backdrop-blur-md md:top-5`}
    >
      <div>
        <Link href="/">
          <LogoTextSVG className="w-[3.5rem]" />
        </Link>
      </div>
      <div className="flex flex-row items-center">
        <div className="mr-5 sm:mr-8">
          <Link href="https://github.com/cq2-co/cq2">
            <GitHubLogoSVG className="h-[1rem] w-[1rem]" />
          </Link>
        </div>
        <div className="mr-1">
          <Link href="/app/document/demo/v1">
            <Button
              className={`${manrope.className} group hidden h-8 rounded-sm border border-CQ2Orange-600 bg-transparent p-3 text-sm text-CQ2Orange-600 shadow-none transition duration-200 hover:bg-CQ2Orange-600/5 sm:flex md:h-8 md:p-4 md:text-sm`}
            >
              Live demo
              <ArrowRight
                className="ml-2 h-4 w-4 transition duration-200 group-hover:-rotate-45"
                strokeWidth={2}
              />
            </Button>
            <Button
              className={`${manrope.className} group flex h-8 rounded-sm border border-CQ2Orange-600 bg-transparent p-3 text-sm text-CQ2Orange-600 shadow-none transition duration-200 hover:bg-CQ2Orange-600/5 sm:hidden md:h-8 md:p-4 md:text-sm`}
            >
              Demo
            </Button>
          </Link>
        </div>
        <div>
          <Link href="/app">
            <Button
              className={`${manrope.className} group hidden h-8 rounded-sm border border-CQ2Orange-600 bg-CQ2Orange-600 p-3 text-sm text-neutral-50 shadow-none transition duration-200 hover:border-CQ2Orange-500 hover:bg-CQ2Orange-500 sm:flex md:h-8 md:p-4 md:text-sm`}
            >
              Go to app
              <ArrowRight
                className="ml-2 h-4 w-4 transition duration-200 group-hover:-rotate-45"
                strokeWidth={2}
              />
            </Button>
            <Button
              className={`${manrope.className} group flex h-8 rounded-sm border border-CQ2Orange-600 bg-CQ2Orange-600 p-3 text-sm text-neutral-50 shadow-none transition duration-200 hover:border-CQ2Orange-500 hover:bg-CQ2Orange-500 sm:hidden md:h-8 md:p-4 md:text-sm`}
            >
              Go to app
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SiteTopNav;
