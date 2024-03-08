import { create } from "zustand";
import { PostData } from "@/lib/post-dummy-data";
import { ChatData } from "@/lib/chat-dummy-data";
import { DMData } from "./lib/dm-dummy-data";

// Post

interface PostState {
  post: object;
  setNewPost: (post: object) => void;
}

const postStore = (set) => ({
  post: PostData,
  setNewPost: (post: object) => {
    set((state) => ({
      post: post,
    }));
  },
});

export const usePostStore = create<PostState>(postStore);

interface PostOpenThreadsState {
  postOpenThreads: number[];
  setNewPostOpenThreads: (postOpenThreads: number[]) => void;
}

const postOpenThreadsStore = (set) => ({
  postOpenThreads: [],
  setNewPostOpenThreads: (postOpenThreads: number[]) => {
    set((state) => ({
      postOpenThreads: postOpenThreads,
    }));
  },
});

export const usePostOpenThreadsStore =
  create<PostOpenThreadsState>(postOpenThreadsStore);

interface PostCurrentHighlightsState {
  postCurrentHighlights: object[];
  setNewPostCurrentHighlights: (postCurrentHighlights: object[]) => void;
}

const postCurrentHighlightsStore = (set) => ({
  postCurrentHighlights: [],
  setNewPostCurrentHighlights: (postCurrentHighlights: object[]) => {
    set((state) => ({
      postCurrentHighlights: postCurrentHighlights,
    }));
  },
});

export const usePostCurrentHighlightsStore = create<PostCurrentHighlightsState>(
  postCurrentHighlightsStore,
);

// Chat

interface ChatState {
  chat: object;
  setNewChat: (chat: object) => void;
}

const chatStore = (set) => ({
  chat: ChatData,
  setNewChat: (chat: object) => {
    set((state) => ({
      chat: chat,
    }));
  },
});

export const useChatStore = create<ChatState>(chatStore);

interface ChatOpenThreadsState {
  chatOpenThreads: number[];
  setNewChatOpenThreads: (chatOpenThreads: number[]) => void;
}

const chatOpenThreadsStore = (set) => ({
  chatOpenThreads: [],
  setNewChatOpenThreads: (chatOpenThreads: number[]) => {
    set((state) => ({
      chatOpenThreads: chatOpenThreads,
    }));
  },
});

export const useChatOpenThreadsStore =
  create<ChatOpenThreadsState>(chatOpenThreadsStore);

interface ChatCurrentHighlightsState {
  chatCurrentHighlights: object[];
  setNewChatCurrentHighlights: (chatCurrentHighlights: object[]) => void;
}

const chatCurrentHighlightsStore = (set) => ({
  chatCurrentHighlights: [],
  setNewChatCurrentHighlights: (chatCurrentHighlights: object[]) => {
    set((state) => ({
      chatCurrentHighlights: chatCurrentHighlights,
    }));
  },
});

export const useChatCurrentHighlightsStore = create<ChatCurrentHighlightsState>(
  chatCurrentHighlightsStore,
);

// DM

interface DMState {
  dm: object;
  setNewDM: (dm: object) => void;
}

const dmStore = (set) => ({
  dm: DMData,
  setNewDM: (dm: object) => {
    set((state) => ({
      dm: dm,
    }));
  },
});

export const useDMStore = create<DMState>(dmStore);

interface DMOpenThreadsState {
  dmOpenThreads: number[];
  setNewDMOpenThreads: (dmOpenThreads: number[]) => void;
}

const dmOpenThreadsStore = (set) => ({
  dmOpenThreads: [],
  setNewDMOpenThreads: (dmOpenThreads: number[]) => {
    set((state) => ({
      dmOpenThreads: dmOpenThreads,
    }));
  },
});

export const useDMOpenThreadsStore =
  create<DMOpenThreadsState>(dmOpenThreadsStore);

interface DMCurrentHighlightsState {
  dmCurrentHighlights: object[];
  setNewDMCurrentHighlights: (dmCurrentHighlights: object[]) => void;
}

const dmCurrentHighlightsStore = (set) => ({
  dmCurrentHighlights: [],
  setNewDMCurrentHighlights: (dmCurrentHighlights: object[]) => {
    set((state) => ({
      dmCurrentHighlights: dmCurrentHighlights,
    }));
  },
});

export const useDMCurrentHighlightsStore = create<DMCurrentHighlightsState>(
  dmCurrentHighlightsStore,
);

// Top nav

interface TopNavTitleState {
  topNavTitle: string;
  setTopNavTitle: (topNavTitle: string) => void;
}

const topNavTitleStore = (set) => ({
  topNavTitle: "",
  setTopNavTitle: (topNavTitle: string) => {
    set((state) => ({
      topNavTitle: topNavTitle,
    }));
  },
});

export const useTopNavTitleStore = create<TopNavTitleState>(topNavTitleStore);

// Left nav

interface LeftNavCurrentlyOpenedState {
  leftNavCurrentlyOpened: string;
  setLeftNavCurrentlyOpened: (leftNavCurrentlyOpened: string) => void;
}

const leftNavCurrentlyOpenedStore = (set) => ({
  leftNavCurrentlyOpened: "",
  setLeftNavCurrentlyOpened: (leftNavCurrentlyOpened: string) => {
    set((state) => ({
      leftNavCurrentlyOpened: leftNavCurrentlyOpened,
    }));
  },
});

export const useLeftNavCurrentlyOpenedStore =
  create<LeftNavCurrentlyOpenedState>(leftNavCurrentlyOpenedStore);
