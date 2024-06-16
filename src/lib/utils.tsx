import { inter, satoshi } from "@/app/fonts";
import {
  useCQ2DocumentCurrentHighlightsStore,
  useCQ2DocumentOpenThreadsStore,
  useCQ2DocumentUnreadCommentsStore,
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

export function getNewCQ2DocumentOpenThreads(thread_id, CQ2Document) {
  const newOpenThreads = [];

  function findParents(thread_id) {
    const parentObject = CQ2Document.threads.find(
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

export function getNewCQ2DocumentCurrentHighlights(
  matched_substring,
  CQ2DocumentCurrentHighlights,
) {
  let newCurrentHighlights = [];

  newCurrentHighlights = CQ2DocumentCurrentHighlights.filter(
    (highlight) => highlight.thread_id < matched_substring.thread_id,
  );

  newCurrentHighlights.push(matched_substring);

  return newCurrentHighlights;
}

export const ThreadInfoForHighlight = ({ CQ2Document, thread_id }) => {
  const { CQ2DocumentUnreadComments, setNewCQ2DocumentUnreadComments } =
    useCQ2DocumentUnreadCommentsStore();

  const thread = CQ2Document.threads.filter(
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

  const unreadComments =
    CQ2DocumentUnreadComments[thread_id] > 0 ? true : false;

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
    <div className={`${inter.className}`}>
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

export const CQ2Tree = ({ CQ2Document, setShowTreePopover }) => {
  const { CQ2DocumentOpenThreads, setNewCQ2DocumentOpenThreads } =
    useCQ2DocumentOpenThreadsStore();
  const { CQ2DocumentCurrentHighlights, setNewCQ2DocumentCurrentHighlights } =
    useCQ2DocumentCurrentHighlightsStore();
  const { CQ2DocumentUnreadComments, setNewCQ2DocumentUnreadComments } =
    useCQ2DocumentUnreadCommentsStore();

  function CQ2ThreadTree(
    CQ2Document,
    thread_id,
    CQ2DocumentOpenThreads,
    setNewCQ2DocumentOpenThreads,
    CQ2DocumentCurrentHighlights,
    setNewCQ2DocumentCurrentHighlights,
    CQ2DocumentUnreadComments,
    highlight,
  ) {
    const thread = CQ2Document.threads.filter(
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
      CQ2DocumentUnreadComments[thread_id] > 0 ? true : false;

    return (
      <>
        <span
          className="group flex w-fit cursor-pointer"
          onClick={() => {
            setNewCQ2DocumentOpenThreads(
              getNewCQ2DocumentOpenThreads(thread_id, CQ2Document),
            );
            setNewCQ2DocumentCurrentHighlights(
              getNewCQ2DocumentCurrentHighlights(
                highlight,
                CQ2DocumentCurrentHighlights,
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
                CQ2Document,
                comment,
                CQ2DocumentOpenThreads,
                setNewCQ2DocumentOpenThreads,
                CQ2DocumentCurrentHighlights,
                setNewCQ2DocumentCurrentHighlights,
                CQ2DocumentUnreadComments,
                thread.thread_id,
              )}
            </span>
          ))}
        </span>
      </>
    );
  }

  function CQ2TreeFromComment(
    CQ2Document,
    comment,
    CQ2DocumentOpenThreads,
    setNewCQ2DocumentOpenThreads,
    CQ2DocumentCurrentHighlights,
    setNewCQ2DocumentCurrentHighlights,
    CQ2DocumentUnreadComments,
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
                  CQ2Document,
                  highlight.to_thread_id,
                  CQ2DocumentOpenThreads,
                  setNewCQ2DocumentOpenThreads,
                  CQ2DocumentCurrentHighlights,
                  setNewCQ2DocumentCurrentHighlights,
                  CQ2DocumentUnreadComments,
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
      {CQ2Document.threads.length > 0 ? (
        <>
          <span
            className="mb-3 flex w-fit cursor-pointer flex-col text-base text-neutral-700"
            onClick={() => {
              setNewCQ2DocumentOpenThreads([]);
              setNewCQ2DocumentCurrentHighlights([]);
              setShowTreePopover(false);
            }}
          >
            {CQ2Document.title}
          </span>
          {CQ2TreeFromComment(
            CQ2Document,
            CQ2Document,
            CQ2DocumentOpenThreads,
            setNewCQ2DocumentOpenThreads,
            CQ2DocumentCurrentHighlights,
            setNewCQ2DocumentCurrentHighlights,
            CQ2DocumentUnreadComments,
            0,
          )}
          {CQ2Document.comments.map((comment) =>
            CQ2TreeFromComment(
              CQ2Document,
              comment,
              CQ2DocumentOpenThreads,
              setNewCQ2DocumentOpenThreads,
              CQ2DocumentCurrentHighlights,
              setNewCQ2DocumentCurrentHighlights,
              CQ2DocumentUnreadComments,
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
