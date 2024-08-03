"use client";

import { manrope } from "@/app/fonts";
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
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import ContentWithHighlight from "./content-with-highlight";

const V2V1DocThread = () => {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();

  const { setNewCQ2DocumentOpenThreads } = useCQ2DocumentOpenThreadsStore();
  const { CQ2DocumentCurrentHighlights, setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();
  const { showThreadInfoBox, setShowThreadInfoBox } =
    useShowThreadInfoBoxStore();
  const { threadInfoBoxThreadID, setThreadInfoBoxThreadID } =
    useThreadInfoBoxThreadIDStore();
  const { threadInfoBoxCoords, setThreadInfoBoxCoords } =
    useThreadInfoBoxCoordsStore();

  useEffect(() => {
    const docContentContainer = document.getElementById(
      "document-content-container",
    );

    const CQ2DocumentDocThread = document.getElementById("document-doc-thread");

    if (
      !CQ2DocumentDocThread ||
      !docContentContainer ||
      !docContentContainer.innerHTML
    )
      return;

    let hidePopupTimeout;

    for (let i = 0; i < CQ2Document.version1.highlights.length; i++) {
      const highlight = CQ2Document.version1.highlights[i];

      document
        .querySelectorAll(
          `span[data-info='${highlight.thread_id}-${highlight.comment_id}-${highlight.highlight_id}-${highlight.to_thread_id}']`,
        )
        .forEach((highlightSpan) => {
          highlightSpan.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            setNewCQ2DocumentOpenThreads(
              getNewCQ2DocumentOpenThreads(highlight.to_thread_id, CQ2Document),
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
              e.target.closest("span").className !== "cq2-highlight-span-active"
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
                    codeElement.className = "cq2-highlight-span-inactive-hover";
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
              e.target.closest("span").className !== "cq2-highlight-span-active"
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

    return () => {
      for (let i = 0; i < CQ2Document.version1.highlights.length; i++) {
        const highlight = CQ2Document.version1.highlights[i];

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

              const threadInfoBox = document.getElementById("thread-info-box");

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
    };
  }, [CQ2Document]);

  useEffect(() => {
    let hidePopupTimeout;

    for (let c = 0; c < CQ2Document.version1.comments.length; c++) {
      const hightlightsInComments = CQ2Document.version1.comments[c].highlights;

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
      for (let c = 0; c < CQ2Document.version1.comments.length; c++) {
        const hightlightsInComments =
          CQ2Document.version1.comments[c].highlights;

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
  }, [CQ2Document]);

  return (
    <div
      id="document-doc-thread"
      className={`mr-4 flex h-[calc(100vh-4rem)] w-[calc(((100vw)/2)-0.5rem)] flex-col items-center overflow-y-scroll bg-[#FFFFFF] py-8 shadow-none 2xl:w-[45.5rem]`}
      data-is-full="false"
    >
      <div className="w-full">
        <h5
          className={`${manrope.className} mx-4 mb-5 w-fit rounded-sm bg-CQ2Orange-50 px-1 py-0 text-xs font-medium tracking-wider text-CQ2Orange-600`}
        >
          DRAFT
        </h5>
        <h1 className="w-full appearance-none border-none px-4 text-4xl font-semibold leading-tight text-[#37362f]">
          {CQ2Document.version1.title}
        </h1>
        <div className="mt-5 px-4 text-base font-normal text-neutral-600">
          <span className="mr-2 text-neutral-400">by</span>
          {CQ2Document.user_name}
        </div>
        <div className="mt-1 px-4 text-base font-normal text-neutral-600">
          <span className="mr-2 text-neutral-400">on</span>
          {dayjs(CQ2Document.version1.created_on).format("MMM DD YYYY")}
          {", "}
          {dayjs(CQ2Document.version1.created_on).format("hh:mm A")}
        </div>
        <div className="px-4">
          <Separator className="mt-16" />
        </div>
        <div className="relative px-4 pb-16 pt-16">
          <ContentWithHighlight
            containerId="document-content-container"
            content={CQ2Document.version1.content}
            highlights={CQ2Document.version1.highlights}
            CQ2DocumentCurrentHighlights={CQ2DocumentCurrentHighlights}
          />
        </div>
        <div className="px-5">
          {CQ2Document.version1.comments.length > 0 && (
            <>
              <Separator className="mb-12 mt-8" />
              <div className="mb-10 flex items-center text-sm font-medium text-neutral-700">
                <MessageCircle
                  className="ml-2 mr-4 h-4 w-4"
                  strokeWidth={2.5}
                />
                <span>{CQ2Document.version1.comments.length}</span>
                <span className="ml-1">general comments</span>
              </div>
            </>
          )}
          {CQ2Document.version1.comments.map((comment, idx) => (
            <div
              key={comment.comment_id}
              className={`group relative mt-5 w-full`}
              id={`v2-v1-0-${comment.comment_id}`}
            >
              <Separator className={`my-8 ${idx === 0 ? "hidden" : ""}`} />
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
                  </div>
                </div>
              </div>
              {!comment.for_child_thread_created &&
                !comment.for_child_thread_resolved && (
                  <div className="ml-[2.5rem]">
                    <ContentWithHighlight
                      containerId={`0-${comment.comment_id}-text-container`}
                      content={comment.content}
                      highlights={comment.highlights}
                      CQ2DocumentCurrentHighlights={
                        CQ2DocumentCurrentHighlights
                      }
                    />
                  </div>
                )}
              {comment.for_child_thread_created && (
                <div className="ml-[2.5rem]">
                  <span className="text-neutral-400">
                    Created a new thread for:
                  </span>{" "}
                  <span
                    className="cursor-pointer font-medium text-neutral-600 underline"
                    onClick={() => {
                      const forNewThreadCreatedParentComment =
                        document.getElementById(
                          `v2-v1-0-${comment.for_child_thread_created_parent_comment_id}`,
                        );
                      const topPos = forNewThreadCreatedParentComment.offsetTop;
                      document.getElementById("document-doc-thread").scrollTo({
                        top: topPos + 5,
                        behavior: "smooth",
                      });
                    }}
                  >
                    {comment.for_child_thread_created_quote}
                  </span>
                </div>
              )}
              {comment.for_child_thread_resolved && (
                <div className="ml-[2.5rem]">
                  <span className="text-neutral-400">
                    Resolved the thread for:
                  </span>{" "}
                  <span
                    className="cursor-pointer font-medium text-neutral-600 underline"
                    onClick={() => {
                      const forNewThreadResolvedParentComment =
                        document.getElementById(
                          `v2-v1-0-${comment.for_child_thread_resolved_parent_comment_id}`,
                        );
                      const topPos =
                        forNewThreadResolvedParentComment.offsetTop;
                      document.getElementById("document-doc-thread").scrollTo({
                        top: topPos - 35,
                        behavior: "smooth",
                      });
                    }}
                  >
                    {comment.for_child_thread_resolved_quote}
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

export default V2V1DocThread;
