"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  getNewCQ2DocumentCurrentHighlightsFromCurrentHighlights,
  getNewCQ2DocumentOpenThreads,
} from "@/lib/utils";
import {
  useCQ2DocumentCurrentHighlightsStore,
  useCQ2DocumentOpenThreadsStore,
  useCQ2DocumentStore,
  useShowThreadInfoBoxStore,
  useThreadInfoBoxCoordsStore,
  useThreadInfoBoxThreadIDStore,
} from "@/state";
import dayjs from "dayjs";
import parse from "html-react-parser";
import { useEffect } from "react";
import ContentWithHighlight from "./content-with-highlight";

const V2V1ChildThread = ({ threadID }) => {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const { CQ2DocumentOpenThreads, setNewCQ2DocumentOpenThreads } =
    useCQ2DocumentOpenThreadsStore();
  const { CQ2DocumentCurrentHighlights, setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();

  const { showThreadInfoBox, setShowThreadInfoBox } =
    useShowThreadInfoBoxStore();
  const { threadInfoBoxThreadID, setThreadInfoBoxThreadID } =
    useThreadInfoBoxThreadIDStore();
  const { threadInfoBoxCoords, setThreadInfoBoxCoords } =
    useThreadInfoBoxCoordsStore();

  useEffect(() => {
    setTimeout(() => {
      document
        .getElementById("CQ2Document-threads-scrollable-container")
        .scrollTo({
          left: 999999,
          behavior: "smooth",
        });
    }, 30);
  }, [CQ2DocumentOpenThreads]);

  const thread = CQ2Document.version1.threads.filter(
    (thread) => thread.thread_id === threadID,
  )[0];

  const resolvedComment = thread.comments.filter(
    (comment) => comment.is_resolution === true,
  )[0];

  useEffect(() => {
    let hidePopupTimeout;

    for (let c = 0; c < thread.comments.length; c++) {
      const hightlightsInComments = thread.comments[c].highlights;

      for (let i = 0; i < hightlightsInComments.length; i++) {
        const highlight = hightlightsInComments[i];

        document
          .querySelectorAll(
            `span[data-info='${highlight.thread_id}-${highlight.comment_id}-${highlight.highlight_id}-${highlight.to_thread_id}']`,
          )
          .forEach((highlightSpan) => {
            highlightSpan.addEventListener("click", function (e) {
              e.preventDefault();
              e.stopPropagation();

              setNewCQ2DocumentOpenThreads(
                getNewCQ2DocumentOpenThreads(
                  highlight.to_thread_id,
                  CQ2Document,
                ),
              );
              setNewCQ2DocumentCurrentHighlights(
                getNewCQ2DocumentCurrentHighlightsFromCurrentHighlights(
                  highlight,
                  CQ2DocumentCurrentHighlights,
                ),
              );

              setShowThreadInfoBox(false);
            });

            highlightSpan.addEventListener("mouseover", function (e) {
              e.preventDefault();
              e.stopPropagation();

              clearTimeout(hidePopupTimeout);

              let lastHighlightSpan;

              if (
                (e.target.nodeName === "SPAN" &&
                  e.target.className !== "cq2-highlight-span-active") ||
                e.target.closest("span").className !==
                  "cq2-highlight-span-active"
              ) {
                document
                  .querySelectorAll(
                    `span[data-info='${highlightSpan.dataset.info}']`,
                  )
                  .forEach((highlightSpanElement) => {
                    highlightSpanElement.className =
                      "cq2-highlight-span-inactive-hover";

                    [
                      ...highlightSpanElement.getElementsByTagName("code"),
                    ].forEach((codeElement) => {
                      codeElement.className =
                        "cq2-highlight-span-inactive-hover";
                    });

                    lastHighlightSpan = highlightSpanElement;
                  });

                const highlightSpanBounds =
                  lastHighlightSpan.getBoundingClientRect();

                const CQ2DocumentsThreadsScrollableContainer =
                  document.getElementById(
                    "CQ2Document-threads-scrollable-container",
                  );

                let xCoord =
                  highlightSpanBounds.right +
                  CQ2DocumentsThreadsScrollableContainer?.scrollLeft +
                  10;

                let yCoord =
                  highlightSpanBounds.top - 20 - window.innerHeight / 2;

                if (
                  xCoord + 352 >=
                  document.documentElement.clientWidth +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft
                ) {
                  xCoord =
                    highlightSpanBounds.left +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                    372;
                }

                const CQ2DocumentsThreadsScrollableContainerHeightMid =
                  CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                    .height /
                    2 -
                  456;

                if (yCoord > CQ2DocumentsThreadsScrollableContainerHeightMid) {
                  yCoord = CQ2DocumentsThreadsScrollableContainerHeightMid;
                }

                setThreadInfoBoxCoords({
                  x: xCoord,
                  y: yCoord,
                });
                setThreadInfoBoxThreadID(highlight.to_thread_id);
                setShowThreadInfoBox(true);
              }
            });

            highlightSpan.addEventListener("mouseout", function (e) {
              e.preventDefault();
              e.stopPropagation();

              if (
                (e.target.nodeName === "SPAN" &&
                  e.target.className !== "cq2-highlight-span-active") ||
                e.target.closest("span").className !==
                  "cq2-highlight-span-active"
              ) {
                document
                  .querySelectorAll(
                    `span[data-info='${highlightSpan.dataset.info}']`,
                  )
                  .forEach((highlightSpanElement) => {
                    highlightSpanElement.className =
                      "cq2-highlight-span-inactive";

                    [
                      ...highlightSpanElement.getElementsByTagName("code"),
                    ].forEach((codeElement) => {
                      codeElement.className = "cq2-highlight-span-inactive";
                    });
                  });
              }

              let isMouseInsideThreadInfoPopup = false;

              const threadInfoBox = document.getElementById("thread-info-box");

              document.body.addEventListener("mousemove", function (e) {
                if (threadInfoBox && threadInfoBox.contains(e.target)) {
                  isMouseInsideThreadInfoPopup = true;
                }
              });

              if (threadInfoBox) {
                threadInfoBox.addEventListener("mouseleave", function () {
                  setShowThreadInfoBox(false);
                });
              }

              hidePopupTimeout = setTimeout(function () {
                if (!isMouseInsideThreadInfoPopup) {
                  setShowThreadInfoBox(false);
                }
              }, 500);
            });
          });
      }
    }

    return () => {
      for (let c = 0; c < thread.comments.length; c++) {
        const hightlightsInComments = thread.comments[c].highlights;

        for (let i = 0; i < hightlightsInComments.length; i++) {
          const highlight = hightlightsInComments[i];

          document
            .querySelectorAll(
              `span[data-info='${highlight.thread_id}-${highlight.comment_id}-${highlight.highlight_id}-${highlight.to_thread_id}']`,
            )
            .forEach((highlightSpan) => {
              highlightSpan.removeEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                setNewCQ2DocumentOpenThreads(
                  getNewCQ2DocumentOpenThreads(
                    highlight.to_thread_id,
                    CQ2Document,
                  ),
                );
                setNewCQ2DocumentCurrentHighlights(
                  getNewCQ2DocumentCurrentHighlightsFromCurrentHighlights(
                    highlight,
                    CQ2DocumentCurrentHighlights,
                  ),
                );

                setShowThreadInfoBox(false);
              });

              highlightSpan.removeEventListener("mouseover", function (e) {
                e.preventDefault();
                e.stopPropagation();

                clearTimeout(hidePopupTimeout);

                let lastHighlightSpan;

                if (
                  (e.target.nodeName === "SPAN" &&
                    e.target.className !== "cq2-highlight-span-active") ||
                  e.target.closest("span").className !==
                    "cq2-highlight-span-active"
                ) {
                  document
                    .querySelectorAll(
                      `span[data-info='${highlightSpan.dataset.info}']`,
                    )
                    .forEach((highlightSpanElement) => {
                      highlightSpanElement.className =
                        "cq2-highlight-span-inactive-hover";

                      [
                        ...highlightSpanElement.getElementsByTagName("code"),
                      ].forEach((codeElement) => {
                        codeElement.className =
                          "cq2-highlight-span-inactive-hover";
                      });

                      lastHighlightSpan = highlightSpanElement;
                    });

                  const highlightSpanBounds =
                    lastHighlightSpan.getBoundingClientRect();

                  const CQ2DocumentsThreadsScrollableContainer =
                    document.getElementById(
                      "CQ2Document-threads-scrollable-container",
                    );

                  let xCoord =
                    highlightSpanBounds.right +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft +
                    10;

                  let yCoord =
                    highlightSpanBounds.top - 20 - window.innerHeight / 2;

                  if (
                    xCoord + 352 >=
                    document.documentElement.clientWidth +
                      CQ2DocumentsThreadsScrollableContainer?.scrollLeft
                  ) {
                    xCoord =
                      highlightSpanBounds.left +
                      CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                      372;
                  }

                  const CQ2DocumentsThreadsScrollableContainerHeightMid =
                    CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                      .height /
                      2 -
                    456;

                  if (
                    yCoord > CQ2DocumentsThreadsScrollableContainerHeightMid
                  ) {
                    yCoord = CQ2DocumentsThreadsScrollableContainerHeightMid;
                  }

                  setThreadInfoBoxCoords({
                    x: xCoord,
                    y: yCoord,
                  });
                  setThreadInfoBoxThreadID(highlight.to_thread_id);
                  setShowThreadInfoBox(true);
                }
              });

              highlightSpan.removeEventListener("mouseout", function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (
                  (e.target.nodeName === "SPAN" &&
                    e.target.className !== "cq2-highlight-span-active") ||
                  e.target.closest("span").className !==
                    "cq2-highlight-span-active"
                ) {
                  document
                    .querySelectorAll(
                      `span[data-info='${highlightSpan.dataset.info}']`,
                    )
                    .forEach((highlightSpanElement) => {
                      highlightSpanElement.className =
                        "cq2-highlight-span-inactive";

                      [
                        ...highlightSpanElement.getElementsByTagName("code"),
                      ].forEach((codeElement) => {
                        codeElement.className = "cq2-highlight-span-inactive";
                      });
                    });
                }

                let isMouseInsideThreadInfoPopup = false;

                const threadInfoBox =
                  document.getElementById("thread-info-box");

                document.body.removeEventListener("mousemove", function (e) {
                  if (threadInfoBox && threadInfoBox.contains(e.target)) {
                    isMouseInsideThreadInfoPopup = true;
                  }
                });

                if (threadInfoBox) {
                  threadInfoBox.removeEventListener("mouseleave", function () {
                    setShowThreadInfoBox(false);
                  });
                }

                hidePopupTimeout = setTimeout(function () {
                  if (!isMouseInsideThreadInfoPopup) {
                    setShowThreadInfoBox(false);
                  }
                }, 500);
              });
            });
        }
      }
    };
  }, [CQ2Document, threadID, thread.comments]);

  const threadHighlightsCount = thread.comments.reduce(
    (acc, comment) => acc + comment.highlights.length,
    0,
  );

  return (
    <div
      className={`CQ2Document-child-thread relative mr-4 flex h-[calc(100vh-4rem)] w-[calc((100vw/2)-1.5rem)] flex-col rounded-sm bg-[#EDEDED] p-2 shadow-none 2xl:w-[45.5rem]`}
    >
      <div
        className={`sticky top-0 z-40 flex flex-row justify-between rounded-t-sm border-b border-[#EDEDED] bg-[#FFFFFF] px-4 py-2 text-sm font-normal text-neutral-400`}
      >
        <div className={`flex items-center`}>
          <span className="mr-1 text-neutral-600">
            {thread.comments.length}
          </span>
          {thread.comments.length === 1 ? "comment" : "comments"}
          <span className="mx-2">·</span>
          <span className="mr-1 text-neutral-600">{threadHighlightsCount}</span>
          {" child "}
          {threadHighlightsCount === 1 ? "thread" : "threads"}
        </div>
        {resolvedComment && (
          <span
            className="cursor-pointer rounded-sm bg-green-50 px-2 py-0 font-medium text-green-600"
            onClick={() => {
              const resolvedCommentInDOM = document.getElementById(
                `${threadID}-${resolvedComment.comment_id}`,
              );
              const topPos = resolvedCommentInDOM.offsetTop;
              document.getElementById(`child-thread-${threadID}`).scrollTo({
                top: topPos - 20,
                behavior: "smooth",
              });
            }}
          >
            Resolved
          </span>
        )}
      </div>
      <div
        id={`child-thread-${threadID}`}
        className="flex h-full flex-col overflow-y-scroll rounded-b-sm bg-[#fff]"
      >
        <div className={`mx-4 mb-8 mt-5`}>
          <div className="mb-2 flex flex-row items-center">
            <Avatar className="mr-3 flex h-7 w-7 text-xs">
              <AvatarImage src="" />
              <AvatarFallback>{thread.quote_by[0]}</AvatarFallback>
            </Avatar>
            <span className={`flex text-sm font-semibold text-neutral-700`}>
              {thread.quote_by}
            </span>
          </div>
          <div className="ml-[2.5rem] border-l-[6px] border-CQ2Orange-600/50 pl-3 text-neutral-700">
            {parse(thread.quote)}
          </div>
        </div>
        <div>
          {thread.comments.map((comment, idx) => (
            <div
              className={`${
                comment.comment_id === thread.comments.length - 1
              } group relative w-full px-4 pb-8`}
              key={comment.comment_id}
              id={`${threadID}-${comment.comment_id}`}
            >
              <Separator className="mb-8" />
              <div
                className={`mb-2 flex h-6 flex-row justify-between text-sm font-semibold text-neutral-700`}
              >
                <div
                  id="comment-name-created-on"
                  className="flex flex-row items-center"
                >
                  <Avatar className="mr-3 h-7 w-7 text-xs">
                    <AvatarImage src="" />
                    <AvatarFallback>{comment.user_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span>{comment.user_name}</span>
                    <span className="ml-3 text-xs font-normal text-neutral-400">
                      {dayjs(comment.created_on).format("MMM DD, YYYY")},{" "}
                      {dayjs(comment.created_on).format("hh:mm A")}
                    </span>
                    {comment.is_resolution && (
                      <span className="ml-3 text-xs font-normal text-green-600">
                        Resolution
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {!comment.for_child_thread_created ? (
                <div className="ml-[2.5rem]">
                  <ContentWithHighlight
                    containerId={`${threadID}-${comment.comment_id}-text-container`}
                    content={comment.content}
                    highlights={comment.highlights}
                    CQ2DocumentCurrentHighlights={CQ2DocumentCurrentHighlights}
                  />
                </div>
              ) : (
                <div className="ml-[2.5rem]">
                  <span className="text-neutral-400">
                    Created a new thread for:
                  </span>{" "}
                  <span
                    className="cursor-pointer font-medium text-neutral-600 underline"
                    onClick={() => {
                      const forNewThreadCreatedParentComment =
                        document.getElementById(
                          `${threadID}-${comment.for_child_thread_created_parent_comment_id}`,
                        );
                      const topPos = forNewThreadCreatedParentComment.offsetTop;
                      document
                        .getElementById(`child-thread-${threadID}`)
                        .scrollTo({
                          top: topPos - 35,
                          behavior: "smooth",
                        });
                    }}
                  >
                    {comment.for_child_thread_created_quote}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default V2V1ChildThread;
