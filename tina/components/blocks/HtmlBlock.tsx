import { tinaField } from "tinacms/dist/react";

type HtmlBlockProps = {
  block: any;
  blockKey: string | number;
  isGrouped?: boolean;
};

export default function HtmlBlock({
  block,
  blockKey,
  isGrouped = false,
}: HtmlBlockProps) {
  const blockClassName = block.className || "";
  const BlockTag = isGrouped ? "div" : "section";

  return (
    <BlockTag
      key={blockKey}
      className={`:: custom-html ${blockClassName}`}
      data-tina-field={tinaField(block, "html")}
      dangerouslySetInnerHTML={{ __html: block.html || "" }}
      suppressHydrationWarning
    />
  );
}
