"use client";

import ChildThread from "@/components/discussion/child-thread";
import DiscussionSkeleton from "@/components/discussion/discussion-skeleton";
import MainThread from "@/components/discussion/main-thread";
import { DummyDiscussionData } from "@/lib/dummy-discussion-data";
import {
  useDiscussionCurrentHighlightsStore,
  useDiscussionOpenThreadsStore,
  useDiscussionStore,
  useDiscussionUnreadCommentsStore,
} from "@/state";
import { useEffect, useState } from "react";

export default function Discussion() {
  const { setNewDiscussion } = useDiscussionStore();
  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
  const { setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();
  const { setNewDiscussionUnreadComments } = useDiscussionUnreadCommentsStore();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setNewDiscussion(DummyDiscussionData);
    setNewDiscussionOpenThreads([]);
    setNewDiscussionCurrentHighlights([]);
    setLoading(false);
  }, [
    setNewDiscussion,
    setNewDiscussionOpenThreads,
    setNewDiscussionCurrentHighlights,
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cq2DiscussionsRead = localStorage.getItem("cq2DiscussionsRead");

      const threadsData = {};

      for (let i = 0; i <= DummyDiscussionData.threads.length; i++) {
        threadsData[i] = 0;
      }

      if (!cq2DiscussionsRead) {
        const initCq2DiscussionsRead = {
          discussions: [
            {
              _id: DummyDiscussionData._id,
              threads: threadsData,
            },
          ],
        };

        localStorage.setItem(
          "cq2DiscussionsRead",
          JSON.stringify(initCq2DiscussionsRead),
        );
      } else {
        let cq2DiscussionsReadJSON = JSON.parse(cq2DiscussionsRead);

        const newCq2DiscussionsReadJSON = {
          discussions: cq2DiscussionsReadJSON.discussions.filter(
            (cq2DiscussionReadJSON) =>
              cq2DiscussionReadJSON["_id"] !== DummyDiscussionData._id,
          ),
        };

        newCq2DiscussionsReadJSON.discussions.push({
          _id: DummyDiscussionData._id,
          threads: threadsData,
        });

        localStorage.setItem(
          "cq2DiscussionsRead",
          JSON.stringify(newCq2DiscussionsReadJSON),
        );
      }

      const discussionFromLS = JSON.parse(
        localStorage.getItem("cq2DiscussionsRead"),
      ).discussions.filter(
        (discussion) => discussion._id === DummyDiscussionData._id,
      )[0].threads;

      const unreadComments = {
        0: DummyDiscussionData.comments.length - discussionFromLS[0],
      };

      for (let i = 1; i <= DummyDiscussionData.threads.length; i++) {
        unreadComments[i] =
          DummyDiscussionData.threads.filter(
            (thread) => thread.thread_id === i,
          )[0].comments.length - discussionFromLS[i];
      }

      setNewDiscussionUnreadComments(unreadComments);
    }
  }, [setNewDiscussionUnreadComments]);

  if (isLoading) return <DiscussionSkeleton />;

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
