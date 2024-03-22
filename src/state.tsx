import { create } from "zustand";
import { DiscussionData } from "@/lib/discussion-dummy-data";

// Discussion

interface DiscussionState {
  discussion: object;
  setNewDiscussion: (discussion: object) => void;
}

const discussionStore = (set) => ({
  discussion: DiscussionData,
  setNewDiscussion: (discussion: object) => {
    set((state) => ({
      discussion: discussion,
    }));
  },
});

export const useDiscussionStore = create<DiscussionState>(discussionStore);

interface DiscussionOpenThreadsState {
  discussionOpenThreads: number[];
  setNewDiscussionOpenThreads: (discussionOpenThreads: number[]) => void;
}

const discussionOpenThreadsStore = (set) => ({
  discussionOpenThreads: [],
  setNewDiscussionOpenThreads: (discussionOpenThreads: number[]) => {
    set((state) => ({
      discussionOpenThreads: discussionOpenThreads,
    }));
  },
});

export const useDiscussionOpenThreadsStore = create<DiscussionOpenThreadsState>(
  discussionOpenThreadsStore,
);

interface DiscussionCurrentHighlightsState {
  discussionCurrentHighlights: object[];
  setNewDiscussionCurrentHighlights: (
    discussionCurrentHighlights: object[],
  ) => void;
}

const discussionCurrentHighlightsStore = (set) => ({
  discussionCurrentHighlights: [],
  setNewDiscussionCurrentHighlights: (
    discussionCurrentHighlights: object[],
  ) => {
    set((state) => ({
      discussionCurrentHighlights: discussionCurrentHighlights,
    }));
  },
});

export const useDiscussionCurrentHighlightsStore =
  create<DiscussionCurrentHighlightsState>(discussionCurrentHighlightsStore);
