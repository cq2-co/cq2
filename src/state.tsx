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

interface DiscussionUnreadCommentsState {
  discussionUnreadComments: object;
  setNewDiscussionUnreadComments: (discussionUnreadComments: object) => void;
}

const discussionUnreadCommentsStore = (set) => ({
  discussionUnreadComments: {},
  setNewDiscussionUnreadComments: (discussionUnreadComments: object) => {
    set((state) => ({
      discussionUnreadComments: discussionUnreadComments,
    }));
  },
});

export const useDiscussionUnreadCommentsStore =
  create<DiscussionUnreadCommentsState>(discussionUnreadCommentsStore);

interface ShowThreadInfoBoxState {
  showThreadInfoBox: boolean;
  setShowThreadInfoBox: (showThreadInfoBox: boolean) => void;
}

const showThreadInfoBoxStore = (set) => ({
  showThreadInfoBox: false,
  setShowThreadInfoBox: (showThreadInfoBox: boolean) => {
    set((state) => ({
      showThreadInfoBox: showThreadInfoBox,
    }));
  },
});

export const useShowThreadInfoBoxStore = create<ShowThreadInfoBoxState>(
  showThreadInfoBoxStore,
);

interface ThreadInfoBoxThreadIDState {
  threadInfoBoxThreadID: number;
  setThreadInfoBoxThreadID: (threadInfoBoxThreadID: number) => void;
}

const threadInfoBoxThreadIDStore = (set) => ({
  threadInfoBoxThreadID: -1,
  setThreadInfoBoxThreadID: (threadInfoBoxThreadID: number) => {
    set((state) => ({
      threadInfoBoxThreadID: threadInfoBoxThreadID,
    }));
  },
});

export const useThreadInfoBoxThreadIDStore = create<ThreadInfoBoxThreadIDState>(
  threadInfoBoxThreadIDStore,
);

interface ThreadInfoBoxCoordsState {
  threadInfoBoxCoords: object;
  setThreadInfoBoxCoords: (threadInfoBoxCoords: object) => void;
}

const threadInfoBoxCoordsStore = (set) => ({
  threadInfoBoxCoords: {},
  setThreadInfoBoxCoords: (threadInfoBoxCoords: object) => {
    set((state) => ({
      threadInfoBoxCoords: threadInfoBoxCoords,
    }));
  },
});

export const useThreadInfoBoxCoordsStore = create<ThreadInfoBoxCoordsState>(
  threadInfoBoxCoordsStore,
);
