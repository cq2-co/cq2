import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ThreadInfoForHighlight,
  getNewDiscussionCurrentHighlights,
  getNewDiscussionOpenThreads,
} from "@/lib/utils";
import {
  useDiscussionCurrentHighlightsStore,
  useDiscussionOpenThreadsStore,
  useDiscussionStore,
} from "@/state";
import parse from "html-react-parser";
import { find } from "lodash";
import React from "react";

type Props = {
  id: string;
  content: string | null;
  ranges: HighlightRange[];
};

interface HighlightRange {
  offset: number;
  length: number;
}

const ContentWithHighlight = ({ id, content, ranges }: Props) => {
  const { discussion, setNewDiscussion } = useDiscussionStore();
  const { discussionOpenThreads, setNewDiscussionOpenThreads } =
    useDiscussionOpenThreadsStore();
  const { discussionCurrentHighlights, setNewDiscussionCurrentHighlights } =
    useDiscussionCurrentHighlightsStore();

  ranges.forEach((r) => delete r._id);

  return (
    <div id={id} className="cq2-text-container text-neutral-700">
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
    return parse(text);
  }

  const finalText = [];

  const parsedText = new DOMParser().parseFromString(text, "text/html");
  const elementsInParsedText = parsedText.body.getElementsByTagName("*");

  let paraIdx = 0;

  for (let e = 0; e < elementsInParsedText.length; e++) {
    const finalParaText = [];

    if (elementsInParsedText[e].tagName === "BLOCKQUOTE") {
      finalParaText.push(
        <React.Fragment>
          <blockquote className="cq2-tiptap-blockquote">
            {parse(elementsInParsedText[e].innerHTML)}
          </blockquote>
        </React.Fragment>,
      );

      finalText.push(finalParaText);

      e = e + elementsInParsedText[e].childNodes.length;

      continue;
    }

    const matched_substrings_in_para = matched_substrings.filter(
      (a) => a.paragraph_id === paraIdx,
    );

    const textPara = elementsInParsedText[e].innerHTML;

    if (matched_substrings_in_para.length === 0) {
      finalParaText.push(
        <React.Fragment>
          <p>{textPara}</p>
        </React.Fragment>,
      );

      finalText.push(finalParaText);

      paraIdx++;

      continue;
    }

    const sorted_matched_substrings_in_para = matched_substrings_in_para.sort(
      (a, b) => a.offset - b.offset,
    );

    // Just iterate through all matches
    for (let i = 0; i < sorted_matched_substrings_in_para.length; i++) {
      const startOfNext = sorted_matched_substrings_in_para[i + 1]?.offset;
      if (i === 0) {
        // If its first match, we start from first character => start at index 0
        finalParaText.push(
          highlightText(
            textPara,
            sorted_matched_substrings_in_para[i],
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
        finalParaText.push(
          highlightText(
            textPara,
            sorted_matched_substrings_in_para[i],
            sorted_matched_substrings_in_para[i].offset,
            startOfNext,
            discussion,
            setNewDiscussionOpenThreads,
            discussionCurrentHighlights,
            setNewDiscussionCurrentHighlights,
          ),
        );
      }
    }

    finalText.push(<p>{finalParaText}</p>);

    paraIdx++;
  }

  return finalText.map((text, i) => (
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
        <HoverCardTrigger asChild>
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
          className="comment-info flex h-8 w-auto items-center justify-center rounded-none px-2 py-3 text-xs font-medium"
        >
          <ThreadInfoForHighlight
            discussion={discussion}
            thread_id={matched_substring.to_thread_id}
          />
        </HoverCardContent>
      </HoverCard>
    );
  }

  return [beforeText, textComponent, afterText];
};

export default ContentWithHighlight;
