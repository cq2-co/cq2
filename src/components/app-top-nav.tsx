"use client";

import { satoshi } from "@/app/fonts";
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
  useCQ2DocumentOpenThreadsStore,
  useCQ2DocumentStore,
  useShowLatestVersionEditorStore,
  useShowOldVersionStore,
} from "@/state";
import { CheckCircle, History, LifeBuoy, ListTree, Share2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const AppTopNav = () => {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const { showLatestVersionEditor, setShowLatestVersionEditor } =
    useShowLatestVersionEditorStore();
  const { showOldVersion, setShowOldVersion } = useShowOldVersionStore();
  const { CQ2DocumentOpenThreads, setNewCQ2DocumentOpenThreads } =
    useCQ2DocumentOpenThreadsStore();

  const pathname = usePathname();

  const [showTreePopover, setShowTreePopover] = useState(false);

  return (
    <div
      className={`z-50 hidden h-[2.5rem] w-screen items-center justify-between border-b border-[#EDEDED] bg-[#f7f7f5] text-sm md:flex`}
    >
      <div className="flex h-full w-[4rem] items-center justify-center">
        <Link href="/app" className="flex w-fit items-center">
          <LogoSVGNeutral className="h-4" />
        </Link>
      </div>
      <div className="z-50 hidden items-center justify-between pl-[0.9rem] pr-2 md:flex">
        <div className="flex flex-row">
          {pathname !== "/app/new" &&
            (pathname === "/app/demo" ||
              pathname.includes("/app/document/")) && (
              <>
                <Popover open={showTreePopover}>
                  <PopoverTrigger asChild>
                    <span
                      id="cq2-tree-trigger"
                      className="flex h-6 cursor-pointer items-center font-medium text-neutral-600"
                      onClick={() => setShowTreePopover(!showTreePopover)}
                    >
                      <ListTree className="mr-2 h-4 w-4" strokeWidth={2.5} />
                      Tree
                    </span>
                  </PopoverTrigger>
                  <PopoverContent
                    className="cq2-hover-card w-fit rounded-xl p-3"
                    align="end"
                    sideOffset={16}
                    onInteractOutside={(e) => {
                      if (e.target.id !== "cq2-tree-trigger") {
                        setShowTreePopover(false);
                      }
                    }}
                  >
                    <div className="max-h-[36rem] overflow-y-auto rounded-xl bg-neutral-50 p-4">
                      <CQ2Tree
                        CQ2Document={CQ2Document}
                        setShowTreePopover={setShowTreePopover}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Separator
                  className="mx-5 flex h-auto items-center bg-neutral-200"
                  orientation="vertical"
                />
                {((CQ2Document.version1.content !== "" &&
                  !CQ2Document.version1.is_concluded) ||
                  (pathname === "/app/demo" &&
                    !CQ2Document.version1.is_concluded)) && (
                  <>
                    <span
                      className="flex h-6 cursor-pointer items-center font-medium text-neutral-600"
                      onClick={() => {
                        setShowLatestVersionEditor(!showLatestVersionEditor);
                        document
                          .getElementById(
                            "CQ2Document-threads-scrollable-container",
                          )
                          .scrollTo({
                            left: -999999,
                            behavior: "smooth",
                          });
                      }}
                    >
                      <CheckCircle className="mr-2 h-3 w-3" strokeWidth={3} />
                      Conclude
                    </span>
                  </>
                )}
                {CQ2Document.version1.is_concluded && (
                  <>
                    <span
                      className="flex h-6 cursor-pointer items-center font-medium text-neutral-600"
                      onClick={() => {
                        setShowOldVersion(!showOldVersion);
                        setNewCQ2DocumentOpenThreads([]);
                      }}
                    >
                      <History className="mr-2 h-3 w-3" strokeWidth={3} />
                      Previous version
                    </span>
                  </>
                )}
                {CQ2Document.version1.content === "" &&
                  pathname !== "/app/demo" && (
                    <span className="flex items-center">
                      <Skeleton className="h-4 w-[5.25rem] rounded-xl" />
                    </span>
                  )}
                <Separator
                  className="mx-5 flex h-auto items-center bg-neutral-200"
                  orientation="vertical"
                />
                <span
                  className="flex h-6 cursor-pointer items-center font-medium text-neutral-600"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${NEXT_PUBLIC_BASE_URL}/app/document/${CQ2Document._id}`,
                    );
                    toast("Link copied to clipboard");
                  }}
                >
                  <Share2 className="mr-2 h-3 w-3" strokeWidth={3} />
                  Share
                </span>
                <Separator
                  className="mx-5 flex h-auto items-center bg-neutral-200"
                  orientation="vertical"
                />
              </>
            )}
          {(pathname === "/app/demo" ||
            pathname.includes("/app/document/")) && (
            <Popover>
              <PopoverTrigger asChild>
                <span className="flex h-6 cursor-pointer items-center border-neutral-400 font-medium text-neutral-600">
                  <LifeBuoy className="mr-2 h-3 w-3" strokeWidth={3} />
                  Help
                </span>
              </PopoverTrigger>
              <PopoverContent
                className="cq2-hover-card w-[30rem] rounded-xl p-3"
                align="end"
                sideOffset={16}
              >
                {(pathname === "/app/demo" ||
                  pathname.includes("/app/document/")) && (
                  <div
                    className={`flex max-h-[36rem] w-auto flex-col overflow-y-auto text-sm text-neutral-600`}
                  >
                    <div className="rounded-xl bg-neutral-50 p-4">
                      <span className="mb-2 block font-medium text-neutral-800">
                        Commenting and creating threads
                      </span>
                      General comments about the document go below the document.
                      To reply to a particular text from the document or from
                      any comment, select the text, click on the popped-up
                      "Comment" button to create a new thread around that
                      specific quote, and reply there.
                    </div>
                    <div className="mt-3 rounded-xl bg-neutral-50 p-4">
                      <span className="mb-2 block font-medium text-neutral-800">
                        Opening threads
                      </span>
                      If someone has already created a thread for a particular
                      quote, the quote would appear highlighted. You can click
                      on it to open its corresponding thread and continue the
                      discussion there.
                    </div>
                    <div className="mt-3 rounded-xl bg-neutral-50 p-4">
                      <span className="mb-2 block font-medium text-neutral-800">
                        Navigation
                      </span>
                      To move between different threads, you can scroll using a
                      trackpad or using your mouse's scroll wheel with the shift
                      key. You can also use the tree from the navigation bar to
                      quickly go to a particular thread. The tree also shows the
                      number of comments in a thread, the number of unread
                      comments and whether the thread has been concluded.
                    </div>
                    <div className="mt-3 rounded-xl bg-neutral-50 p-4">
                      <span className="mb-2 block font-medium text-neutral-800">
                        Conclusion
                      </span>
                      You can conclude threads by using the “Conclude thread”
                      button in the thread's menu. When the discussion is over,
                      click the "Conclude" button in the menu. Then update the
                      document and click on "Publish" to publish the new
                      version.
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}
          {(pathname === "/app/demo" ||
            pathname.includes("/app/document/")) && (
            <>
              <Separator
                className="mx-5 flex h-auto items-center bg-neutral-200"
                orientation="vertical"
              />

              <Link href="https://tally.so/r/meB0yJ">
                <Button
                  className={`${satoshi.className} mr-0 h-6 rounded-xl border border-[#FF4F00] bg-[#FF4F00] p-2 text-neutral-50 shadow-none duration-100 hover:bg-[#FF4F00]/90`}
                >
                  Get early access
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppTopNav;
