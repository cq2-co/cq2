import parse from "html-react-parser";
import { find } from "lodash";
import { toRange } from "xpath-range";

type Props = {
  containerId: string;
  content: string | null;
  highlights: HighlightRange[];
  CQ2DocumentCurrentHighlights: object[];
};

interface HighlightRange {
  offset: number;
  length: number;
}

const ContentWithHighlight = ({
  containerId,
  content,
  highlights,
  CQ2DocumentCurrentHighlights,
}: Props) => {
  highlights.forEach((r) => delete r._id);

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

    if (find(CQ2DocumentCurrentHighlights, highlight)) {
      highlightSpan.className = "cq2-highlight-span-active";
    } else {
      highlightSpan.className = "cq2-highlight-span-inactive";
    }

    highlightSpan.appendChild(rangeContents);

    [...highlightSpan.getElementsByTagName("code")].forEach((codeElement) => {
      codeElement.className = highlightSpan.className;
    });

    range.insertNode(highlightSpan);
  }

  return (
    <div id={containerId} className="cq2-text-container text-neutral-700">
      {parse(processedContent.innerHTML)}
    </div>
  );
};

export default ContentWithHighlight;
