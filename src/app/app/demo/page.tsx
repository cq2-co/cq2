"use client";

import CQ2DocumentSkeleton from "@/components/CQ2Document/CQ2Document-skeleton";
import ChildThread from "@/components/CQ2Document/child-thread";
import LatestVersion from "@/components/CQ2Document/latest-version";
import LatestVersionEditor from "@/components/CQ2Document/latest-version-editor";
import MainThread from "@/components/CQ2Document/main-thread";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DummyCQ2DocumentData } from "@/lib/dummy-CQ2Document-data";
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
import { useEffect, useState } from "react";

export default function CQ2Document() {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const { CQ2DocumentOpenThreads, setNewCQ2DocumentOpenThreads } =
    useCQ2DocumentOpenThreadsStore();
  const { setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();
  const { setNewCQ2DocumentUnreadComments } =
    useCQ2DocumentUnreadCommentsStore();
  const { showLatestVersionEditor, setShowLatestVersionEditor } =
    useShowLatestVersionEditorStore();
  const { showOldVersion } = useShowOldVersionStore();
  const [isLoading, setLoading] = useState(true);
  const { showThreadInfoBox } = useShowThreadInfoBoxStore();
  const { threadInfoBoxThreadID } = useThreadInfoBoxThreadIDStore();
  const { threadInfoBoxCoords } = useThreadInfoBoxCoordsStore();

  useEffect(() => {
    setNewCQ2Document(DummyCQ2DocumentData);
    setNewCQ2DocumentOpenThreads([]);
    setNewCQ2DocumentCurrentHighlights([]);
    setLoading(false);
  }, [
    setNewCQ2Document,
    setNewCQ2DocumentOpenThreads,
    setNewCQ2DocumentCurrentHighlights,
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const CQ2DocumentsRead = localStorage.getItem("CQ2DocumentsRead");

      const threadsData = {};

      for (let i = 0; i <= DummyCQ2DocumentData.version1.threads.length; i++) {
        threadsData[i] = 0;
      }

      if (!CQ2DocumentsRead) {
        const initCQ2DocumentsRead = {
          CQ2Documents: [
            {
              _id: DummyCQ2DocumentData._id,
              threads: threadsData,
            },
          ],
        };

        localStorage.setItem(
          "CQ2DocumentsRead",
          JSON.stringify(initCQ2DocumentsRead),
        );
      } else {
        let CQ2DocumentsReadJSON = JSON.parse(CQ2DocumentsRead);

        const newCQ2DocumentsReadJSON = {
          CQ2Documents: CQ2DocumentsReadJSON.CQ2Documents.filter(
            (CQ2DocumentReadJSON) =>
              CQ2DocumentReadJSON["_id"] !== DummyCQ2DocumentData._id,
          ),
        };

        newCQ2DocumentsReadJSON.CQ2Documents.push({
          _id: DummyCQ2DocumentData._id,
          threads: threadsData,
        });

        localStorage.setItem(
          "CQ2DocumentsRead",
          JSON.stringify(newCQ2DocumentsReadJSON),
        );
      }

      const CQ2DocumentFromLS = JSON.parse(
        localStorage.getItem("CQ2DocumentsRead"),
      ).CQ2Documents.filter(
        (CQ2Document) => CQ2Document._id === DummyCQ2DocumentData._id,
      )[0].threads;

      const unreadComments = {
        0: DummyCQ2DocumentData.version1.comments.length - CQ2DocumentFromLS[0],
      };

      for (let i = 1; i <= DummyCQ2DocumentData.version1.threads.length; i++) {
        unreadComments[i] =
          DummyCQ2DocumentData.version1.threads.filter(
            (thread) => thread.thread_id === i,
          )[0].comments.length - CQ2DocumentFromLS[i];
      }

      setNewCQ2DocumentUnreadComments(unreadComments);
    }
  }, [setNewCQ2DocumentUnreadComments]);

  if (isLoading) return <CQ2DocumentSkeleton />;

  return (
    <div
      className="relative hidden h-[calc(100vh-2.5rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex"
      id="CQ2Document-threads-scrollable-container"
    >
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
    </div>
  );
}
