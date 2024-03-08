"use client";

import MainThread from "@/components/post/main-thread";
import ChildThread from "@/components/post/child-thread";
import { usePostOpenThreadsStore, usePostStore } from "@/state";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useTopNavTitleStore, useLeftNavCurrentlyOpenedStore } from "@/state";
import { usePathname } from "next/navigation";

export default function Post() {
  const { post, setNewPost } = usePostStore();
  const { topNavTitle, setTopNavTitle } = useTopNavTitleStore();

  useEffect(() => {
    setTopNavTitle(post.title);
  }, [setTopNavTitle, post.title]);

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

  const { leftNavCurrentlyOpened, setLeftNavCurrentlyOpened } =
    useLeftNavCurrentlyOpenedStore();

  const pathname = usePathname();

  useEffect(() => {
    setLeftNavCurrentlyOpened(pathname);
  }, [setLeftNavCurrentlyOpened, pathname]);

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
