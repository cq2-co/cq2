"use client";

import ChildThread from "@/components/CQ2Document/child-thread";
import MainThread from "@/components/CQ2Document/main-thread";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ThreadInfoForHighlight } from "@/lib/utils";
import {
  useCQ2DocumentCurrentHighlightsStore,
  useCQ2DocumentOpenThreadsStore,
  useCQ2DocumentStore,
  useCQ2DocumentUnreadCommentsStore,
  useShowConcludeThreadCommentBoxStore,
  useShowThreadInfoBoxStore,
  useThreadInfoBoxCoordsStore,
  useThreadInfoBoxThreadIDStore,
} from "@/state";
import { useEffect } from "react";

export default function CQ2DocumentContainer({ CQ2DocumentFromDB }) {
  console.log(CQ2DocumentFromDB);
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const { CQ2DocumentOpenThreads, setNewCQ2DocumentOpenThreads } =
    useCQ2DocumentOpenThreadsStore();
  const { setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();
  const { setShowConcludeThreadCommentBox } =
    useShowConcludeThreadCommentBoxStore();
  const { setNewCQ2DocumentUnreadComments } =
    useCQ2DocumentUnreadCommentsStore();
  const { showThreadInfoBox } = useShowThreadInfoBoxStore();
  const { threadInfoBoxThreadID } = useThreadInfoBoxThreadIDStore();
  const { threadInfoBoxCoords } = useThreadInfoBoxCoordsStore();

  useEffect(() => {
    setNewCQ2Document(CQ2DocumentFromDB);

    if (typeof window !== "undefined") {
      const CQ2DocumentFromLS = JSON.parse(
        localStorage.getItem("CQ2DocumentsRead"),
      ).CQ2Documents.filter(
        (CQ2Document) => CQ2Document._id === CQ2DocumentFromDB._id,
      )[0].threads;

      const unreadComments = {
        0: CQ2DocumentFromDB.comments.length - CQ2DocumentFromLS[0],
      };

      for (let i = 1; i <= CQ2DocumentFromDB.threads.length; i++) {
        unreadComments[i] =
          CQ2DocumentFromDB.threads.filter(
            (thread) => thread.thread_id === i,
          )[0].comments.length - CQ2DocumentFromLS[i];
      }

      setNewCQ2DocumentUnreadComments(unreadComments);
    }

    if (CQ2Document._id !== CQ2DocumentFromDB._id) {
      setNewCQ2DocumentOpenThreads([]);
      setNewCQ2DocumentCurrentHighlights([]);
      setShowConcludeThreadCommentBox(false);
      setNewCQ2DocumentUnreadComments({});
    }
  }, [
    CQ2Document._id,
    setNewCQ2Document,
    CQ2DocumentFromDB,
    setNewCQ2DocumentOpenThreads,
    setNewCQ2DocumentCurrentHighlights,
    setShowConcludeThreadCommentBox,
    setNewCQ2DocumentUnreadComments,
  ]);

  return (
    <>
      <HoverCard openDelay={50} closeDelay={100} open={showThreadInfoBox}>
        <HoverCardTrigger asChild>
          <span />
        </HoverCardTrigger>
        <HoverCardContent
          side="right"
          className="comment-info absolute z-50 flex w-[32rem] items-center justify-center rounded-2xl py-3 pl-3 pr-2 text-xs font-medium"
          style={{
            left: threadInfoBoxCoords.x,
            top: threadInfoBoxCoords.y,
          }}
        >
          <ThreadInfoForHighlight
            CQ2Document={CQ2Document}
            thread_id={threadInfoBoxThreadID}
          />
        </HoverCardContent>
      </HoverCard>
      <div>
        <MainThread />
      </div>
      {CQ2DocumentOpenThreads.map((openThread) => (
        <div key={openThread}>
          <ChildThread threadID={openThread} />
        </div>
      ))}
    </>
  );
}
