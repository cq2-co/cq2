"use client";

import MainThread from "@/components/discussion/main-thread";
import ChildThread from "@/components/discussion/child-thread";
import {
  useDiscussionStore,
  useDiscussionOpenThreadsStore,
  useDiscussionCurrentHighlightsStore,
  useShowConcludeThreadCommentBoxStore,
  useDiscussionUnreadCommentsStore,
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
