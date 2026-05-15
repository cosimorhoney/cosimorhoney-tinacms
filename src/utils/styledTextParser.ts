// src/utils/styledTextParser.ts

interface SpanData {
  text: string;
  tag: string;
  id?: string;
  classes: string[];
  tabindex?: number;
}

// Allowed text-based tags (for security)
const ALLOWED_TAGS = [
  "span",
  "div",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "mark",
  "small",
  "del",
  "ins",
  "sub",
  "sup",
  "code",
  "kbd",
  "samp",
  "var",
  "abbr",
  "cite",
  "q",
  "time",
  "data",
  "address",
  "pre",
  "blockquote",
];

export function parseStyledText(input: string): SpanData[] {
  const spans: SpanData[] = [];
  let currentIndex = 0;

  while (currentIndex < input.length) {
    // Find next opening bracket
    const openIndex = input.indexOf("[", currentIndex);

    // If no more opening brackets, add remaining text as plain span
    if (openIndex === -1) {
      const remaining = input.substring(currentIndex);
      if (remaining) {
        spans.push({ text: remaining, tag: "span", classes: [] });
      }
      break;
    }

    // Add any text before the opening bracket as plain span (preserve spaces!)
    if (openIndex > currentIndex) {
      const plainText = input.substring(currentIndex, openIndex);
      if (plainText) {
        spans.push({ text: plainText, tag: "span", classes: [] });
      }
    }

    // Find the closing bracket for the tag
    const tagCloseIndex = input.indexOf("]", openIndex);
    if (tagCloseIndex === -1) break; // Malformed, stop parsing

    // Extract the tag content (between [ and ])
    const tag = input.substring(openIndex + 1, tagCloseIndex);

    // Find the closing bracket pair []
    let contentEnd = input.indexOf("[]", tagCloseIndex);
    let nextOpenIndex = input.indexOf("[", tagCloseIndex + 1);

    // If there's another opening tag before the closing pair, auto-close here
    if (
      nextOpenIndex !== -1 &&
      (contentEnd === -1 || nextOpenIndex < contentEnd)
    ) {
      contentEnd = nextOpenIndex;
    }

    // If no closing pair, content goes to end of string
    if (contentEnd === -1) {
      contentEnd = input.length;
    }

    // Extract the content text (preserve whitespace)
    const content = input.substring(tagCloseIndex + 1, contentEnd);

    // Parse the tag
    const spanData = parseTag(tag, content);
    if (spanData.text) {
      // Only add if there's actual content
      spans.push(spanData);
    }

    // Move index past the content
    currentIndex = contentEnd === input.length ? contentEnd : contentEnd + 2; // +2 for []
  }

  return spans;
}

function parseTag(tag: string, content: string): SpanData {
  const spanData: SpanData = {
    text: content,
    tag: "span", // default tag
    classes: [],
  };

  let i = 0;
  while (i < tag.length) {
    const char = tag[i];

    // Custom tag
    if (char === "^") {
      i++;
      let tagName = "";
      while (i < tag.length && ![".", "#", "@", "^", " "].includes(tag[i])) {
        tagName += tag[i];
        i++;
      }
      if (tagName) {
        // Only allow safe text-based tags
        const lowerTag = tagName.toLowerCase();
        if (ALLOWED_TAGS.includes(lowerTag)) {
          spanData.tag = lowerTag;
        }
        // If not allowed, it stays as 'span'
      }
    }
    // Class
    else if (char === ".") {
      i++;
      let className = "";
      // Collect characters until we hit another special char or end
      while (i < tag.length && ![".", "#", "@", "^", " "].includes(tag[i])) {
        className += tag[i];
        i++;
      }
      if (className) spanData.classes.push(className);
    }
    // ID
    else if (char === "#") {
      i++;
      let id = "";
      while (i < tag.length && ![".", "#", "@", "^", " "].includes(tag[i])) {
        id += tag[i];
        i++;
      }
      if (id) spanData.id = id; // Last one wins if multiple IDs
    }
    // Tabindex
    else if (char === "@") {
      i++;
      let tabindexStr = "";
      while (i < tag.length && /[0-9]/.test(tag[i])) {
        tabindexStr += tag[i];
        i++;
      }
      if (tabindexStr) {
        const num = parseInt(tabindexStr, 10);
        if (!isNaN(num)) {
          spanData.tabindex = num;
        }
      }
    }
    // Space - skip if next char is a special symbol, otherwise skip everything until special symbol
    else if (char === " ") {
      i++;
      // If next char is special, continue parsing
      if (i < tag.length && [".", "#", "@", "^"].includes(tag[i])) {
        continue;
      }
      // Otherwise skip until we find a special char
      while (i < tag.length && ![".", "#", "@", "^"].includes(tag[i])) {
        i++;
      }
    }
    // Any other character - skip until we find a special char
    else {
      i++;
      while (i < tag.length && ![".", "#", "@", "^"].includes(tag[i])) {
        i++;
      }
    }
  }

  return spanData;
}

// Helper to render spans as HTML string (for Astro)
export function renderStyledText(input: string): string {
  const spans = parseStyledText(input);
  return spans
    .map((span) => {
      const attrs: string[] = [];
      if (span.id) attrs.push(`id="${span.id}"`);
      if (span.classes.length > 0)
        attrs.push(`class="${span.classes.join(" ")}"`);
      if (span.tabindex !== undefined)
        attrs.push(`tabindex="${span.tabindex}"`);

      const attrsStr = attrs.length > 0 ? " " + attrs.join(" ") : "";
      return `<${span.tag}${attrsStr}>${span.text}</${span.tag}>`;
    })
    .join("");
}

// Export the type so React component can use it
export type { SpanData };
