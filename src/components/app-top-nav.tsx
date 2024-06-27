"use client";

import { satoshi } from "@/app/fonts";
import LogoSVGNeutral from "@/components/logo-svg-neutral";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { CQ2Tree } from "@/lib/utils";
import {
  useCQ2DocumentCurrentHighlightsStore,
  useCQ2DocumentOpenThreadsStore,
  useCQ2DocumentStore,
  useShowOldVersionStore,
} from "@/state";
import {
  CircleHelp,
  CirclePlus,
  ListTree,
  PanelRight,
  Share2,
} from "lucide-react";
import { Link as NVTLink } from "next-view-transitions";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const AppTopNav = () => {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const { showOldVersion, setShowOldVersion } = useShowOldVersionStore();
  const { CQ2DocumentOpenThreads, setNewCQ2DocumentOpenThreads } =
    useCQ2DocumentOpenThreadsStore();
  const { setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();

  const router = useRouter();
  const pathname = usePathname();

  const [showTreePopover, setShowTreePopover] = useState(false);

  const [cq2UserName, setCq2UserName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cq2UserName")) {
        setCq2UserName(localStorage.getItem("cq2UserName"));
      }
    }
  }, [setCq2UserName, pathname]);

  return (
    <div
      className={`${satoshi.className} z-50 hidden h-[2.5rem] w-screen items-center justify-between border-b border-[#EDEDED] bg-[#f7f7f5] text-sm md:flex`}
    >
      <div className="flex h-full w-[4rem] items-center justify-center">
        <Link href="/app" className="flex w-fit items-center">
          <LogoSVGNeutral className="h-4" />
        </Link>
      </div>
      {CQ2Document.version1.content === "" &&
      pathname.includes("/app/document") ? (
        <>
          <span className="flex items-center pr-1.5">
            <Skeleton className="h-[1.75rem] w-[7rem] rounded-lg" />
            <Skeleton className="ml-3 h-[1.75rem] w-[7rem] rounded-lg" />
            <Skeleton className="ml-3 h-[1.75rem] w-[7rem] rounded-lg" />
            <Skeleton className="ml-3 h-[1.75rem] w-[7rem] rounded-lg" />
          </span>
        </>
      ) : (
        <div className="z-50 hidden items-center justify-between pl-[0.9rem] pr-1.5 md:flex">
          <div className="flex flex-row items-center justify-between space-x-4">
            {pathname !== "/app/new" && pathname.includes("/app/document/") && (
              <>
                <Popover open={showTreePopover}>
                  <PopoverTrigger asChild>
                    <Button
                      id="cq2-tree-trigger-btn"
                      className="h-7 p-2 text-[#5f5d5b] transition duration-200 hover:bg-neutral-200"
                      variant={"ghost"}
                      onClick={() => setShowTreePopover(!showTreePopover)}
                    >
                      <ListTree
                        id="cq2-tree-trigger"
                        className="mr-2 h-5 w-5 text-[#91918e]"
                        strokeWidth={2}
                      />{" "}
                      Threads
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="cq2-hover-card w-fit rounded-lg p-3"
                    align="end"
                    sideOffset={16}
                    onInteractOutside={(e) => {
                      if (
                        e.target.id !== "cq2-tree-trigger-btn" &&
                        e.target.parentElement.id !== "cq2-tree-trigger" &&
                        e.target.id !== "cq2-tree-trigger" &&
                        e.target.parentElement.id !== "cq2-tree-trigger-btn"
                      ) {
                        setShowTreePopover(false);
                      }
                    }}
                  >
                    <div className="max-h-[36rem] overflow-y-auto rounded-lg bg-neutral-50 p-4">
                      <CQ2Tree
                        CQ2Document={CQ2Document}
                        setShowTreePopover={setShowTreePopover}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  className="h-7 p-2 text-[#5f5d5b] transition duration-200 hover:bg-neutral-200"
                  variant={"ghost"}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${NEXT_PUBLIC_BASE_URL}/app/document/${
                        CQ2Document._id
                      }/${CQ2Document.version1.is_concluded ? "v2" : "v1"}`,
                    );
                    toast("Link copied to clipboard");
                  }}
                >
                  <Share2
                    className="mr-2 h-4 w-4 text-[#91918e]"
                    strokeWidth={2.5}
                  />{" "}
                  Share
                </Button>
              </>
            )}
            {pathname.includes("/app/document/") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="h-7 p-2 text-[#5f5d5b] transition duration-200 hover:bg-neutral-200"
                    variant={"ghost"}
                  >
                    <CircleHelp
                      className="mr-2 h-4 w-4 text-[#91918e]"
                      strokeWidth={2.5}
                    />{" "}
                    Help
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="cq2-hover-card w-[30rem] rounded-lg p-3"
                  align="end"
                  sideOffset={16}
                >
                  {pathname.includes("/app/document/") && (
                    <div
                      className={`flex max-h-[36rem] w-auto flex-col overflow-y-auto text-sm text-neutral-500`}
                    >
                      <div className="rounded-lg bg-neutral-50 p-4">
                        <span className="mb-2 block font-medium text-neutral-800">
                          Opening threads
                        </span>
                        If someone has already created a thread for a particular
                        quote, the quote would appear highlighted yellow. You
                        can click on it to open the corresponding thread and
                        continue the discussion there.
                      </div>
                      <div className="mt-3 rounded-lg bg-neutral-50 p-4">
                        <span className="mb-2 block font-medium text-neutral-800">
                          Commenting and creating threads
                        </span>
                        General comments about the document go below the
                        document. To reply to a particular text from the
                        document or from any comment in a new thread, select the
                        text, click on the popped-up "Comment in new thread"
                        button, and reply there.
                      </div>
                      <div className="mt-3 rounded-lg bg-neutral-50 p-4">
                        <span className="mb-2 block font-medium text-neutral-800">
                          Navigation
                        </span>
                        To move between different threads, you can scroll using
                        a trackpad or using your mouse's scroll wheel with the
                        shift key. You can also use the Threads tree from the
                        navigation bar to quickly go to a particular thread. The
                        tree also shows the number of comments in a thread, the
                        number of unread comments and whether the thread has
                        been concluded or not.
                      </div>
                      <div className="mt-3 rounded-lg bg-neutral-50 p-4">
                        <span className="mb-2 block font-medium text-neutral-800">
                          Conclusion
                        </span>
                        You can conclude threads by using the “Conclude thread”
                        button in the thread's menu. When the discussion is
                        over, click the "New version" button in the menu. Then
                        update the document and click on "Publish" to publish
                        the new version.
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}
            {pathname.includes("/v2") && (
              <>
                <Button
                  className="h-7 p-2 text-[#5f5d5b] transition duration-200 hover:bg-neutral-200"
                  variant={"ghost"}
                  onClick={() => {
                    setShowOldVersion(!showOldVersion);
                    setNewCQ2DocumentOpenThreads([]);
                    setNewCQ2DocumentCurrentHighlights([]);
                  }}
                >
                  <PanelRight
                    className="mr-2 h-4 w-4 text-[#91918e]"
                    strokeWidth={2.5}
                  />{" "}
                  {showOldVersion ? "Hide" : "Show"} Version 1
                </Button>
              </>
            )}
          </div>
          <div className="ml-4 flex flex-row items-center justify-between space-x-1.5">
            {((CQ2Document.version1.content !== "" &&
              !CQ2Document.version1.is_concluded &&
              cq2UserName === CQ2Document.user_name) ||
              (CQ2Document._id === "demo" &&
                !CQ2Document.version1.is_concluded)) &&
              !pathname.includes("/v2") && (
                <>
                  <NVTLink
                    className="flex h-7 items-center justify-center rounded-lg border border-neutral-900 bg-gradient-to-b from-neutral-800 to-neutral-900 p-2 font-medium text-neutral-100 transition duration-200"
                    href={`/app/document/${CQ2Document._id}/v2/draft`}
                  >
                    <CirclePlus
                      className="mr-2 h-4 w-4 text-neutral-400"
                      strokeWidth={2.5}
                    />{" "}
                    New version
                  </NVTLink>
                </>
              )}
            {pathname.includes("/app/document/") &&
              CQ2Document._id === "demo" && (
                <>
                  <Link href="https://tally.so/r/meB0yJ">
                    <Button
                      className={` mr-0 h-7 rounded-lg border border-CQ2Orange-600 bg-gradient-to-b from-CQ2Orange-500 to-CQ2Orange-600 p-2 text-neutral-50 shadow-none duration-200`}
                    >
                      Get early access
                    </Button>
                  </Link>
                </>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppTopNav;
