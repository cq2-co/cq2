import { satoshi } from "@/app/fonts";
import LogoTextSVG from "@/components/logo-text-svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SiteTopNav = () => {
  return (
    <div
      className={`sticky top-3 z-[9999] flex w-[min(48rem,calc(100vw-2rem))] flex-row items-center justify-between rounded-lg border border-[#EDEDED]/75 bg-white/80 py-1 pl-4 pr-1 shadow-sm backdrop-blur-md md:top-5`}
    >
      <div>
        <Link href="/">
          <LogoTextSVG className="w-[3.5rem]" />
        </Link>
      </div>
      <div className="flex flex-row">
        <div className="mr-1 hidden md:flex">
          <Link href="https://github.com/cq2-co/cq2">
            <Button
              className={`${satoshi.className} h-8 rounded-lg border border-transparent bg-transparent p-3 text-xs text-neutral-500 shadow-none duration-100 hover:bg-neutral-100 md:h-8 md:px-3 md:py-4 md:text-sm`}
            >
              GitHub
            </Button>
          </Link>
        </div>
        <div className="mr-0 hidden md:mr-5 md:flex">
          <Link href="mailto:anandbaburajan@gmail.com">
            <Button
              className={`${satoshi.className} h-8 rounded-lg border border-transparent bg-transparent p-3 text-xs text-neutral-500 shadow-none duration-100 hover:bg-neutral-100 md:h-8 md:px-3 md:py-4 md:text-sm`}
            >
              Contact
            </Button>
          </Link>
        </div>
        <div className="mr-1">
          <Link href="/app/document/demo">
            <Button
              className={`${satoshi.className} h-8 rounded-lg border border-CQ2Orange-600 bg-transparent p-3 text-sm text-CQ2Orange-600 shadow-none duration-100 hover:bg-CQ2Orange-600/5 md:h-8 md:p-4 md:text-sm`}
            >
              Try demo
            </Button>
          </Link>
        </div>
        <div>
          <Link href="https://tally.so/r/meB0yJ">
            <Button
              className={`${satoshi.className} h-8 rounded-lg border  border-CQ2Orange-600 bg-gradient-to-b from-CQ2Orange-500 to-CQ2Orange-600 p-3 text-sm text-neutral-50 shadow-none duration-100 md:h-8 md:p-4 md:text-sm`}
            >
              Get early access
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SiteTopNav;
