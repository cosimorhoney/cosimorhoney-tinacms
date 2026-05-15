import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

type FAQBlockProps = {
  block: any;
  blockKey: string | number;
  isGrouped?: boolean;
};

export default function FAQBlock({
  block,
  blockKey,
  isGrouped = false,
}: FAQBlockProps) {
  const blockClassName = block.className || "";
  const BlockTag = isGrouped ? "div" : "section";

  return (
    <BlockTag key={blockKey} className={`:: faq ${blockClassName}`}>
      {block.brow && (
        <h3 className="block-brow" data-tina-field={tinaField(block, "brow")}>
          {block.brow}
        </h3>
      )}
      {block.heading && (
        <h2
          className="block-heading"
          data-tina-field={tinaField(block, "heading")}
        >
          {block.heading}
        </h2>
      )}
      <div className="faq-items">
        {block.items?.map((item: any, itemIndex: number) => (
          <details key={itemIndex} className="faq-item">
            <summary data-tina-field={tinaField(item, "question")}>
              {item.question}
            </summary>
            <div
              className="faq-answer"
              data-tina-field={tinaField(item, "answer")}
            >
              <TinaMarkdown content={item.answer} />
            </div>
          </details>
        ))}
      </div>
    </BlockTag>
  );
}
