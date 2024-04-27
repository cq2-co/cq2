"use client";

import Link from "next/link";
import { ChevronRight, Share2, ChevronDown, CheckSquare } from "lucide-react";
import { satoshi } from "@/app/fonts";
import { usePathname } from "next/navigation";
import LogoSVG from "@/components/logo-svg";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  useDiscussionStore,
  useShowConcludeThreadCommentBoxStore,
} from "@/state";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const TopNav = () => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const { setShowConcludeThreadCommentBox } =
    useShowConcludeThreadCommentBoxStore();

  const pathname = usePathname();

  const concludedComment = discussion.comments.filter(
    (comment) => comment.is_conclusion === true,
  )[0];

  return (
    <div
      className={`${satoshi.className} z-50 hidden h-[2.5rem] w-screen items-center justify-between border-b border-neutral-300 bg-[#FFFFFF] text-sm md:flex`}
    >
      <div className="flex h-full w-[4.8rem] items-center justify-center border-r border-neutral-200">
        <Link href="/" className="flex w-fit items-center" id="cq2-main-logo">
          <LogoSVG className="h-4 fill-black" />
        </Link>
      </div>
      <div className="z-50 hidden w-[calc(100vw)] items-center justify-between pl-[0.9rem] pr-2 md:flex">
        <div className="flex flex-row items-center font-medium">
          <Link href="/app" className="text-neutral-500 hover:underline">
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
                  {concludedComment && (
                    <>
                      <span
                        className="flex h-6 cursor-pointer items-center font-medium text-green-500"
                        onClick={() => {
                          const concludedCommentInDOM = document.getElementById(
                            `0-${concludedComment.comment_id}`,
                          );
                          const topPos = concludedCommentInDOM.offsetTop;
                          document
                            .getElementById("discussion-main-thread")
                            .scrollTo({
                              top: topPos - 59,
                              behavior: "smooth",
                            });
                        }}
                      >
                        <CheckSquare className="mr-2 h-3 w-3" strokeWidth={3} />
                        Discussion concluded by {concludedComment.user_name}
                      </span>
                    </>
                  )}
                  {discussion.content !== "" && !concludedComment && (
                    <>
                      <span
                        className="flex h-6 cursor-pointer items-center font-medium text-neutral-600"
                        onClick={() => {
                          setShowConcludeThreadCommentBox(true);
                          document
                            .getElementById("discussion-main-thread")
                            .scrollTo({
                              top: 999999,
                              behavior: "smooth",
                            });
                        }}
                      >
                        <CheckSquare className="mr-2 h-3 w-3" strokeWidth={3} />
                        Conclude discussion
                      </span>
                    </>
                  )}
                  {discussion.content === "" && (
                    <span className="flex items-center">
                      <Skeleton className="h-4 w-56 rounded-none" />
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
                  <span className="flex h-6 cursor-pointer items-center border-neutral-400 bg-white font-medium text-neutral-600">
                    Help{" "}
                    <ChevronDown
                      className="mx-1 inline-flex h-3 w-3"
                      strokeWidth={3}
                    />
                  </span>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[30rem] rounded-none p-3"
                  align="end"
                  sideOffset={16}
                >
                  <div
                    className={`${satoshi.className} flex w-auto flex-col text-base text-neutral-700`}
                  >
                    {pathname === "/app/new" && (
                      <div className="rounded-none bg-neutral-100 p-4">
                        To create a new discussion in CQ2, provide a title and
                        the description. No login required. Share the link with
                        the participants to invite them.
                      </div>
                    )}
                    {(pathname === "/app/demo" ||
                      pathname.includes("/app/discussions/")) && (
                      <>
                        <div className="rounded-none bg-neutral-100 p-4">
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
                        <div className="mt-3 rounded-none bg-neutral-100 p-4">
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
