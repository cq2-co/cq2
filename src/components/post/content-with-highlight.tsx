import React from "react";
import { usePostOpenThreadsStore } from "@/state";
import { usePostStore } from "@/state";
import { usePostCurrentHighlightsStore } from "@/state";
import { find } from "lodash";
import {
  getNewPostOpenThreads,
  getNewPostCurrentHighlights,
} from "@/lib/utils";

type Props = {
  content: string | null;
  ranges: HighlightRange[];
};

interface HighlightRange {
  offset: number;
  length: number;
}

const ContentWithHighlight = ({ content, ranges }: Props) => {
  const { post, setNewPost } = usePostStore();
  const { postOpenThreads, setNewPostOpenThreads } = usePostOpenThreadsStore();
  const { postCurrentHighlights, setNewPostCurrentHighlights } =
    usePostCurrentHighlightsStore();

  return (
    <div className="text-[15px] leading-normal text-neutral-700">
      {highlight(
        content,
        ranges,
        post,
        setNewPostOpenThreads,
        postCurrentHighlights,
        setNewPostCurrentHighlights,
      )}
    </div>
  );
};

const highlight = (
  text,
  matched_substrings,
  post,
  setNewPostOpenThreads,
  postCurrentHighlights,
  setNewPostCurrentHighlights,
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
          post,
          setNewPostOpenThreads,
          postCurrentHighlights,
          setNewPostCurrentHighlights,
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
          post,
          setNewPostOpenThreads,
          postCurrentHighlights,
          setNewPostCurrentHighlights,
        ),
      );
    }
  }

  return returnText.map((text, i) => (
    <React.Fragment key={i}>{text}</React.Fragment>
  ));
};

const highlightText = (
  text,
  matched_substring,
  start,
  end,
  post,
  setNewPostOpenThreads,
  postCurrentHighlights,
  setNewPostCurrentHighlights,
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

  if (find(postCurrentHighlights, matched_substring)) {
    highlightColorStyle = "bg-[#FF5F1F]/10 decoration-[#FF5F1F]/90";
  } else {
    highlightColorStyle =
      "bg-[#eeeeee] hover:bg-[#e1e1e1] decoration-neutral-400";
  }

  // Return in array of JSX elements
  return [
    beforeText,
    <a
      key={highlightedText}
      className={`cursor-pointer underline decoration-2 underline-offset-4  ${highlightColorStyle}`}
      onClick={(e) => {
        e.preventDefault();
        setNewPostOpenThreads(
          getNewPostOpenThreads(matched_substring.to_thread_id, post),
        );
        setNewPostCurrentHighlights(
          getNewPostCurrentHighlights(matched_substring, postCurrentHighlights),
        );
      }}
    >
      {highlightedText}
    </a>,
    afterText,
  ];
};

export default ContentWithHighlight;
