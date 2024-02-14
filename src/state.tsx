import { create } from "zustand";
import DemoData from "@/lib/dummy-data";

interface OpenThreadsState {
  openThreads: number[];
  setNewOpenThreads: (openThreads: number[]) => void;
}

const openThreadsStore = (set) => ({
  openThreads: [],
  setNewOpenThreads: (openThreads: number[]) => {
    set((state) => ({
      openThreads: openThreads,
    }));
  },
});

export const useOpenThreadsStore = create<OpenThreadsState>(openThreadsStore);

interface DiscussionState {
  discussion: object;
  setNewDiscussion: (discussion: object) => void;
}

const discussionStore = (set) => ({
  discussion: DemoData,
  setNewDiscussion: (discussion: object) => {
    set((state) => ({
      discussion: discussion,
    }));
  },
});

export const useDiscussionStore = create<DiscussionState>(discussionStore);

interface CurrentHighlightsState {
  currentHighlights: object[];
  setNewCurrentHighlights: (currentHighlights: object[]) => void;
}

const currentHighlightsStore = (set) => ({
  currentHighlights: [],
  setNewCurrentHighlights: (currentHighlights: object[]) => {
    set((state) => ({
      currentHighlights: currentHighlights,
    }));
  },
});

export const useCurrentHighlightsStore = create<CurrentHighlightsState>(
  currentHighlightsStore,
);
