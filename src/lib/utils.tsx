import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { inter, satoshi } from "@/app/fonts";
import { CheckSquare } from "lucide-react";
import {
  useDiscussionCurrentHighlightsStore,
  useDiscussionOpenThreadsStore,
  useDiscussionStore,
} from "@/state";

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

  let hasThreadsInside = false;

  if (
    thread.comments.some((comment) => comment.highlights.length > 0) ||
    thread.comments.some((comment) => comment.whole_to_thread_id !== -1)
  ) {
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
      {concludedComment && (
        <span className="ml-5 text-green-600">Concluded</span>
      )}
    </div>
  );
}

function getTruncatedText(text) {
  return (
    text
      .replace("</p><p></p><p>", " ")
      .replace("<p>", "")
      .replace("</p>", "")
      .substring(0, 42) + "..."
  );
}

function CQ2ThreadTree(
  discussion,
  thread_id,
  discussionOpenThreads,
  setNewDiscussionOpenThreads,
  discussionCurrentHighlights,
  setNewDiscussionCurrentHighlights,
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

  return (
    <>
      <span
        className="group w-fit cursor-pointer"
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
        }}
      >
        <span className="text-neutral-600 transition duration-200 group-hover:text-neutral-700">
          {thread.quote_by}
        </span>
        <span className="text-neutral-500 transition duration-200 group-hover:text-neutral-600">
          {" "}
          - {getTruncatedText(thread.quote)}
        </span>

        <span className="ml-3 text-neutral-400 transition duration-200 group-hover:text-neutral-500">
          {numCommentsInThread}
        </span>
        {concludedComment && (
          <span className="ml-3 text-green-600">Concluded</span>
        )}
      </span>
      <span>
        {thread.comments.map((comment) =>
          CQ2TreeFromComment(
            discussion,
            comment,
            discussionOpenThreads,
            setNewDiscussionOpenThreads,
            discussionCurrentHighlights,
            setNewDiscussionCurrentHighlights,
            thread.thread_id,
          ),
        )}
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
  threadID,
) {
  return (
    <ul className="cq2-tree-ul flex flex-col">
      {comment.whole_to_thread_id && comment.whole_to_thread_id !== -1 && (
        <li className="flex flex-col pt-3">
          <span>
            {CQ2ThreadTree(
              discussion,
              comment.whole_to_thread_id,
              discussionOpenThreads,
              setNewDiscussionOpenThreads,
              discussionCurrentHighlights,
              setNewDiscussionCurrentHighlights,
              {
                highlight_id: -1,
                offset: -1,
                length: -1,
                paragraph_id: -1,
                from_thread_id: threadID,
                to_thread_id: comment.whole_to_thread_id,
              },
            )}
          </span>
        </li>
      )}
      {comment.highlights
        .sort((a, b) => a.paragraph_id - b.paragraph_id || a.offset - b.offset)
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
                highlight,
              )}
            </span>
          </li>
        ))}
    </ul>
  );
}

export function CQ2Tree(discussion) {
  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
  const { discussionCurrentHighlights, setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();

  return (
    <div
      className={`${satoshi.className} flex flex-col p-1 text-sm font-medium`}
    >
      <span
        className="mb-3 flex w-fit cursor-pointer flex-col text-base text-neutral-700"
        onClick={() => {
          setNewDiscussionOpenThreads([]);
          setNewDiscussionCurrentHighlights([]);
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
          0,
        ),
      )}
    </div>
  );
}
