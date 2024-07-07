import { Separator } from "@/components/ui/separator";
import {
  useCQ2DocumentCurrentHighlightsStore,
  useCQ2DocumentOpenThreadsStore,
  useCQ2DocumentUnreadCommentsStore,
  useShowOldVersionStore,
} from "@/state";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import parse from "html-react-parser";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function getNewCQ2DocumentCurrentHighlightsFromOpenThreads(
  CQ2DocumentOpenThreads,
  CQ2Document,
) {
  let newCurrentHighlights = [];

  for (let i = 0; i < CQ2DocumentOpenThreads.length; i++) {
    const currThread = CQ2Document.version1.threads.filter(
      (_thread) => _thread.thread_id === CQ2DocumentOpenThreads[i],
    )[0];

    let comment;
    let highlight;

    if (currThread.from_thread_id === 0 && currThread.from_comment_id === -1) {
      highlight = CQ2Document.version1.highlights.filter(
        (_highlight) =>
          _highlight.highlight_id === currThread.from_highlight_id,
      )[0];
    } else if (currThread.from_thread_id === 0) {
      comment = CQ2Document.version1.comments.filter(
        (_comment) => _comment.comment_id === currThread.from_comment_id,
      )[0];
      highlight = comment.highlights.filter(
        (_highlight) =>
          _highlight.highlight_id === currThread.from_highlight_id,
      )[0];
    } else {
      const parentThread = CQ2Document.version1.threads.filter(
        (_thread) => _thread.thread_id === currThread.from_thread_id,
      )[0];
      comment = parentThread.comments.filter(
        (_comment) => _comment.comment_id === currThread.from_comment_id,
      )[0];
      highlight = comment.highlights.filter(
        (_highlight) =>
          _highlight.highlight_id === currThread.from_highlight_id,
      )[0];
    }

    newCurrentHighlights.push(highlight);
  }

  return newCurrentHighlights;
}

export function getNewCQ2DocumentCurrentHighlightsFromCurrentHighlights(
  highlight,
  CQ2DocumentCurrentHighlights,
) {
  let newCurrentHighlights = [];

  newCurrentHighlights = CQ2DocumentCurrentHighlights.filter(
    (_highlight) => _highlight.thread_id < highlight.thread_id,
  );

  newCurrentHighlights.push(highlight);

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

  return (
    <div className="h-[calc(100vh/2)] w-full overflow-y-auto px-2 pb-2">
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
            CQ2Document._id !== "demo" && (
              <span className="ml-2 rounded-md bg-blue-50 px-1.5 py-0 font-normal text-blue-600">
                Unread comments
              </span>
            )}
          {concludedComment && (
            <span className="ml-2 rounded-md bg-green-50 px-1.5 py-0 font-normal text-green-500">
              Concluded
            </span>
          )}
        </div>
      </div>
      <Separator className="mb-5 mt-2" />
      <div className="flex flex-row justify-between text-neutral-400">
        <div className={`w-full`}>
          <span
            className={`mb-3 flex items-center text-xs font-semibold text-neutral-700`}
          >
            {thread.quote_by}
          </span>
          <div className="cq2-text-container border-l-4 border-CQ2Orange-600/50 pl-3 text-xs font-normal text-neutral-700">
            {parse(thread.quote)}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {thread.comments.map((comment) => (
          <div className={"flex w-full flex-col"} key={comment.comment_id}>
            <Separator className="my-5" />
            <div
              className={`flex h-6 flex-col justify-between text-xs font-semibold text-neutral-700`}
            >
              <div>
                {comment.user_name}
                <span className="ml-2 text-[0.5rem] font-normal text-neutral-400">
                  {dayjs(comment.created_on).format("MMM DD, YYYY")},{" "}
                  {dayjs(comment.created_on).format("hh:mm A")}
                </span>
                {comment.is_conclusion && (
                  <span className="ml-3 text-[0.5rem] font-normal text-green-600">
                    Conclusion
                  </span>
                )}
              </div>
            </div>
            {!comment.for_new_thread_created ? (
              <div className="cq2-text-container font-normal text-neutral-700">
                {parse(comment.content)}
              </div>
            ) : (
              <div>
                <span className="text-neutral-400">
                  Created a new thread for:
                </span>{" "}
                <span className="font-medium text-neutral-600 underline">
                  {comment.for_new_thread_created_quote}
                </span>
              </div>
            )}
          </div>
        ))}
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
  const { showOldVersion, setShowOldVersion } = useShowOldVersionStore();

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
            const newCQ2DocumentOpenThreads = getNewCQ2DocumentOpenThreads(
              thread_id,
              CQ2Document,
            );
            setNewCQ2DocumentOpenThreads(newCQ2DocumentOpenThreads);
            setNewCQ2DocumentCurrentHighlights(
              getNewCQ2DocumentCurrentHighlightsFromOpenThreads(
                newCQ2DocumentOpenThreads,
                CQ2Document,
              ),
            );

            setShowTreePopover(false);
            setShowOldVersion(true);
          }}
        >
          <span
            className={`${
              CQ2DocumentOpenThreads.includes(thread_id)
                ? "border-b-2 border-[#FF8B67] bg-[#FFEFEB] px-1"
                : "group-hover:text-neutral-800"
            } mr-1 font-medium text-neutral-600 transition duration-200`}
          >
            {thread.quote_by.split(" ")[0]}
          </span>
          -
          <span
            className={`${
              CQ2DocumentOpenThreads.includes(thread_id)
                ? "border-b-2 border-[#FF8B67] bg-[#FFEFEB] px-1"
                : "group-hover:text-neutral-800"
            } ml-1 text-neutral-500 transition duration-200`}
          >
            {getTruncatedText(thread.quote)}
          </span>
          <span
            className={`${
              CQ2DocumentOpenThreads.includes(thread_id)
                ? "border-b-2 border-[#FF8B67] bg-[#FFEFEB] px-1"
                : "group-hover:text-neutral-800"
            } ml-5 mr-3 text-neutral-500 transition duration-200`}
          >
            <span
              className={`${
                CQ2DocumentOpenThreads.includes(thread_id)
                  ? ""
                  : "group-hover:text-neutral-800"
              }  font-medium text-neutral-600 transition duration-200`}
            >
              {thread.comments.length}
            </span>
            {thread.comments.length === 1 ? " comment" : " comments"}
          </span>
          {unreadThreadComments && CQ2Document._id !== "demo" && (
            <span className="ml-2 rounded-lg bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600">
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
            From document
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
            From general comments
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
        !CQ2Document.version1.comments.some(
          (comment) => comment.highlights.length > 0,
        ) && <span className="text-neutral-400">No threads created yet</span>}
    </div>
  );
};
