"use client";

import MainThread from "@/components/discussion/main-thread";
import ChildThread from "@/components/discussion/child-thread";
import { DummyDiscussionData } from "@/lib/dummy-discussion-data";
import {
  useDiscussionStore,
  useDiscussionOpenThreadsStore,
  useDiscussionCurrentHighlightsStore,
} from "@/state";
import { useEffect } from "react";

export default function Discussion() {
  const { setNewDiscussion } = useDiscussionStore();
  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
  const { setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();

  useEffect(() => {
    setNewDiscussion(DummyDiscussionData);
    setNewDiscussionOpenThreads([]);
    setNewDiscussionCurrentHighlights([]);
  }, [
    setNewDiscussion,
    setNewDiscussionOpenThreads,
    setNewDiscussionCurrentHighlights,
  ]);

  return (
    <div
      className="hidden h-[calc(100vh-2.5rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex"
      id="discussions-threads-scrollable-container"
    >
      <div>
        <MainThread />
      </div>
      {discussionOpenThreads.map((openThread) => (
        <div key={openThread}>
          <ChildThread threadID={openThread} />
        </div>
      ))}
    </div>
  );
}
