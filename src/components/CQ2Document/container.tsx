"use client";

import ChildThread from "@/components/CQ2Document/child-thread";
import LatestVersion from "@/components/CQ2Document/latest-version";
import LatestVersionEditor from "@/components/CQ2Document/latest-version-editor";
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
  useShowLatestVersionEditorStore,
  useShowOldVersionStore,
  useShowThreadInfoBoxStore,
  useThreadInfoBoxCoordsStore,
  useThreadInfoBoxThreadIDStore,
} from "@/state";
import { useEffect } from "react";

export default function CQ2DocumentContainer({ CQ2DocumentFromDB }) {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const { CQ2DocumentOpenThreads, setNewCQ2DocumentOpenThreads } =
    useCQ2DocumentOpenThreadsStore();
  const { setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();
  const { showLatestVersionEditor, setShowLatestVersionEditor } =
    useShowLatestVersionEditorStore();
  const { showOldVersion, setShowOldVersion } = useShowOldVersionStore();
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
        0: CQ2DocumentFromDB.version1.comments.length - CQ2DocumentFromLS[0],
      };

      for (let i = 1; i <= CQ2DocumentFromDB.version1.threads.length; i++) {
        unreadComments[i] =
          CQ2DocumentFromDB.version1.threads.filter(
            (thread) => thread.thread_id === i,
          )[0].comments.length - CQ2DocumentFromLS[i];
      }

      setNewCQ2DocumentUnreadComments(unreadComments);
    }

    if (CQ2Document._id !== CQ2DocumentFromDB._id) {
      setNewCQ2DocumentOpenThreads([]);
      setNewCQ2DocumentCurrentHighlights([]);
      setShowLatestVersionEditor(false);
      setNewCQ2DocumentUnreadComments({});
      setShowLatestVersionEditor(false);
      setShowOldVersion(false);
    }
  }, [
    CQ2Document._id,
    setNewCQ2Document,
    CQ2DocumentFromDB,
    setNewCQ2DocumentOpenThreads,
    setNewCQ2DocumentCurrentHighlights,
    setShowLatestVersionEditor,
    setNewCQ2DocumentUnreadComments,
    setShowOldVersion,
  ]);

  return (
    <>
      <HoverCard openDelay={50} closeDelay={100} open={showThreadInfoBox}>
        <HoverCardTrigger asChild>
          <span />
        </HoverCardTrigger>
        <HoverCardContent
          side="right"
          className="comment-info absolute z-50 flex w-[32rem] rounded-lg p-3 text-xs font-medium"
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
      {CQ2Document.version1.is_concluded && (
        <div>
          <LatestVersion />
        </div>
      )}
      {showLatestVersionEditor && (
        <div>
          <LatestVersionEditor />
        </div>
      )}
      {(!CQ2Document.version1.is_concluded || showOldVersion) && (
        <div>
          <MainThread />
        </div>
      )}
      {CQ2DocumentOpenThreads.map((openThread) => (
        <div key={openThread}>
          <ChildThread threadID={openThread} />
        </div>
      ))}
    </>
  );
}
