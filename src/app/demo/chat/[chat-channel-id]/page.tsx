"use client";

import MainThread from "@/components/chat/main-thread";
import ChildThread from "@/components/chat/child-thread";
import { useChatOpenThreadsStore } from "@/state";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Chat() {
  const chatOpenThreads = useChatOpenThreadsStore(
    (state) => state.chatOpenThreads,
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
      id="chats-threads-scrollable-container"
    >
      <div>
        <MainThread />
      </div>
      {chatOpenThreads.map((openThread) => (
        <div key={openThread}>
          <ChildThread threadID={openThread} />
        </div>
      ))}
      <Toaster closeButton duration={15000} />
    </div>
  );
}
