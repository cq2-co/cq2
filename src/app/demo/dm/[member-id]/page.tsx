"use client";

import MainThread from "@/components/main-thread";
import ChildThread from "@/components/child-thread";
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
      className="ml-56 hidden h-screen overflow-y-hidden scroll-smooth md:flex"
      id="threads-scrollable-container"
    >
      <MainThread />
      {postOpenThreads.map((openThread) => (
        <ChildThread threadID={openThread} key={openThread} />
      ))}
      <Toaster closeButton duration={15000} />
    </div>
  );
}
