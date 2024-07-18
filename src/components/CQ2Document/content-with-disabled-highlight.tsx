import parse from "html-react-parser";
import { toRange } from "xpath-range";

type Props = {
  content: string | null;
  highlights: HighlightRange[];
};

interface HighlightRange {
  offset: number;
  length: number;
}

const ContentWithDisabledHighlight = ({ content, highlights }: Props) => {
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

    highlightSpan.className = "cq2-highlight-disabled-span";

    highlightSpan.appendChild(rangeContents);

    [...highlightSpan.getElementsByTagName("code")].forEach((codeElement) => {
      codeElement.className = highlightSpan.className;
    });

    range.insertNode(highlightSpan);
  }

  return (
    <div className="thread-info-comment-container text-neutral-700">
      {parse(processedContent.innerHTML)}
    </div>
  );
};

export default ContentWithDisabledHighlight;
