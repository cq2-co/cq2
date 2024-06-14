"use client";

import ChildThread from "@/components/discussion/child-thread";
import MainThread from "@/components/discussion/main-thread";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ThreadInfoForHighlight } from "@/lib/utils";
import {
  useDiscussionCurrentHighlightsStore,
  useDiscussionOpenThreadsStore,
  useDiscussionStore,
  useDiscussionUnreadCommentsStore,
  useShowConcludeThreadCommentBoxStore,
  useShowThreadInfoBoxStore,
  useThreadInfoBoxCoordsStore,
  useThreadInfoBoxThreadIDStore,
} from "@/state";
import { useEffect } from "react";

export default function DiscussionContainer({ discussionFromDB }) {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
  const { setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();
  const { setShowConcludeThreadCommentBox } =
    useShowConcludeThreadCommentBoxStore();
  const { setNewDiscussionUnreadComments } = useDiscussionUnreadCommentsStore();
  const { showThreadInfoBox } = useShowThreadInfoBoxStore();
  const { threadInfoBoxThreadID } = useThreadInfoBoxThreadIDStore();
  const { threadInfoBoxCoords } = useThreadInfoBoxCoordsStore();

  useEffect(() => {
    setNewDiscussion(discussionFromDB);

    if (typeof window !== "undefined") {
      const discussionFromLS = JSON.parse(
        localStorage.getItem("cq2DiscussionsRead"),
      ).discussions.filter(
        (discussion) => discussion._id === discussionFromDB._id,
      )[0].threads;

      const unreadComments = {
        0: discussionFromDB.comments.length - discussionFromLS[0],
      };

      for (let i = 1; i <= discussionFromDB.threads.length; i++) {
        unreadComments[i] =
          discussionFromDB.threads.filter((thread) => thread.thread_id === i)[0]
            .comments.length - discussionFromLS[i];
      }

      setNewDiscussionUnreadComments(unreadComments);
    }

    if (discussion._id !== discussionFromDB._id) {
      setNewDiscussionOpenThreads([]);
      setNewDiscussionCurrentHighlights([]);
      setShowConcludeThreadCommentBox(false);
      setNewDiscussionUnreadComments({});
    }
  }, [
    discussion._id,
    setNewDiscussion,
    discussionFromDB,
    setNewDiscussionOpenThreads,
    setNewDiscussionCurrentHighlights,
    setShowConcludeThreadCommentBox,
    setNewDiscussionUnreadComments,
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
            discussion={discussion}
            thread_id={threadInfoBoxThreadID}
          />
        </HoverCardContent>
      </HoverCard>
      <div>
        <MainThread />
      </div>
      {discussionOpenThreads.map((openThread) => (
        <div key={openThread}>
          <ChildThread threadID={openThread} />
        </div>
      ))}
    </>
  );
}
