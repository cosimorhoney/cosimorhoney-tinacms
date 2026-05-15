import { tinaField } from "tinacms/dist/react";
import StyledText from "../../../src/components/react/StyledText";

type StyledTextBlockProps = {
  block: any;
  blockKey: string | number;
  isGrouped?: boolean;
};

export default function StyledTextBlock({
  block,
  blockKey,
  isGrouped = false,
}: StyledTextBlockProps) {
  const blockClassName = block.className || "";
  const BlockTag = isGrouped ? "div" : "section";

  return (
    <BlockTag
      key={blockKey}
      className={`:: styled-text ${blockClassName}`}
      data-tina-field={tinaField(block, "text")}
    >
      <StyledText text={block.text || ""} />
    </BlockTag>
  );
}
