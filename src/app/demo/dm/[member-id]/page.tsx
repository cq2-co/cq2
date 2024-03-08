"use client";

import MainThread from "@/components/dm/main-thread";
import ChildThread from "@/components/dm/child-thread";
import { useDMOpenThreadsStore } from "@/state";
import { useEffect } from "react";
import { useTopNavTitleStore, useLeftNavCurrentlyOpenedStore } from "@/state";
import { usePathname } from "next/navigation";

export default function DM() {
  const dmOpenThreads = useDMOpenThreadsStore((state) => state.dmOpenThreads);

  const { leftNavCurrentlyOpened, setLeftNavCurrentlyOpened } =
    useLeftNavCurrentlyOpenedStore();

  const pathname = usePathname();

  useEffect(() => {
    setLeftNavCurrentlyOpened(pathname);
  }, [setLeftNavCurrentlyOpened, pathname]);

  const { topNavTitle, setTopNavTitle } = useTopNavTitleStore();

  const name =
    pathname.split("/")[3].charAt(0).toUpperCase() +
    pathname.split("/")[3].slice(1);

  useEffect(() => {
    setTopNavTitle(name);
  }, [setTopNavTitle, name]);

  return (
    <div
      className="ml-56 hidden h-[calc(100vh-3.25rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex"
      id="dms-threads-scrollable-container"
    >
      <div>
        <MainThread />
      </div>
      {dmOpenThreads.map((openThread) => (
        <div key={openThread}>
          <ChildThread threadID={openThread} />
        </div>
      ))}
    </div>
  );
}
