"use client";

import V2Editor from "@/components/document/v2-editor";
import V2V1ChildThread from "@/components/document/v2-v1-child-thread";
import V2V1DocThread from "@/components/document/v2-v1-doc-thread";
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
  useShowOldVersionStore,
  useShowThreadInfoBoxStore,
  useThreadInfoBoxCoordsStore,
  useThreadInfoBoxThreadIDStore,
} from "@/state";
import { useEffect } from "react";

export default function CQ2V2EditDocumentContainer() {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const { CQ2DocumentOpenThreads, setNewCQ2DocumentOpenThreads } =
    useCQ2DocumentOpenThreadsStore();
  const { setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();
  const { setNewCQ2DocumentUnreadComments } =
    useCQ2DocumentUnreadCommentsStore();
  const { showOldVersion, setShowOldVersion } = useShowOldVersionStore();
  const { showThreadInfoBox } = useShowThreadInfoBoxStore();
  const { threadInfoBoxThreadID } = useThreadInfoBoxThreadIDStore();
  const { threadInfoBoxCoords } = useThreadInfoBoxCoordsStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const CQ2DocumentFromLS = JSON.parse(
        localStorage.getItem("CQ2DocumentsRead"),
      ).CQ2Documents.filter(
        (_CQ2Document) => _CQ2Document._id === CQ2Document._id,
      )[0].threads;

      const unreadComments = {
        0: CQ2Document.version1.comments.length - CQ2DocumentFromLS[0],
      };

      for (let i = 1; i <= CQ2Document.version1.threads.length; i++) {
        unreadComments[i] =
          CQ2Document.version1.threads.filter(
            (thread) => thread.thread_id === i,
          )[0].comments.length - CQ2DocumentFromLS[i];
      }

      setNewCQ2DocumentUnreadComments(unreadComments);
    }

    setNewCQ2DocumentOpenThreads([]);
    setNewCQ2DocumentCurrentHighlights([]);
    setShowOldVersion(false);
  }, []);

  return (
    <>
      <HoverCard openDelay={50} closeDelay={100} open={showThreadInfoBox}>
        <HoverCardTrigger asChild>
          <span />
        </HoverCardTrigger>
        <HoverCardContent
          side="right"
          className="comment-info absolute z-[99] flex w-[32rem] rounded-lg p-3 text-xs font-medium"
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
        <V2Editor />
      </div>
      {showOldVersion && (
        <>
          <div>
            <V2V1DocThread />
          </div>
          {CQ2DocumentOpenThreads.map((openThread) => (
            <div key={openThread}>
              <V2V1ChildThread threadID={openThread} />
            </div>
          ))}
        </>
      )}
    </>
  );
}
