"use client";

import { manrope } from "@/app/fonts";
import LogoSVGNeutral from "@/components/logo-svg-neutral";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CQ2Tree } from "@/lib/utils";
import {
  useCQ2DocumentCurrentHighlightsStore,
  useCQ2DocumentOpenThreadsStore,
  useCQ2DocumentStore,
  useShowOldVersionStore,
} from "@/state";
import {
  ArrowRight,
  CircleHelp,
  CreativeCommons,
  History,
  ListTree,
  PenLine,
  Share,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const [helpOpened, setHelpOpened] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("helpOpened")) {
        setHelpOpened(true);
      }
    }
  }, []);

  return (
    <div
      className={`${manrope.className} z-50 hidden h-[3rem] w-screen items-center justify-between px-4 text-sm md:flex`}
    >
      <div className="flex h-full items-center justify-center">
        <Link href="/" className="flex w-fit items-center">
          <LogoSVGNeutral className="h-4 fill-[#303030] transition duration-200 hover:fill-CQ2Orange-600" />
        </Link>
      </div>
      {CQ2Document.version1.content === "" &&
      pathname.includes("/app/document") ? (
        <>
          <span className="flex items-center pr-4">
            <Skeleton className="h-[1.75rem] w-[6rem] rounded-sm" />
            <Skeleton className="ml-3 h-[1.75rem] w-[6rem] rounded-sm" />
            <Skeleton className="ml-3 h-[1.75rem] w-[6rem] rounded-sm" />
            <Skeleton className="ml-3 h-[1.75rem] w-[6rem] rounded-sm" />
            <Skeleton className="ml-3 h-[1.75rem] w-[10rem] rounded-sm" />
          </span>
        </>
      ) : (
        <div className="z-50 hidden items-center justify-between pl-[0.9rem] pr-0 md:flex">
          <div className="flex flex-row items-center justify-between space-x-2">
            {pathname !== "/app/new" && pathname.includes("/app/document/") && (
              <>
                {!(pathname.includes("/v2") && !showOldVersion) && (
                  <>
                    <Popover open={showTreePopover}>
                      <PopoverTrigger asChild>
                        <Button
                          id="cq2-tree-trigger-btn"
                          className="h-7 rounded-sm p-2 text-[#5f5d5b] transition duration-200 hover:bg-[#f6f6f6]"
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
                        className="cq2-hover-card w-fit rounded-sm p-3"
                        sideOffset={9}
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
                        <div className="max-h-[36rem] overflow-y-auto rounded-sm bg-neutral-50 p-4">
                          <CQ2Tree
                            CQ2Document={CQ2Document}
                            setShowTreePopover={setShowTreePopover}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </>
                )}
                {pathname.includes("/v2") && (
                  <>
                    <Button
                      className="h-7 rounded-sm p-2 text-[#5f5d5b] transition duration-200 hover:bg-[#f6f6f6]"
                      variant={"ghost"}
                      onClick={() => {
                        setShowOldVersion(!showOldVersion);
                        setNewCQ2DocumentOpenThreads([]);
                        setNewCQ2DocumentCurrentHighlights([]);
                      }}
                    >
                      <History
                        className="mr-2 h-4 w-4 text-[#91918e]"
                        strokeWidth={2.5}
                      />{" "}
                      {showOldVersion ? "Hide" : "Show"} draft
                    </Button>
                  </>
                )}
                <Button
                  className="h-7 rounded-sm p-2 text-[#5f5d5b] transition duration-200 hover:bg-[#f6f6f6]"
                  variant={"ghost"}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${NEXT_PUBLIC_BASE_URL}/app/document/${
                        CQ2Document._id
                      }/${CQ2Document.version1.is_resolved ? "v2" : "v1"}`,
                    );
                    toast("Link copied to clipboard");
                  }}
                >
                  <Share
                    className="mr-2 h-4 w-4 text-[#91918e]"
                    strokeWidth={2.5}
                  />{" "}
                  Share
                </Button>
              </>
            )}
            {((CQ2Document.version1.content !== "" &&
              !CQ2Document.version1.is_resolved &&
              cq2UserName === CQ2Document.user_name) ||
              (CQ2Document._id === "demo" &&
                !CQ2Document.version1.is_resolved)) &&
              !pathname.includes("/v2") && (
                <>
                  <Link
                    className="ml-2 flex items-center justify-center p-0"
                    href={`/app/document/${CQ2Document._id}/v2/draft`}
                  >
                    <Button
                      className="h-7 rounded-sm p-2 text-[#5f5d5b] transition duration-200 hover:bg-[#f6f6f6]"
                      variant={"ghost"}
                    >
                      <PenLine
                        className="mr-2 h-4 w-4 text-[#91918e]"
                        strokeWidth={2.5}
                      />{" "}
                      Create final version
                    </Button>
                  </Link>
                </>
              )}
            {CQ2Document._id === "demo" && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="h-7 rounded-sm p-2 text-[#5f5d5b] transition duration-200 hover:bg-[#f6f6f6]"
                      variant={"ghost"}
                    >
                      <CreativeCommons
                        className="mr-2 h-4 w-4 text-[#91918e]"
                        strokeWidth={2.5}
                      />{" "}
                      Source
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[32rem]"
                    align="end"
                    sideOffset={16}
                  >
                    <div className="flex rounded-sm bg-neutral-50 p-4">
                      <div className="space-y-5 text-sm">
                        <p className="text-neutral-700">
                          This demo was created using the material mentioned
                          below. The title of the material and the names of the
                          authors have been modified to indicate that they don't
                          endorse CQ2 or its use.
                        </p>
                        <Separator className="my-5" />
                        <p>
                          <span className="mb-1 block font-semibold">
                            Title
                          </span>
                          <span className="text-neutral-500">
                            PEP 736: Shorthand syntax for keyword arguments at
                            invocation
                          </span>
                        </p>
                        <p>
                          <span className="mb-1 block font-semibold">
                            Authors
                          </span>
                          <span className="text-neutral-500">
                            Joshua Bambrick, Chris Angelico, and commenters
                          </span>
                        </p>
                        <p>
                          <span className="mb-1 block font-semibold">
                            Source
                          </span>
                          <span className="text-neutral-500 underline">
                            <Link href="https://discuss.python.org/t/pep-736-shorthand-syntax-for-keyword-arguments-at-invocation/43432">
                              Discourse thread
                            </Link>
                          </span>
                        </p>
                        <p>
                          <span className="mb-1 block font-semibold">
                            License
                          </span>
                          <span className="text-neutral-500 underline">
                            <Link href="https://creativecommons.org/licenses/by-nc-sa/3.0/deed.en">
                              CC BY-NC-SA 3.0
                            </Link>
                          </span>
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            )}
            {pathname.includes("/app/document/") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={`relative h-7 rounded-sm p-2 text-[#5f5d5b] transition duration-200 hover:bg-[#f6f6f6] ${
                      !helpOpened
                        ? "border border-CQ2Orange-600 text-CQ2Orange-600 hover:bg-CQ2Orange-600/5 hover:text-CQ2Orange-600"
                        : "text-[#5f5d5b]"
                    }`}
                    variant={"ghost"}
                    onClick={() => {
                      if (typeof window !== "undefined" && !helpOpened) {
                        localStorage.setItem("helpOpened", "true");
                        setHelpOpened(true);
                      }
                    }}
                  >
                    <CircleHelp
                      className={`mr-2 h-4 w-4 ${
                        !helpOpened ? "text-CQ2Orange-600" : "text-[#91918e] "
                      }`}
                      strokeWidth={!helpOpened ? 2 : 2.5}
                    />{" "}
                    Help
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="cq2-hover-card w-[30rem] rounded-sm p-3"
                  align="end"
                  sideOffset={16}
                >
                  {pathname.includes("/app/document/") && (
                    <div
                      className={`flex max-h-[36rem] w-auto flex-col overflow-y-auto text-sm text-neutral-500`}
                    >
                      <div className="rounded-sm bg-neutral-50 p-4">
                        <span className="mb-2 block font-medium text-neutral-800">
                          Commenting and creating threads
                        </span>
                        General comments go below the RFC. To reply to a
                        particular text from the RFC or from any comment in a
                        new thread, select the text, click on the popped-up
                        "Comment in new thread" button, and comment there.
                      </div>
                      <div className="mt-3 rounded-sm bg-neutral-50 p-4">
                        <span className="mb-2 block font-medium text-neutral-800">
                          Opening threads
                        </span>
                        If someone has already created a thread for a particular
                        quote, the quote would appear highlighted yellow. You
                        can click on it to open the corresponding thread and
                        continue the discussion there.
                      </div>
                      <div className="mt-3 rounded-sm bg-neutral-50 p-4">
                        <span className="mb-2 block font-medium text-neutral-800">
                          Navigation
                        </span>
                        To move between different threads, you can scroll using
                        a trackpad or using your mouse's scroll wheel with the
                        shift key. You can also use the "Threads" tree from the
                        navigation bar to quickly go to a particular thread. The
                        tree also tells you the number of comments in a thread,
                        unread comments if any and whether the thread has been
                        resolved or not.
                      </div>
                      <div className="mt-3 rounded-sm bg-neutral-50 p-4">
                        <span className="mb-2 block font-medium text-neutral-800">
                          Resolving threads
                        </span>
                        When a discussion on a thread is complete, it can be
                        resolved to make it easier to find threads that need to
                        be addressed. You can resolve a thread both with or
                        without a new comment using the options in the thread's
                        menu.
                      </div>
                      <div className="mt-3 rounded-sm bg-neutral-50 p-4">
                        <span className="mb-2 block font-medium text-neutral-800">
                          Final version
                        </span>
                        After the discussion is over, click the "Create final
                        version" button in navigation bar to create the final
                        version for the RFC. Update the RFC with the changes.
                        Use the "Show draft" button to see the draft version
                        along with the comments if needed. Once done, click the
                        "Publish" button at the bottom to publish the new
                        version.
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>
          {pathname.includes("/app/document/") && (
            <div className="ml-4 flex flex-row items-center justify-between space-x-1.5">
              <Link href="/app">
                <Button
                  className={`group mr-0 h-7 rounded-sm border border-CQ2Orange-600 bg-CQ2Orange-600 p-2 text-neutral-50 shadow-none transition duration-200 hover:border-CQ2Orange-500 hover:bg-CQ2Orange-500`}
                >
                  Try app
                  <ArrowRight
                    className="ml-2 h-4 w-4 transition duration-200 group-hover:-rotate-45"
                    strokeWidth={2}
                  />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppTopNav;
