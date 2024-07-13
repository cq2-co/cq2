import { create } from "zustand";

interface CQ2DocumentState {
  CQ2Document: object;
  setNewCQ2Document: (CQ2Document: object) => void;
}

const CQ2DocumentStore = (set) => ({
  CQ2Document: {
    user_name: "",
    version1: {
      thread_id: 0,
      title: "",
      content: "",
      created_on: -1,
      is_concluded: false,
      highlights: [],
      comments: [],
      threads: [],
    },
  },
  setNewCQ2Document: (CQ2Document: object) => {
    set((state) => ({
      CQ2Document: CQ2Document,
    }));
  },
});

export const useCQ2DocumentStore = create<CQ2DocumentState>(CQ2DocumentStore);

interface CQ2DocumentOpenThreadsState {
  CQ2DocumentOpenThreads: number[];
  setNewCQ2DocumentOpenThreads: (CQ2DocumentOpenThreads: number[]) => void;
}

const CQ2DocumentOpenThreadsStore = (set) => ({
  CQ2DocumentOpenThreads: [],
  setNewCQ2DocumentOpenThreads: (CQ2DocumentOpenThreads: number[]) => {
    set((state) => ({
      CQ2DocumentOpenThreads: CQ2DocumentOpenThreads,
    }));
  },
});

export const useCQ2DocumentOpenThreadsStore =
  create<CQ2DocumentOpenThreadsState>(CQ2DocumentOpenThreadsStore);

interface CQ2DocumentCurrentHighlightsState {
  CQ2DocumentCurrentHighlights: object[];
  setNewCQ2DocumentCurrentHighlights: (
    CQ2DocumentCurrentHighlights: object[],
  ) => void;
}

const CQ2DocumentCurrentHighlightsStore = (set) => ({
  CQ2DocumentCurrentHighlights: [],
  setNewCQ2DocumentCurrentHighlights: (
    CQ2DocumentCurrentHighlights: object[],
  ) => {
    set((state) => ({
      CQ2DocumentCurrentHighlights: CQ2DocumentCurrentHighlights,
    }));
  },
});

export const useCQ2DocumentCurrentHighlightsStore =
  create<CQ2DocumentCurrentHighlightsState>(CQ2DocumentCurrentHighlightsStore);

interface CQ2DocumentUnreadCommentsState {
  CQ2DocumentUnreadComments: object;
  setNewCQ2DocumentUnreadComments: (CQ2DocumentUnreadComments: object) => void;
}

const CQ2DocumentUnreadCommentsStore = (set) => ({
  CQ2DocumentUnreadComments: {},
  setNewCQ2DocumentUnreadComments: (CQ2DocumentUnreadComments: object) => {
    set((state) => ({
      CQ2DocumentUnreadComments: CQ2DocumentUnreadComments,
    }));
  },
});

export const useCQ2DocumentUnreadCommentsStore =
  create<CQ2DocumentUnreadCommentsState>(CQ2DocumentUnreadCommentsStore);

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

interface StartHideThreadInfoBoxProcessState {
  startHideThreadInfoBoxProcess: boolean;
  setStartHideThreadInfoBoxProcess: (
    startHideThreadInfoBoxProcess: boolean,
  ) => void;
}

const startHideThreadInfoBoxProcessStore = (set) => ({
  startHideThreadInfoBoxProcess: false,
  setStartHideThreadInfoBoxProcess: (
    startHideThreadInfoBoxProcess: boolean,
  ) => {
    set((state) => ({
      startHideThreadInfoBoxProcess: startHideThreadInfoBoxProcess,
    }));
  },
});

export const useStartHideThreadInfoBoxProcessStore =
  create<StartHideThreadInfoBoxProcessState>(
    startHideThreadInfoBoxProcessStore,
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

interface ShowOldVersionState {
  showOldVersion: boolean;
  setShowOldVersion: (showOldVersion: boolean) => void;
}

const showOldVersionStore = (set) => ({
  showOldVersion: false,
  setShowOldVersion: (showOldVersion: boolean) => {
    set((state) => ({
      showOldVersion: showOldVersion,
    }));
  },
});

export const useShowOldVersionStore =
  create<ShowOldVersionState>(showOldVersionStore);
