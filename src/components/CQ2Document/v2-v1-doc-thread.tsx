"use client";

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

    const CQ2DocumentDocThread = document.getElementById(
      "v2-v1-document-doc-thread",
    );

    if (
      !CQ2DocumentDocThread ||
      !docContentContainer ||
      !docContentContainer.innerHTML
    )
      return;

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

              let yCoord = highlightSpanBounds.top - 513;

              if (
                xCoord + 512 >=
                document.documentElement.clientWidth +
                  CQ2DocumentsThreadsScrollableContainer?.scrollLeft
              ) {
                xCoord =
                  highlightSpanBounds.left +
                  CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                  532;
              }

              const CQ2DocumentsThreadsScrollableContainerHeightMid =
                CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                  .height /
                  2 -
                513;

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

            setShowThreadInfoBox(false);
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

                let yCoord = highlightSpanBounds.top - 513;

                if (
                  xCoord + 512 >=
                  document.documentElement.clientWidth +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft
                ) {
                  xCoord =
                    highlightSpanBounds.left +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                    532;
                }

                const CQ2DocumentsThreadsScrollableContainerHeightMid =
                  CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                    .height /
                    2 -
                  513;

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

              setShowThreadInfoBox(false);
            });
          });
      }
    };
  }, [CQ2Document]);

  useEffect(() => {
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

                let yCoord = highlightSpanBounds.top - 513;

                if (
                  xCoord + 512 >=
                  document.documentElement.clientWidth +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft
                ) {
                  xCoord =
                    highlightSpanBounds.left +
                    CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                    532;
                }

                const CQ2DocumentsThreadsScrollableContainerHeightMid =
                  CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                    .height /
                    2 -
                  513;

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

              setShowThreadInfoBox(false);
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

                  let yCoord = highlightSpanBounds.top - 513;

                  if (
                    xCoord + 512 >=
                    document.documentElement.clientWidth +
                      CQ2DocumentsThreadsScrollableContainer?.scrollLeft
                  ) {
                    xCoord =
                      highlightSpanBounds.left +
                      CQ2DocumentsThreadsScrollableContainer?.scrollLeft -
                      532;
                  }

                  const CQ2DocumentsThreadsScrollableContainerHeightMid =
                    CQ2DocumentsThreadsScrollableContainer?.getBoundingClientRect()
                      .height /
                      2 -
                    513;

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

                setShowThreadInfoBox(false);
              });
            });
        }
      }
    };
  }, [CQ2Document]);

  return (
    <div
      className={`relative flex h-full w-[calc((100vw)/2)] flex-col border-r border-[#EDEDED] bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.5rem]`}
    >
      <div
        className={`sticky top-0 z-40 flex flex-row justify-between border-b border-[#EDEDED] bg-[#FFFFFF] px-5 py-2 text-sm`}
      >
        <div className={`flex items-center font-normal text-neutral-400`}>
          <span className="rounded-lg bg-neutral-100 px-2 py-0 font-medium text-neutral-700">
            Version 1
          </span>
          <span className="mx-2">·</span>
          {CQ2Document.user_name}
          <span className="mx-2">·</span>
          {dayjs(CQ2Document.version1.created_on).format("MMM DD, YYYY")}
        </div>
        <div className={`items-cente flex text-neutral-400`}>
          <span className="mr-1 text-neutral-600">
            {CQ2Document.version1.highlights.length}
          </span>
          {"document "}
          {CQ2Document.version1.highlights.length === 1
            ? "comment"
            : "comments"}
          <span className="mx-2">·</span>
          <span className="mr-1 text-neutral-600">
            {CQ2Document.version1.comments.length}
          </span>
          {" general "}
          {CQ2Document.version1.comments.length === 1 ? "comment" : "comments"}
        </div>
      </div>
      <div
        id="v2-v1-document-doc-thread"
        className="h-full overflow-y-scroll pb-5"
      >
        <h1 className="w-full appearance-none border-none px-5 pt-5 text-4xl font-semibold leading-tight text-[#37362f]">
          {CQ2Document.version1.title}
        </h1>
        <div className="relative p-5">
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
              <div className="mb-6 flex items-center text-sm font-medium text-neutral-700">
                <MessageCircle className="mr-2 h-3.5 w-3.5" strokeWidth={2.5} />
                General comments
              </div>
            </>
          )}
          {CQ2Document.version1.comments.map((comment, idx) => (
            <div
              key={comment.comment_id}
              className={`group relative mt-5 w-full rounded-lg border border-[#EDEDED] p-5`}
              id={`v2-v1-0-${comment.comment_id}`}
            >
              <div
                className={`mb-3 flex h-6 flex-row justify-between text-sm font-semibold text-neutral-700`}
              >
                <div id="comment-name-created-on">
                  {comment.user_name}
                  <span className="ml-3 text-xs font-normal text-neutral-400">
                    {dayjs(comment.created_on).format("DD/MM/YY hh:mm A")}
                  </span>
                </div>
              </div>
              {!comment.for_new_thread_created ? (
                <div>
                  <ContentWithHighlight
                    containerId={`v2-v1-0-${comment.comment_id}-text-container`}
                    content={comment.content}
                    highlights={comment.highlights}
                    CQ2DocumentCurrentHighlights={CQ2DocumentCurrentHighlights}
                  />
                </div>
              ) : (
                <div>
                  <span className="text-neutral-400">
                    Created a new thread for:
                  </span>{" "}
                  <span
                    className="cursor-pointer font-medium text-neutral-600 underline"
                    onClick={() => {
                      const forNewThreadCreatedParentComment =
                        document.getElementById(
                          `v2-v1-0-${comment.for_new_thread_created_parent_comment_id}`,
                        );
                      const topPos = forNewThreadCreatedParentComment.offsetTop;
                      document
                        .getElementById("v2-v1-document-doc-thread")
                        .scrollTo({
                          top: topPos - 55,
                          behavior: "smooth",
                        });
                    }}
                  >
                    {comment.for_new_thread_created_quote}
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
