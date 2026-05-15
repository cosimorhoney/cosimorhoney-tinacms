import { tinaField } from "tinacms/dist/react";

type HeroBlockProps = {
  block: any;
  blockKey: string | number;
  isGrouped?: boolean;
};

export default function HeroBlock({
  block,
  blockKey,
  isGrouped = false,
}: HeroBlockProps) {
  const blockClassName = block.className || "";
  const BlockTag = isGrouped ? "div" : "section";

  return (
    <BlockTag
      key={blockKey}
      className={`:: hero ${blockClassName}`}
      data-tina-field={tinaField(block)}
    >
      {block.image && (
        <div className="hero-image">
          <img
            src={block.image}
            alt={block.imageAlt || ""}
            data-tina-field={tinaField(block, "image")}
          />
        </div>
      )}
      <div className="hero-content">
        <h1 data-tina-field={tinaField(block, "headline")}>{block.headline}</h1>
        {block.tagline && (
          <p data-tina-field={tinaField(block, "tagline")}>{block.tagline}</p>
        )}
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
    </BlockTag>
  );
}
