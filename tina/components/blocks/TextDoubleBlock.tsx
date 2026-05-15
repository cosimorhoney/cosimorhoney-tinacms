import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

type TextDoubleBlockProps = {
  block: any;
  blockKey: string | number;
  isGrouped?: boolean;
};

export default function TextDoubleBlock({
  block,
  blockKey,
  isGrouped = false,
}: TextDoubleBlockProps) {
  const blockClassName = block.className || "";
  const BlockTag = isGrouped ? "div" : "section";

  return (
    <BlockTag key={blockKey} className={`:: text-double ${blockClassName}`}>
      <div className="text-double__content">
        <div
          className="text-double__left"
          data-tina-field={tinaField(block, "leftColumn")}
        >
          {block.brow && (
            <h3
              className="block-brow"
              data-tina-field={tinaField(block, "brow")}
            >
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
          <div data-tina-field={tinaField(block, "leftColumn")}>
            <TinaMarkdown content={block.leftColumn} />
          </div>
          {block.leftButtons?.map((button: any, buttonIndex: number) => (
            <a
              key={buttonIndex}
              href={button.link}
              className={`button ${button.classes}`}
              data-tina-field={tinaField(button, "title")}
            >
              {button.title}
            </a>
          ))}
        </div>
        <div
          className="text-double__right"
          data-tina-field={tinaField(block, "rightColumn")}
        >
          <div data-tina-field={tinaField(block, "rightColumn")}>
            <TinaMarkdown content={block.rightColumn} />
          </div>
          {block.rightButtons?.map((button: any, buttonIndex: number) => (
            <a
              key={buttonIndex}
              href={button.link}
              className={`button ${button.classes}`}
              data-tina-field={tinaField(button, "title")}
            >
              {button.title}
            </a>
          ))}
        </div>
      </div>
    </BlockTag>
  );
}
