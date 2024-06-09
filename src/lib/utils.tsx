import { inter, satoshi } from "@/app/fonts";
import {
  useDiscussionCurrentHighlightsStore,
  useDiscussionOpenThreadsStore,
  useDiscussionUnreadCommentsStore,
} from "@/state";
import { clsx, type ClassValue } from "clsx";
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

    if (parentObject && parentObject.from_thread_id !== 0) {
      newOpenThreads.push(parentObject.from_thread_id);
      findParents(parentObject.from_thread_id);
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

export const ThreadInfoForHighlight = ({ discussion, thread_id }) => {
  const { discussionUnreadComments, setNewDiscussionUnreadComments } =
    useDiscussionUnreadCommentsStore();

  const thread = discussion.threads.filter(
    (thread) => thread.thread_id === thread_id,
  )[0];

  let hasThreadsInside = false;

  if (thread.comments.some((comment) => comment.highlights.length > 0)) {
    hasThreadsInside = true;
  }

  const numCommentsInThread = (
    <>
      {thread.comments.length}
      {thread.comments.length === 1 ? " comment" : " comments"}
      {hasThreadsInside ? " (threads inside)" : ""}
    </>
  );

  const allUniqueParticipantsInThread = thread.comments.map(
    (comment) => comment.user_name,
  );

  const uniqueParticipantsInThread = Array.from(
    new Set(allUniqueParticipantsInThread),
  );

  const concludedComment = thread.comments.filter(
    (comment) => comment.is_conclusion === true,
  )[0];

  const unreadComments = discussionUnreadComments[thread_id] > 0 ? true : false;

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
    <div className={inter.className}>
      <span className="text-neutral-700">{numCommentsInThread}</span>
      {uniqueParticipantsInThread.length > 0 && (
        <span className=" text-neutral-500">
          {" "}
          — by {uniqueParticipantsInThreadDisplay}
        </span>
      )}
      {unreadComments && (
        <span className="ml-5 rounded-2xl bg-[#ffedb1] px-1.5 py-0.5 text-neutral-700">
          Unread comments
        </span>
      )}
      {concludedComment && (
        <span className="ml-2 rounded-2xl bg-green-500 px-1.5 py-0.5 text-white">
          Concluded
        </span>
      )}
    </div>
  );
};

function getTruncatedText(text) {
  return (
    text
      .replaceAll("</p><p></p><p>", " ")
      .replaceAll("<p>", "")
      .replaceAll("</p>", "")
      .substring(0, 42) + "..."
  );
}

export const CQ2Tree = ({ discussion, setShowTreePopover }) => {
  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
  const { discussionCurrentHighlights, setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();
  const { discussionUnreadComments, setNewDiscussionUnreadComments } =
    useDiscussionUnreadCommentsStore();

  function CQ2ThreadTree(
    discussion,
    thread_id,
    discussionOpenThreads,
    setNewDiscussionOpenThreads,
    discussionCurrentHighlights,
    setNewDiscussionCurrentHighlights,
    discussionUnreadComments,
    highlight,
  ) {
    const thread = discussion.threads.filter(
      (thread) => thread.thread_id === thread_id,
    )[0];

    const numCommentsInThread = (
      <>
        {thread.comments.length}
        {thread.comments.length === 1 ? " comment" : " comments"}
      </>
    );

    const concludedComment = thread.comments.filter(
      (comment) => comment.is_conclusion === true,
    )[0];

    const unreadThreadComments =
      discussionUnreadComments[thread_id] > 0 ? true : false;

    return (
      <>
        <span
          className="group flex w-fit cursor-pointer"
          onClick={() => {
            setNewDiscussionOpenThreads(
              getNewDiscussionOpenThreads(thread_id, discussion),
            );
            setNewDiscussionCurrentHighlights(
              getNewDiscussionCurrentHighlights(
                highlight,
                discussionCurrentHighlights,
              ),
            );
            setShowTreePopover(false);
          }}
        >
          <span className="mr-1 text-neutral-600 transition duration-200 group-hover:text-neutral-700">
            {thread.quote_by}
          </span>
          <span className="text-neutral-500 transition duration-200 group-hover:text-neutral-600">
            - {getTruncatedText(thread.quote)}
          </span>

          <span className="ml-3 text-neutral-400 transition duration-200 group-hover:text-neutral-500">
            {numCommentsInThread}
          </span>
          {unreadThreadComments && (
            <span className="ml-5 rounded-2xl bg-[#ffedb1] px-1.5 py-0.5 text-xs text-neutral-700">
              Unread comments
            </span>
          )}
          {concludedComment && (
            <span className="ml-2 rounded-2xl bg-green-500 px-1.5 py-0.5 text-xs text-white">
              Concluded
            </span>
          )}
        </span>
        <span>
          {thread.comments.map((comment) => (
            <span key={comment.comment_id}>
              {CQ2TreeFromComment(
                discussion,
                comment,
                discussionOpenThreads,
                setNewDiscussionOpenThreads,
                discussionCurrentHighlights,
                setNewDiscussionCurrentHighlights,
                discussionUnreadComments,
                thread.thread_id,
              )}
            </span>
          ))}
        </span>
      </>
    );
  }

  function CQ2TreeFromComment(
    discussion,
    comment,
    discussionOpenThreads,
    setNewDiscussionOpenThreads,
    discussionCurrentHighlights,
    setNewDiscussionCurrentHighlights,
    discussionUnreadComments,
    threadID,
  ) {
    return (
      <ul className="cq2-tree-ul flex flex-col">
        {comment.highlights
          .sort(
            (a, b) => a.paragraph_id - b.paragraph_id || a.offset - b.offset,
          )
          .map((highlight) => (
            <li key={highlight.highlight_id} className="flex flex-col pt-3">
              <span>
                {CQ2ThreadTree(
                  discussion,
                  highlight.to_thread_id,
                  discussionOpenThreads,
                  setNewDiscussionOpenThreads,
                  discussionCurrentHighlights,
                  setNewDiscussionCurrentHighlights,
                  discussionUnreadComments,
                  highlight,
                )}
              </span>
            </li>
          ))}
      </ul>
    );
  }

  return (
    <div
      className={`${satoshi.className} flex flex-col p-1 text-sm font-medium`}
    >
      {discussion.threads.length > 0 ? (
        <>
          <span
            className="mb-3 flex w-fit cursor-pointer flex-col text-base text-neutral-700"
            onClick={() => {
              setNewDiscussionOpenThreads([]);
              setNewDiscussionCurrentHighlights([]);
              setShowTreePopover(false);
            }}
          >
            {discussion.title}
          </span>
          {CQ2TreeFromComment(
            discussion,
            discussion,
            discussionOpenThreads,
            setNewDiscussionOpenThreads,
            discussionCurrentHighlights,
            setNewDiscussionCurrentHighlights,
            discussionUnreadComments,
            0,
          )}
          {discussion.comments.map((comment) =>
            CQ2TreeFromComment(
              discussion,
              comment,
              discussionOpenThreads,
              setNewDiscussionOpenThreads,
              discussionCurrentHighlights,
              setNewDiscussionCurrentHighlights,
              discussionUnreadComments,
              0,
            ),
          )}
        </>
      ) : (
        <span className="text-neutral-700">No threads created yet</span>
      )}
    </div>
  );
};
