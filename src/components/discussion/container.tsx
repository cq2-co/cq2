"use client";

import MainThread from "@/components/discussion/main-thread";
import ChildThread from "@/components/discussion/child-thread";
import {
  useDiscussionStore,
  useDiscussionOpenThreadsStore,
  useDiscussionCurrentHighlightsStore,
  useShowConcludeThreadCommentBoxStore,
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

  useEffect(() => {
    setNewDiscussion(discussionFromDB);

    if (discussion._id !== discussionFromDB._id) {
      setNewDiscussionOpenThreads([]);
      setNewDiscussionCurrentHighlights([]);
      setShowConcludeThreadCommentBox(false);
    }
  }, [
    discussion._id,
    setNewDiscussion,
    discussionFromDB,
    setNewDiscussionOpenThreads,
    setNewDiscussionCurrentHighlights,
    setShowConcludeThreadCommentBox,
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
