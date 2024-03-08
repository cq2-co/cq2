import React from "react";
import { useDMOpenThreadsStore } from "@/state";
import { useDMStore } from "@/state";
import { useDMCurrentHighlightsStore } from "@/state";
import { find } from "lodash";
import { getNewDMOpenThreads, getNewDMCurrentHighlights } from "@/lib/utils";

type Props = {
  content: string | null;
  ranges: HighlightRange[];
};

interface HighlightRange {
  offset: number;
  length: number;
}

const ContentWithHighlight = ({ content, ranges }: Props) => {
  const { dm, setNewDM } = useDMStore();
  const { dmOpenThreads, setNewDMOpenThreads } = useDMOpenThreadsStore();
  const { dmCurrentHighlights, setNewDMCurrentHighlights } =
    useDMCurrentHighlightsStore();

  return (
    <div className="text-neutral-700">
      {highlight(
        content,
        ranges,
        dm,
        setNewDMOpenThreads,
        dmCurrentHighlights,
        setNewDMCurrentHighlights,
      )}
    </div>
  );
};

const highlight = (
  text,
  matched_substrings,
  dm,
  setNewDMOpenThreads,
  dmCurrentHighlights,
  setNewDMCurrentHighlights,
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
          dm,
          setNewDMOpenThreads,
          dmCurrentHighlights,
          setNewDMCurrentHighlights,
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
          dm,
          setNewDMOpenThreads,
          dmCurrentHighlights,
          setNewDMCurrentHighlights,
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
  dm,
  setNewDMOpenThreads,
  dmCurrentHighlights,
  setNewDMCurrentHighlights,
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

  if (find(dmCurrentHighlights, matched_substring)) {
    highlightColorStyle = "bg-[#FF5F1F]/10 decoration-[#FF5F1F]/90";
  } else {
    highlightColorStyle =
      "bg-[#e1e1e1] hover:bg-[#d7d7d7] decoration-neutral-400";
  }

  // Return in array of JSX elements
  return [
    beforeText,
    <a
      key={highlightedText}
      className={`cursor-pointer underline decoration-2 underline-offset-4 transition duration-100 ${highlightColorStyle}`}
      onClick={(e) => {
        e.preventDefault();
        setNewDMOpenThreads(
          getNewDMOpenThreads(matched_substring.to_thread_id, dm),
        );
        setNewDMCurrentHighlights(
          getNewDMCurrentHighlights(matched_substring, dmCurrentHighlights),
        );
      }}
    >
      {highlightedText}
    </a>,
    afterText,
  ];
};

export default ContentWithHighlight;
