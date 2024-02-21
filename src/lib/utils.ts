import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export function getNewOpenThreads(thread_id, discussion) {
  const newOpenThreads = [];

  function findParents(thread_id) {
    const parentObject = discussion.threads.find(
      (thread) => thread.thread_id === thread_id,
    );

    if (parentObject && parentObject.parent_thread_id !== 0) {
      newOpenThreads.push(parentObject.parent_thread_id);
      findParents(parentObject.parent_thread_id);
    }
  }

  findParents(thread_id);

  newOpenThreads.reverse();
  newOpenThreads.push(thread_id);

  return newOpenThreads;
};

export function getNewCurrentHighlights(matched_substring, currentHighlights) {
  let newCurrentHighlights = [];

  newCurrentHighlights = currentHighlights.filter(
    (highlight) => highlight.from_thread_id < matched_substring.from_thread_id,
  );

  newCurrentHighlights.push(matched_substring);

  return newCurrentHighlights;
};
