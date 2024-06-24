import {
  useCQ2DocumentCurrentHighlightsStore,
  useCQ2DocumentOpenThreadsStore,
  useCQ2DocumentUnreadCommentsStore,
} from "@/state";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import parse from "html-react-parser";
import { EllipsisVertical } from "lucide-react";
import { usePathname } from "next/navigation";
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
    const parentObject = CQ2Document.version1.threads.find(
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

  const thread = CQ2Document.version1.threads.filter(
    (thread) => thread.thread_id === thread_id,
  )[0];

  const threadHighlightsCount = thread.comments.reduce(
    (acc, comment) => acc + comment.highlights.length,
    0,
  );

  const concludedComment = thread.comments.filter(
    (comment) => comment.is_conclusion === true,
  )[0];

  const pathname = usePathname();

  return (
    <div className="w-full p-2">
      <div className="flex flex-row justify-between text-neutral-400">
        <div className="flex">
          <span className="mr-1 text-neutral-600">
            {thread.comments.length}
          </span>
          {thread.comments.length === 1 ? "comment" : "comments"}
          <span className="mx-2">·</span>
          <span className="mr-1 text-neutral-600">{threadHighlightsCount}</span>
          {" child "}
          {threadHighlightsCount === 1 ? "thread" : "threads"}
        </div>
        <div className="flex">
          {CQ2DocumentUnreadComments[thread_id] > 0 &&
            !pathname.includes("/app/demo") && (
              <span className="ml-2 rounded-md bg-blue-50 px-1.5 py-0 font-normal text-blue-600">
                {CQ2DocumentUnreadComments[thread_id]}
                {CQ2DocumentUnreadComments[thread_id] === 1
                  ? " unread comment"
                  : " unread comments"}
              </span>
            )}
          {concludedComment && (
            <span className="ml-2 rounded-md bg-green-50 px-1.5 py-0 font-normal text-green-500">
              Concluded
            </span>
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-row justify-between text-neutral-400">
        <div className={`w-full rounded-lg border p-5`}>
          <span
            className={`mb-3 flex items-center text-xs font-semibold text-neutral-700`}
          >
            {thread.quote_by}
          </span>
          <div className="cq2-text-container border-cq2Orange-600/50 border-l-4 pl-3 text-xs font-normal text-neutral-700">
            {parse(thread.quote)}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {thread.comments.slice(0, 2).map((comment) => (
          <div
            className={
              "mt-5 flex w-full flex-col rounded-lg border border-[#EDEDED] p-5"
            }
            key={comment.comment_id}
          >
            <div
              className={`mb-3 flex h-6 flex-col justify-between text-xs font-semibold text-neutral-700`}
            >
              <div id="comment-name-created-on">
                {comment.user_name}
                <span className="ml-3 text-xs font-normal text-neutral-400">
                  {dayjs(comment.created_on).format("DD/MM/YY hh:mm A")}
                </span>
              </div>
            </div>
            <div className="cq2-text-container font-normal text-neutral-700">
              {parse(comment.content)}
            </div>
          </div>
        ))}
        {thread.comments.length > 2 && (
          <div className="mt-5 flex items-center justify-center">
            <EllipsisVertical
              strokeWidth={2}
              className="h-4 w-4 text-neutral-400"
            />
          </div>
        )}
      </div>
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

  const pathname = usePathname();

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
    const thread = CQ2Document.version1.threads.filter(
      (thread) => thread.thread_id === thread_id,
    )[0];

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
          <span className="mr-1 font-medium text-neutral-600 transition duration-100 group-hover:text-neutral-800">
            {thread.quote_by.split(" ")[0]}
          </span>
          <span className="text-neutral-500 transition duration-100 group-hover:text-neutral-800">
            - {getTruncatedText(thread.quote)}
          </span>
          <span className="ml-5 text-neutral-400 transition duration-100 group-hover:text-neutral-800">
            <span className="text-neutral-600 transition duration-100 group-hover:text-neutral-800">
              {thread.comments.length}
            </span>
            {thread.comments.length === 1 ? " comment" : " comments"}
          </span>
          {unreadThreadComments && !pathname.includes("/app/demo") && (
            <span className="ml-5 rounded-lg bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600">
              Unread comments
            </span>
          )}
          {concludedComment && (
            <span className="ml-2 rounded-lg bg-green-50 px-1.5 py-0.5 text-xs text-green-600">
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
    <div className={`flex flex-col p-1 text-sm`}>
      {CQ2Document.version1.threads.length > 0 && (
        <>
          <span className="mb-1 flex w-fit flex-col text-neutral-400">
            Document
          </span>
          {CQ2TreeFromComment(
            CQ2Document,
            CQ2Document.version1,
            CQ2DocumentOpenThreads,
            setNewCQ2DocumentOpenThreads,
            CQ2DocumentCurrentHighlights,
            setNewCQ2DocumentCurrentHighlights,
            CQ2DocumentUnreadComments,
            0,
          )}
        </>
      )}
      {CQ2Document.version1.comments.some(
        (comment) => comment.highlights.length > 0,
      ) && (
        <>
          <span className="mb-1 mt-6 flex w-fit flex-col text-neutral-400">
            General comments
          </span>
          {CQ2Document.version1.comments.map((comment) =>
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
      )}
      {CQ2Document.version1.threads.length === 0 &&
        CQ2Document.version1.comments.some(
          (comment) => comment.highlights.length > 0,
        ) && <span className="text-neutral-700">No threads created yet</span>}
    </div>
  );
};
