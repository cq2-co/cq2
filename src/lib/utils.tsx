import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getNewDiscussionOpenThreads(thread_id, discussion) {
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
}

export function getNewDiscussionCurrentHighlights(
  matched_substring,
  discussionCurrentHighlights,
) {
  let newCurrentHighlights = [];

  newCurrentHighlights = discussionCurrentHighlights.filter(
    (highlight) => highlight.from_thread_id < matched_substring.from_thread_id,
  );

  newCurrentHighlights.push(matched_substring);

  return newCurrentHighlights;
}

export function getThreadParticipantsInfo(discussion, thread_id) {
  const thread = discussion.threads.filter(
    (thread) => thread.thread_id === thread_id,
  )[0];

  const numCommentsInThread = (
    <>
      {thread.comments.length}{" "}
      {thread.comments.length === 1 ? "comment" : "comments"}
    </>
  );

  const alluniqueParticipantsInThread = thread.comments.map(
    (comment) => comment.user_name,
  );

  const uniqueParticipantsInThread = Array.from(
    new Set(alluniqueParticipantsInThread),
  );

  let uniqueParticipantsInThreadDisplay = <></>;

  if (uniqueParticipantsInThread.length === 0) {
    uniqueParticipantsInThreadDisplay = <></>;
  } else if (uniqueParticipantsInThread.length === 1) {
    uniqueParticipantsInThreadDisplay = <>{uniqueParticipantsInThread[0]}</>;
  } else if (uniqueParticipantsInThread.length === 2) {
    uniqueParticipantsInThreadDisplay = (
      <>
        {uniqueParticipantsInThread[0]} and {uniqueParticipantsInThread[1]}
      </>
    );
  } else if (uniqueParticipantsInThread.length === 3) {
    uniqueParticipantsInThreadDisplay = (
      <>
        {uniqueParticipantsInThread[0]}, {uniqueParticipantsInThread[1]} and{" "}
        {uniqueParticipantsInThread[2]}
      </>
    );
  } else if (uniqueParticipantsInThread.length === 4) {
    uniqueParticipantsInThreadDisplay = (
      <>
        {uniqueParticipantsInThread[0]}, {uniqueParticipantsInThread[1]},{" "}
        {uniqueParticipantsInThread[2]} and 1 other participant
      </>
    );
  } else {
    uniqueParticipantsInThreadDisplay = (
      <>
        {uniqueParticipantsInThread[0]}, {uniqueParticipantsInThread[1]},{" "}
        {uniqueParticipantsInThread[2]} and{" "}
        {uniqueParticipantsInThread.length - 3} other participants
      </>
    );
  }

  return (
    <>
      <span className="text-neutral-700">{numCommentsInThread}</span>
      {uniqueParticipantsInThread.length > 0 && (
        <span className="ml-3 text-neutral-500">
          by {uniqueParticipantsInThreadDisplay}
        </span>
      )}
    </>
  );
}