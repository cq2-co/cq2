"use client";

import MainThread from "@/components/discussion/main-thread";
import ChildThread from "@/components/discussion/child-thread";
import { useDiscussionOpenThreadsStore, useDiscussionStore } from "@/state";

export default function Discussion() {
  const { discussion, setNewDiscussion } = useDiscussionStore();

  const discussionOpenThreads = useDiscussionOpenThreadsStore(
    (state) => state.discussionOpenThreads,
  );

  return (
    <div
      className="hidden h-[calc(100vh-3.25rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex"
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
