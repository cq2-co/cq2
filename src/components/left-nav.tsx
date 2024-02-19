import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoSVG from "./logo-svg";
import dayjs from "dayjs";
import { useDiscussionStore } from "@/state";
import { dmSans } from "@/app/fonts";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
  }[];
}

const LeftNav = ({ links, isCollapsed }: NavProps) => {
  const { discussion, setNewDiscussion } = useDiscussionStore();

  return (
    <div className="flex h-full w-56 border-r border-neutral-200 bg-[#FBFBFA]">
      <div data-collapsed={isCollapsed} className="group flex flex-col gap-4">
        <div className="mt-6 w-12 pl-6">
          <Link href="/" className="mb-3" id="cq2-logo-link">
            <LogoSVG className="w-12" />
          </Link>
        </div>
        <div className={`mt-8 px-6 font-medium text-neutral-700`}>
          {discussion.title}
        </div>
        <div className="mt-1 px-6 text-sm font-normal text-neutral-500">
          by{" "}
          <span
            className={`${dmSans.className} text-sm font-medium text-neutral-700`}
          >
            {discussion.user_name}
          </span>
          {/* <span className="ml-3 font-normal text-neutral-400">
            {dayjs("2024-02-01").fromNow(true)}
          </span> */}
        </div>
        {/* <div className="mt-16 px-6 text-sm font-light text-[#7D7D7A]">
          <ul className="left-nav-tree">
            <li>1</li>
            <li>
              <ul>
                <li>2</li>
                <li>3</li>
                <li>4</li>
              </ul>
            </li>
            <li>5</li>
            <li>6</li>
            <li>
              <ul>
                <li>7</li>
                <li>
                  <ul>
                    <li>8</li>
                    <li>9</li>
                    <li>10</li>
                  </ul>
                </li>
                <li>11</li>
                <li>12</li>
              </ul>
            </li>
            <li>13</li>
          </ul>
        </div> */}
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          <TooltipProvider>
            {links.map((link, index) => (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-12 w-12 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700",
                      link.variant === "default" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.title}
                  {link.label && (
                    <span className="ml-auto text-muted-foreground">
                      {link.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
        <div className="mb-6 mt-auto flex flex-col px-6">
          <div className="mb-6 text-xs font-light text-neutral-500">
            <p>Demo version:</p>
            <p>Limited functionality</p>
          </div>
          <div>
            <Link href="https://tally.so/r/nGdzAO">
              <Button
                className={`${dmSans.className} w-44 rounded-sm bg-[#FF5F1F] px-2 text-sm text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90`}
              >
                Get early access
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftNav;
