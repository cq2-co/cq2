import { create } from "zustand";

interface DiscussionState {
  discussion: object;
  setNewDiscussion: (discussion: object) => void;
}

const discussionStore = (set) => ({
  discussion: {
    thread_id: 0,
    title: "",
    content: "",
    created_on: -1,
    highlights: [],
    user_name: "",
    comments: [],
    threads: [],
  },
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

interface ShowConcludeThreadCommentBoxState {
  showConcludeThreadCommentBox: boolean;
  setShowConcludeThreadCommentBox: (
    showConcludeThreadCommentBox: boolean,
  ) => void;
}

const showConcludeThreadCommentBoxStore = (set) => ({
  showConcludeThreadCommentBox: false,
  setShowConcludeThreadCommentBox: (showConcludeThreadCommentBox: boolean) => {
    set((state) => ({
      showConcludeThreadCommentBox: showConcludeThreadCommentBox,
    }));
  },
});

export const useShowConcludeThreadCommentBoxStore =
  create<ShowConcludeThreadCommentBoxState>(showConcludeThreadCommentBoxStore);
