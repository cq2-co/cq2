"use client";

import Link from "next/link";
import {
  ChevronRight,
  Share2,
  CheckSquare,
  ListTree,
  LifeBuoy,
} from "lucide-react";
import { satoshi } from "@/app/fonts";
import { usePathname } from "next/navigation";
import LogoSVG from "@/components/logo-svg";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  useDiscussionStore,
  useShowConcludeThreadCommentBoxStore,
} from "@/state";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CQ2Tree } from "@/lib/utils";
import { useState } from "react";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const TopNav = () => {
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
      <div className="flex h-full w-[4.8rem] items-center justify-center border-r border-neutral-200">
        <Link href="/" className="flex w-fit items-center" id="cq2-main-logo">
          <LogoSVG className="h-4 fill-black" />
        </Link>
      </div>
      <div className="z-50 hidden w-[calc(100vw)] items-center justify-between pl-[0.9rem] pr-2 md:flex">
        <div className="flex flex-row items-center font-medium">
          <Link href="/app" className="text-neutral-700">
            Discussions
          </Link>
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
                <Skeleton className="h-4 w-64 rounded-none pt-4" />
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
                        className="flex h-6 cursor-pointer items-center font-medium text-neutral-600"
                        onClick={() => setShowTreePopover(true)}
                      >
                        <ListTree className="mr-2 h-4 w-4" strokeWidth={2.5} />
                        Tree
                      </span>
                    </PopoverTrigger>
                    <PopoverContent
                      className="cq2-hover-card w-fit rounded-none p-3"
                      align="end"
                      sideOffset={16}
                      onInteractOutside={() => setShowTreePopover(false)}
                    >
                      <div className="rounded-none bg-neutral-50 p-4">
                        <CQ2Tree
                          discussion={discussion}
                          setShowTreePopover={setShowTreePopover}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Separator
                    className="mx-5 flex h-auto items-center bg-neutral-200"
                    orientation="vertical"
                  />
                  {concludedComment && (
                    <>
                      <span
                        className="flex h-6 cursor-pointer items-center bg-green-500 px-2 py-1 font-medium text-white"
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
                            .getElementById("discussion-main-thread")
                            .scrollTo({
                              top: topPos - 20,
                              behavior: "smooth",
                            });
                        }}
                      >
                        <CheckSquare className="mr-2 h-3 w-3" strokeWidth={3} />
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
                      <Skeleton className="h-4 w-[9.38rem] rounded-none" />
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
                  <span className="mr-3 flex h-6 cursor-pointer items-center border-neutral-400 font-medium text-neutral-600">
                    <LifeBuoy className="mr-2 h-3 w-3" strokeWidth={3} />
                    Help
                  </span>
                </PopoverTrigger>
                <PopoverContent
                  className="cq2-hover-card w-[30rem] rounded-none p-3"
                  align="end"
                  sideOffset={16}
                >
                  <div
                    className={`${satoshi.className} flex w-auto flex-col text-base text-neutral-700`}
                  >
                    {pathname === "/app/new" && (
                      <div className="rounded-none bg-neutral-50 p-4">
                        To create a new discussion in CQ2, provide a title and
                        the description. No login required. Share the link with
                        the participants to invite them.
                      </div>
                    )}
                    {(pathname === "/app/demo" ||
                      pathname.includes("/app/discussions/")) && (
                      <>
                        <div className="rounded-none bg-neutral-50 p-4">
                          General comments about the discussion go in the main
                          (first and leftmost) thread. To reply to a particular
                          text from the main description or from any comment,
                          select the text, click on the popped-up “Reply in new
                          thread” button to create a new thread around that
                          specific quote, and reply there. You can reply to the
                          whole comment as well, instead of a particular text
                          inside it, by using the reply button on the top-right
                          of the comment.
                        </div>
                        <div className="mt-3 rounded-none bg-neutral-50 p-4">
                          If someone has already created a thread for a
                          particular quote, the quote would appear highlighted.
                          You can click on it to open its corresponding thread
                          and continue the discussion there. If someone has
                          already created a thread for a whole comment, there
                          would be a highlighted comments button on the
                          top-right of the comment which you can click on to
                          open the corresponding thread.
                        </div>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
