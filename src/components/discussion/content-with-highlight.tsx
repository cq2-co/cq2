import React from "react";
import { useDiscussionOpenThreadsStore } from "@/state";
import { useDiscussionStore } from "@/state";
import { useDiscussionCurrentHighlightsStore } from "@/state";
import { find } from "lodash";
import {
  getNewDiscussionOpenThreads,
  getNewDiscussionCurrentHighlights,
  getThreadParticipantsInfo,
} from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
  const { discussionCurrentHighlights, setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();

  ranges.forEach((r) => delete r._id);

  return (
    <div className="text-neutral-700">
      {highlight(
        content,
        ranges,
        discussion,
        setNewDiscussionOpenThreads,
        discussionCurrentHighlights,
        setNewDiscussionCurrentHighlights,
      )}
    </div>
  );
};

const highlight = (
  text,
  matched_substrings,
  discussion,
  setNewDiscussionOpenThreads,
  discussionCurrentHighlights,
  setNewDiscussionCurrentHighlights,
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
          setNewDiscussionOpenThreads,
          discussionCurrentHighlights,
          setNewDiscussionCurrentHighlights,
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
          setNewDiscussionOpenThreads,
          discussionCurrentHighlights,
          setNewDiscussionCurrentHighlights,
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
  discussion,
  setNewDiscussionOpenThreads,
  discussionCurrentHighlights,
  setNewDiscussionCurrentHighlights,
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

  let textComponent = <></>;

  if (find(discussionCurrentHighlights, matched_substring)) {
    highlightColorStyle = "bg-[#FF5F1F]/10 decoration-[#FF5F1F]/90";
    textComponent = (
      <a
        className={`cursor-pointer underline decoration-2 underline-offset-4 transition duration-100 ${highlightColorStyle}`}
        onClick={(e) => {
          e.preventDefault();
          setNewDiscussionOpenThreads(
            getNewDiscussionOpenThreads(
              matched_substring.to_thread_id,
              discussion,
            ),
          );
          setNewDiscussionCurrentHighlights(
            getNewDiscussionCurrentHighlights(
              matched_substring,
              discussionCurrentHighlights,
            ),
          );
        }}
      >
        {highlightedText}
      </a>
    );
  } else {
    highlightColorStyle =
      "bg-[#eeeeee] hover:bg-[#dadada] decoration-neutral-400";
    textComponent = (
      <HoverCard key={highlightedText} openDelay={50} closeDelay={100}>
        <HoverCardTrigger>
          <a
            className={`cursor-pointer underline decoration-2 underline-offset-4 transition duration-100 ${highlightColorStyle}`}
            onClick={(e) => {
              e.preventDefault();
              setNewDiscussionOpenThreads(
                getNewDiscussionOpenThreads(
                  matched_substring.to_thread_id,
                  discussion,
                ),
              );
              setNewDiscussionCurrentHighlights(
                getNewDiscussionCurrentHighlights(
                  matched_substring,
                  discussionCurrentHighlights,
                ),
              );
            }}
          >
            {highlightedText}
          </a>
        </HoverCardTrigger>
        <HoverCardContent
          side="right"
          className="comment-info flex h-8 w-auto items-center justify-center rounded-none p-3 text-xs font-medium"
        >
          {getThreadParticipantsInfo(
            discussion,
            matched_substring.to_thread_id,
          )}
        </HoverCardContent>
      </HoverCard>
    );
  }

  return [beforeText, textComponent, afterText];
};

export default ContentWithHighlight;
