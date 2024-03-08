"use client";

import MainThread from "@/components/chat/main-thread";
import ChildThread from "@/components/chat/child-thread";
import { useChatOpenThreadsStore } from "@/state";
import { useEffect } from "react";
import { useTopNavTitleStore, useLeftNavCurrentlyOpenedStore } from "@/state";
import { usePathname } from "next/navigation";

export default function Chat() {
  const chatOpenThreads = useChatOpenThreadsStore(
    (state) => state.chatOpenThreads,
  );

  const { topNavTitle, setTopNavTitle } = useTopNavTitleStore();

  useEffect(() => {
    setTopNavTitle("AI Chat");
  }, [setTopNavTitle]);

  const { leftNavCurrentlyOpened, setLeftNavCurrentlyOpened } =
    useLeftNavCurrentlyOpenedStore();

  const pathname = usePathname();

  useEffect(() => {
    setLeftNavCurrentlyOpened(pathname);
  }, [setLeftNavCurrentlyOpened, pathname]);

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
    </div>
  );
}
