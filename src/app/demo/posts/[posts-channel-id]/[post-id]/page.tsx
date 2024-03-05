"use client";

import MainThread from "@/components/post/main-thread";
import ChildThread from "@/components/post/child-thread";
import { usePostOpenThreadsStore } from "@/state";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Post() {
  const postOpenThreads = usePostOpenThreadsStore(
    (state) => state.postOpenThreads,
  );

  useEffect(() => {
    setTimeout(() => {
      toast("Hey, try creating a new thread from a quote!", {
        description:
          "You can just select any text and click the 'Comment in new thread' button which pops up.",
      });
    }, 10000);
  }, []);

  return (
    <div
      className="ml-56 hidden h-[calc(100vh-3.25rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex"
      id="posts-threads-scrollable-container"
    >
      <div>
        <MainThread />
      </div>
      {postOpenThreads.map((openThread) => (
        <div key={openThread}>
          <ChildThread threadID={openThread} />
        </div>
      ))}
      <Toaster closeButton duration={15000} />
    </div>
  );
}
