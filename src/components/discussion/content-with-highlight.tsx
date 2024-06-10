import { useDiscussionCurrentHighlightsStore } from "@/state";
import parse, { domToReact } from "html-react-parser";
import { find } from "lodash";
import { useEffect, useState } from "react";
import { toRange } from "xpath-range";

type Props = {
  id: string;
  content: string | null;
  highlights: HighlightRange[];
};

interface HighlightRange {
  offset: number;
  length: number;
}

const ContentWithHighlight = ({ id, content, highlights }: Props) => {
  const { discussionCurrentHighlights } = useDiscussionCurrentHighlightsStore();

  highlights.forEach((r) => delete r._id);

  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    setIsContentLoading(false);
  }, [setIsContentLoading]);

  let processedContent = document.createElement("div");

  processedContent.innerHTML = content;

  for (let i = 0; i < highlights.length; i++) {
    const highlight = highlights[i];

    const range = toRange(
      highlight.start,
      highlight.startOffset,
      highlight.end,
      highlight.endOffset,
      processedContent,
    );

    const rangeContents = range.extractContents();

    const highlightSpan = document.createElement("span");

    highlightSpan.dataset.info = `${highlight.thread_id}-${highlight.comment_id}-${highlight.highlight_id}-${highlight.to_thread_id}`;

    if (find(discussionCurrentHighlights, highlight)) {
      highlightSpan.className = "cq2-highlight-span-active";
    } else {
      highlightSpan.className = "cq2-highlight-span-inactive";
    }

    highlightSpan.appendChild(rangeContents);
    range.insertNode(highlightSpan);
  }

  const options = {
    replace({ attribs, children }) {
      if (!attribs) {
        return;
      }

      if (attribs.id === "main") {
        return (
          <h1 style={{ fontSize: 42 }}>{domToReact(children, options)}</h1>
        );
      }
    },
  };

  return (
    <div id={id} className="cq2-text-container text-neutral-700">
      {parse(processedContent.innerHTML, options)}
    </div>
  );
};

export default ContentWithHighlight;
