// src/components/react/StyledText.tsx
import { parseStyledText } from "../../utils/styledTextParser";
import { createElement } from "react";

interface Props {
  text: string;
}

export default function StyledText({ text }: Props) {
  const spans = parseStyledText(text);

  return (
    <>
      {spans.map((span, i) => {
        const props: any = { key: i };
        if (span.id) props.id = span.id;
        if (span.classes.length > 0) props.className = span.classes.join(" ");
        if (span.tabindex !== undefined) props.tabIndex = span.tabindex;

        return createElement(span.tag, props, span.text);
      })}
    </>
  );
}
