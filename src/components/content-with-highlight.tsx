import React from "react";
import { useOpenThreadsStore } from "@/state";
import { useDiscussionStore } from "@/state";
import { useCurrentHighlightsStore } from "@/state";
import { find } from "lodash";

type Props = {
  content: string | null;
  ranges: HighlightRange[];
};

interface HighlightRange {
  offset: number;
  length: number;
}

const ContentWithHighlight = ({ content, ranges }: Props) => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const { openThreads, setNewOpenThreads } = useOpenThreadsStore();
  const { currentHighlights, setNewCurrentHighlights } =
    useCurrentHighlightsStore();

  return (
    <div className="text-neutral-700">
      {highlight(
        content,
        ranges,
        discussion,
        setNewOpenThreads,
        currentHighlights,
        setNewCurrentHighlights,
      )}
    </div>
  );
};

const highlight = (
  text,
  matched_substrings,
  discussion,
  setNewOpenThreads,
  currentHighlights,
  setNewCurrentHighlights,
) => {
  if (matched_substrings.length === 0) {
    return text;
  }

  const sorted_matched_substrings = matched_substrings.sort(
    (a, b) => a.offset - b.offset,
  );

  const returnText = [];

  // Just iterate through all matches
  for (let i = 0; i < sorted_matched_substrings.length; i++) {
    const startOfNext = sorted_matched_substrings[i + 1]?.offset;
    if (i === 0) {
      // If its first match, we start from first character => start at index 0
      returnText.push(
        highlightText(
          text,
          sorted_matched_substrings[i],
          0,
          startOfNext,
          discussion,
          setNewOpenThreads,
          currentHighlights,
          setNewCurrentHighlights,
        ),
      );
    } else {
      // If its not first match, we start from match.offset
      returnText.push(
        highlightText(
          text,
          sorted_matched_substrings[i],
          sorted_matched_substrings[i].offset,
          startOfNext,
          discussion,
          setNewOpenThreads,
          currentHighlights,
          setNewCurrentHighlights,
        ),
      );
    }
  }

  return returnText.map((text, i) => (
    <React.Fragment key={i}>{text}</React.Fragment>
  ));
};

const getNewOpenThreads = (thread_id, discussion) => {
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

const getNewCurrentHighlights = (matched_substring, currentHighlights) => {
  let newCurrentHighlights = [];

  newCurrentHighlights = currentHighlights.filter(
    (highlight) => highlight.from_thread_id < matched_substring.from_thread_id,
  );

  newCurrentHighlights.push(matched_substring);

  return newCurrentHighlights;
};

const highlightText = (
  text,
  matched_substring,
  start,
  end,
  discussion,
  setNewOpenThreads,
  currentHighlights,
  setNewCurrentHighlights,
) => {
  const highlightTextStart = matched_substring.offset;
  const highlightTextEnd = highlightTextStart + matched_substring.length;

  // The part before matched text
  const beforeText = text.slice(start, highlightTextStart);

  // Matched text
  const highlightedText = text.slice(highlightTextStart, highlightTextEnd);

  // Part after matched text
  // Till the end of text, or till next matched text
  const afterText = text.slice(highlightTextEnd, end || text.length);

  let highlightColorStyle = "";

  if (find(currentHighlights, matched_substring)) {
    highlightColorStyle = "bg-[#FF5F1F]/10 decoration-[#FF5F1F]/90";
  } else {
    highlightColorStyle =
      "bg-neutral-100 hover:bg-neutral-200 decoration-neutral-400";
  }

  // Return in array of JSX elements
  return [
    beforeText,
    <a
      key={highlightedText}
      className={`cursor-pointer underline decoration-2 underline-offset-4  ${highlightColorStyle}`}
      onClick={(e) => {
        e.preventDefault();
        setNewOpenThreads(
          getNewOpenThreads(matched_substring.to_thread_id, discussion),
        );
        setNewCurrentHighlights(
          getNewCurrentHighlights(matched_substring, currentHighlights),
        );
      }}
    >
      {highlightedText}
    </a>,
    afterText,
  ];
};

export default ContentWithHighlight;
