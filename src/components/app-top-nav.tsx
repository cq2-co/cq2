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
  useDiscussionStore,
  useShowConcludeThreadCommentBoxStore,
} from "@/state";
import { ChevronRight, LifeBuoy, ListTree, Share2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const AppTopNav = () => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const { setShowConcludeThreadCommentBox } =
    useShowConcludeThreadCommentBoxStore();

  const pathname = usePathname();

  const [showTreePopover, setShowTreePopover] = useState(false);

  const concludedComment = discussion.comments.filter(
    (comment) => comment.is_conclusion === true,
  )[0];

  return (
    <div
      className={`${satoshi.className} z-50 hidden h-[2.5rem] w-screen items-center justify-between border-b bg-[#fafafa] text-sm md:flex`}
    >
      <div className="flex h-full w-[4rem] items-center justify-center border-r border-neutral-200">
        <Link href="/" className="flex w-fit items-center">
          <LogoSVGNeutral className="h-4" />
        </Link>
      </div>
      <div className="z-50 hidden w-[calc(100vw)] items-center justify-between pl-[0.9rem] pr-2 md:flex">
        <div className="flex flex-row items-center font-medium">
          <span className="text-neutral-700">Discussions</span>
          {pathname.includes("/app/discussions/") && (
            <>
              <ChevronRight
                className="mx-2 h-3 w-3 text-neutral-500"
                strokeWidth={3}
              />
              {discussion.title && (
                <span className="text-neutral-700">
                  {discussion.title} — {discussion.user_name}
                </span>
              )}
              {!discussion.title && (
                <Skeleton className="h-4 w-64 rounded-2xl pt-4" />
              )}
            </>
          )}
          {pathname === "/app/demo" && (
            <>
              <ChevronRight
                className="mx-2 inline-block h-3 w-3 text-neutral-500"
                strokeWidth={3}
              />
              {}
              <span className="text-neutral-700">
                AGI Ruin: A List of Lethalities — Eliezer (from{" "}
                <a
                  className="underline"
                  target="_blank"
                  href="https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities#sSfjskRzAuDcWmFWg"
                >
                  LessWrong
                </a>
                )
              </span>
            </>
          )}
          {pathname === "/app/new" && (
            <>
              <ChevronRight
                className="mx-2 inline-block h-3 w-3 text-neutral-500"
                strokeWidth={3}
              />
              {}
              <span className="text-neutral-700">New</span>
            </>
          )}
        </div>
        <div>
          <div className="flex flex-row">
            {pathname !== "/app/new" &&
              (pathname === "/app/demo" ||
                pathname.includes("/app/discussions/")) && (
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
                      className="cq2-hover-card w-fit rounded-2xl p-3"
                      align="end"
                      sideOffset={16}
                      onInteractOutside={(e) => {
                        if (e.target.id !== "cq2-tree-trigger") {
                          setShowTreePopover(false);
                        }
                      }}
                    >
                      <div className="max-h-[36rem] overflow-y-auto rounded-2xl bg-neutral-50 p-4">
                        <CQ2Tree
                          discussion={discussion}
                          setShowTreePopover={setShowTreePopover}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  {/* <Separator
                    className="mx-5 flex h-auto items-center bg-neutral-200"
                    orientation="vertical"
                  />
                  {concludedComment && (
                    <>
                      <span
                        className="norder flex h-6 cursor-pointer items-center border border-green-500 bg-green-500/5 px-2 py-1 font-medium text-neutral-600"
                        onClick={() => {
                          const concludedCommentInDOM = document.getElementById(
                            `0-${concludedComment.comment_id}`,
                          );
                          const topPos = concludedCommentInDOM.offsetTop;
                          document
                            .getElementById(
                              "discussions-threads-scrollable-container",
                            )
                            .scrollTo({
                              left: -999999,
                              behavior: "smooth",
                            });
                          document
                            .getElementById("document-main-thread")
                            .scrollTo({
                              top: topPos - 20,
                              behavior: "smooth",
                            });
                        }}
                      >
                        <CheckSquare
                          className="mr-2 h-3 w-3 text-green-500"
                          strokeWidth={3}
                        />
                        Discussion concluded by {concludedComment.user_name}
                      </span>
                    </>
                  )}
                  {((discussion.content !== "" && !concludedComment) ||
                    (pathname === "/app/demo" && !concludedComment)) && (
                    <>
                      <span
                        className="flex h-6 cursor-pointer items-center font-medium text-neutral-600"
                        onClick={() => {
                          setShowConcludeThreadCommentBox(true);
                          document
                            .getElementById(
                              "discussions-threads-scrollable-container",
                            )
                            .scrollTo({
                              left: -999999,
                              behavior: "smooth",
                            });
                        }}
                      >
                        <CheckSquare className="mr-2 h-3 w-3" strokeWidth={3} />
                        Conclude discussion
                      </span>
                    </>
                  )}
                  {discussion.content === "" && pathname !== "/app/demo" && (
                    <span className="flex items-center">
                      <Skeleton className="h-4 w-[9.38rem] rounded-2xl" />
                    </span>
                  )} */}
                  <Separator
                    className="mx-5 flex h-auto items-center bg-neutral-200"
                    orientation="vertical"
                  />
                  <span
                    className="flex h-6 cursor-pointer items-center font-medium text-neutral-600"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${NEXT_PUBLIC_BASE_URL}/app/discussions/${discussion._id}`,
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

            {(pathname === "/app/new" ||
              pathname === "/app/demo" ||
              pathname.includes("/app/discussions/")) && (
              <Popover>
                <PopoverTrigger asChild>
                  <span className="flex h-6 cursor-pointer items-center border-neutral-400 font-medium text-neutral-600">
                    <LifeBuoy className="mr-2 h-3 w-3" strokeWidth={3} />
                    Help
                  </span>
                </PopoverTrigger>
                <PopoverContent
                  className="cq2-hover-card w-[30rem] rounded-2xl p-3"
                  align="end"
                  sideOffset={16}
                >
                  <div
                    className={`flex max-h-[36rem] w-auto flex-col overflow-y-auto text-sm text-neutral-600`}
                  >
                    {pathname === "/app/new" && (
                      <div className="rounded-2xl bg-neutral-50 p-4">
                        To create a new discussion, provide a title and the
                        description. No login required, just your name. Share
                        the link with the participants to invite them.
                      </div>
                    )}
                    {(pathname === "/app/demo" ||
                      pathname.includes("/app/discussions/")) && (
                      <>
                        <div className="rounded-2xl bg-neutral-50 p-4">
                          <span className="mb-2 block font-medium text-neutral-800">
                            Commenting and creating threads
                          </span>
                          General comments about the discussion go below the
                          document. To reply to a particular text from the
                          document or from any comment, select the text, click
                          on the popped-up "Comment" button to create a new
                          thread around that specific quote, and reply there.
                        </div>
                        <div className="mt-3 rounded-2xl bg-neutral-50 p-4">
                          <span className="mb-2 block font-medium text-neutral-800">
                            Opening threads
                          </span>
                          If someone has already created a thread for a
                          particular quote, the quote would appear highlighted.
                          You can click on it to open its corresponding thread
                          and continue the discussion there.
                        </div>
                        <div className="mt-3 rounded-2xl bg-neutral-50 p-4">
                          <span className="mb-2 block font-medium text-neutral-800">
                            Navigation
                          </span>
                          To move between different threads, you can scroll
                          using a trackpad or using your mouse's scroll wheel
                          with the shift key. You can also use the tree from the
                          navigation bar to quickly go to a particular thread.
                          The tree also shows the number of comments in a
                          thread, the number of unread comments and whether the
                          thread has been concluded.
                        </div>
                        <div className="mt-3 rounded-2xl bg-neutral-50 p-4">
                          <span className="mb-2 block font-medium text-neutral-800">
                            Conclusion
                          </span>
                          You can conclude a thread by using the “Conclude
                          thread” button on top of the thread. To conclude the
                          whole discussion, use the “Conclude discussion” button
                          in the navigation bar.
                        </div>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {(pathname === "/app/demo" ||
              pathname.includes("/app/discussions/")) && (
              <>
                <Separator
                  className="mx-5 flex h-auto items-center bg-neutral-200"
                  orientation="vertical"
                />

                <Link href="https://tally.so/r/meB0yJ">
                  <Button
                    className={`${satoshi.className} mr-0 h-6 rounded-2xl border border-[#FF4F00] bg-[#FF4F00] p-2 text-neutral-50 shadow-none duration-100 hover:bg-[#FF4F00]/90`}
                  >
                    Get early access
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppTopNav;