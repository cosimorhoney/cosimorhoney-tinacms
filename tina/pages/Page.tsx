import { tinaField, useTina } from "tinacms/dist/react";
import type { PageQuery, PageQueryVariables } from "../__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import HeroBlock from "../components/blocks/HeroBlock";
import TextBlock from "../components/blocks/TextBlock";
import TextDoubleBlock from "../components/blocks/TextDoubleBlock";
import TextImageBlock from "../components/blocks/TextImageBlock";
import GalleryBlock from "../components/blocks/GalleryBlock";
import FAQBlock from "../components/blocks/FAQBlock";
import FeaturesBlock from "../components/blocks/FeaturesBlock";
import QuoteBlock from "../components/blocks/QuoteBlock";
import CtaBlock from "../components/blocks/CtaBlock";
import HtmlBlock from "../components/blocks/HtmlBlock";
import StyledTextBlock from "../components/blocks/StyledTextBlock";

type Props = {
  variables: PageQueryVariables;
  data: PageQuery;
  query: string;
};

// Helper function to group blocks based on groupWithNext
function groupBlocks(blocks: any[]) {
  const groups: any[][] = [];
  let currentGroup: any[] = [];

  blocks.forEach((block, index) => {
    currentGroup.push(block);

    // Check if this block should group with the next one
    const shouldGroupWithNext = block.section?.groupWithNext === true;

    // If it shouldn't group with next, or it's the last block, close the group
    if (!shouldGroupWithNext || index === blocks.length - 1) {
      groups.push(currentGroup);
      currentGroup = [];
    }
  });

  return groups;
}

// Helper function to render a single block
function renderBlock(block: any, index: number, isGrouped = false) {
  // Hero Block
  if (block.__typename === "PageBlocksHero") {
    return (
      <HeroBlock
        key={index}
        block={block}
        blockKey={index}
        isGrouped={isGrouped}
      />
    );
  }

  // Text Block
  if (block.__typename === "PageBlocksText") {
    return (
      <TextBlock
        key={index}
        block={block}
        blockKey={index}
        isGrouped={isGrouped}
      />
    );
  }

  // Two Column Block
  if (block.__typename === "PageBlocksTextDouble") {
    return (
      <TextDoubleBlock
        key={index}
        block={block}
        blockKey={index}
        isGrouped={isGrouped}
      />
    );
  }

  // Two Column Block
  if (block.__typename === "PageBlocksTextImage") {
    return (
      <TextImageBlock
        key={index}
        block={block}
        blockKey={index}
        isGrouped={isGrouped}
      />
    );
  }

  // Gallery Block
  if (block.__typename === "PageBlocksGallery") {
    return (
      <GalleryBlock
        key={index}
        block={block}
        blockKey={index}
        isGrouped={isGrouped}
      />
    );
  }

  // FAQs Block
  if (block.__typename === "PageBlocksFaq") {
    return (
      <FAQBlock
        key={index}
        block={block}
        blockKey={index}
        isGrouped={isGrouped}
      />
    );
  }

  // Features Block
  if (block.__typename === "PageBlocksFeatures") {
    return (
      <FeaturesBlock
        key={index}
        block={block}
        blockKey={index}
        isGrouped={isGrouped}
      />
    );
  }

  // Quote Block
  if (block.__typename === "PageBlocksQuote") {
    return (
      <QuoteBlock
        key={index}
        block={block}
        blockKey={index}
        isGrouped={isGrouped}
      />
    );
  }

  // CTA Block
  if (block.__typename === "PageBlocksCta") {
    return (
      <CtaBlock
        key={index}
        block={block}
        blockKey={index}
        isGrouped={isGrouped}
      />
    );
  }

  // Custom HTML Block
  if (block.__typename === "PageBlocksHtml") {
    return (
      <HtmlBlock
        key={index}
        block={block}
        blockKey={index}
        isGrouped={isGrouped}
      />
    );
  }

  if (block.__typename === "PageBlocksStyledText") {
    return (
      <StyledTextBlock
        key={index}
        block={block}
        blockKey={index}
        isGrouped={isGrouped}
      />
    );
  }

  // Fallback for unknown block types
  return <div key={index}>Unknown block type: {block.__typename}</div>;
}

const TinaPage = (props: Props) => {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const page = data.page;

  if (!page.blocks || page.blocks.length === 0) {
    return (
      <main>
        <div data-tina-field={tinaField(page, "body")}>
          <TinaMarkdown content={page.body} />
        </div>
      </main>
    );
  }

  // Group blocks based on groupWithNext toggle
  const blockGroups = groupBlocks(page.blocks);

  return (
    <main>
      {blockGroups.map((group, groupIndex) => {
        // Single block - still apply section styling if it exists
        if (group.length === 1) {
          const block = group[0];
          const section = block.section || {};

          // If no section styling is set, just render the block directly
          const hasSectionStyling =
            section.backgroundColor ||
            section.backgroundImage ||
            section.backgroundVideoUrl ||
            section.paddingTop ||
            section.paddingBot ||
            section.maxWidth ||
            section.sectionClassName;

          if (!hasSectionStyling) {
            return renderBlock(block, groupIndex, false);
          }

          // Has section styling - wrap it
          const classNames = ["section-wrapper"];
          if (
            section.backgroundColor ||
            section.backgroundImage ||
            section.backgroundVideoUrl
          )
            classNames.push("has-background");
          if (section.sectionClassName)
            classNames.push(section.sectionClassName);
          if (section.backgroundColor)
            classNames.push(`bg-${section.backgroundColor}`);
          if (section.paddingTop)
            classNames.push(`padtop-${section.paddingTop}`);
          if (section.paddingBot)
            classNames.push(`padbot-${section.paddingBot}`);
          if (section.maxWidth)
            classNames.push(`max-width-${section.maxWidth}`);

          // const styles: React.CSSProperties = {};
          // if (section.backgroundImage) {
          //   styles.backgroundImage = `url(${section.backgroundImage})`;
          // }

          return (
            <section
              id={section.sectionId}
              key={groupIndex}
              className={classNames.join(" ")}
              // style={styles}
              data-tina-field={tinaField(section)}
            >
              {section.backgroundImage && (
                <img
                  src={section.backgroundImage}
                  className="background-image"
                />
              )}
              {section.backgroundVideoUrl && (
                <video
                  className="background-video"
                  autoPlay
                  loop={section.videoLoop !== false}
                  muted
                  playsInline
                  preload="metadata"
                >
                  <source src={section.backgroundVideoUrl} type="video/mp4" />
                </video>
              )}
              {renderBlock(block, groupIndex, true)}
            </section>
          );
        }

        // Multiple blocks in group - wrap them in a section
        // Individual blocks inside use <div>
        const firstBlock = group[0];
        const section = firstBlock.section || {};

        // Build group className using sectionClassName from first block
        const classNames = ["section-wrapper"];
        if (
          section.backgroundColor ||
          section.backgroundImage ||
          section.backgroundVideoUrl
        )
          classNames.push("has-background");
        if (section.sectionClassName) classNames.push(section.sectionClassName);
        if (section.backgroundColor)
          classNames.push(`bg-${section.backgroundColor}`);
        if (section.paddingTop)
          classNames.push(`padding-${section.paddingTop}`);
        if (section.paddingBot)
          classNames.push(`padding-${section.paddingBot}`);
        if (section.maxWidth) classNames.push(`max-width-${section.maxWidth}`);

        // Build inline styles
        const styles: React.CSSProperties = {};
        if (section.backgroundImage) {
          styles.backgroundImage = `url(${section.backgroundImage})`;
          styles.backgroundSize = "cover";
          styles.backgroundPosition = "center";
        }

        return (
          <section
            id={section.sectionId}
            key={groupIndex}
            className={classNames.join(" ")}
            style={styles}
            data-tina-field={tinaField(firstBlock, "section")}
          >
            {section.backgroundVideoUrl && (
              <video
                className="background-video"
                autoPlay
                muted
                playsInline
                loop={section.videoLoop !== false}
              >
                <source src={section.backgroundVideoUrl} type="video/mp4" />
              </video>
            )}
            {group.map((block, blockIndex) =>
              renderBlock(block, `${groupIndex}-${blockIndex}`, true),
            )}
          </section>
        );
      })}
    </main>
  );
};

export default TinaPage;
