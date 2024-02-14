"use client";

import MainThread from "@/components/main-thread";
import LeftNav from "@/components/left-nav";
import ChildThread from "@/components/child-thread";
import {
  Archive,
  Home,
  Settings,
  PlusSquare,
  MessagesSquare,
} from "lucide-react";
import { useOpenThreadsStore } from "@/state";
import { motion } from "framer-motion";

export default function Discussion() {
  const openThreads = useOpenThreadsStore((state) => state.openThreads);

  return (
    <main className="bg-neutral-100">
      <div className="fixed z-50 hidden h-screen md:flex">
        <LeftNav
          links={
            [
              // {
              //   title: "Home",
              //   icon: Home,
              //   variant: "ghost",
              // },
              // {
              //   title: "Discussions",
              //   icon: MessagesSquare,
              //   variant: "ghost",
              // },
              // {
              //   title: "Spaces",
              //   icon: Archive,
              //   variant: "ghost",
              // },
            ]
          }
          isCollapsed={true}
        />
      </div>
      <div
        className="ml-56 hidden h-screen overflow-y-hidden md:flex"
        id="threads-scrollable-container"
      >
        <div>
          <MainThread />
        </div>
        {openThreads.map((openThread) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.1,
              ease: "easeIn",
              delay: 0.1,
            }}
            key={openThread}
          >
            <ChildThread threadID={openThread} />
          </motion.div>
        ))}
      </div>
      <div className="flex h-screen flex-col items-center justify-center bg-neutral-50 md:hidden">
        <p>CQ2 doesn't work on mobile, yet.</p>
        <p>Please try on a bigger device.</p>
      </div>
    </main>
  );
}
