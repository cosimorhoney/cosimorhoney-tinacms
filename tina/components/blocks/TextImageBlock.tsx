import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

type TextImageBlockProps = {
  block: any;
  blockKey: string | number;
  isGrouped?: boolean;
};

export default function TextImageBlock({
  block,
  blockKey,
  isGrouped = false,
}: TextImageBlockProps) {
  const blockClassName = block.className || "";
  const BlockTag = isGrouped ? "div" : "section";

  return (
    <BlockTag key={blockKey} className={`:: text-image ${blockClassName}`}>
      <div className="text-image__content">
        <div
          className="text-image__image"
          data-tina-field={tinaField(block, "image")}
        >
          {block.image && (
            <img
              src={block.image}
              alt={block.imageAlt || ""}
              data-tina-field={tinaField(block, "image")}
            />
          )}
        </div>
        <div
          className="text-image__text"
          data-tina-field={tinaField(block, "text")}
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
          <div data-tina-field={tinaField(block, "body")}>
            <TinaMarkdown content={block.body} />
          </div>
          {block.buttons?.map((button: any, buttonIndex: number) => (
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
