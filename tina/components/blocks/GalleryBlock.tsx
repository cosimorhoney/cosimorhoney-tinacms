import { tinaField } from "tinacms/dist/react";

type GalleryBlockProps = {
  block: any;
  blockKey: string | number;
  isGrouped?: boolean;
};

export default function GalleryBlock({
  block,
  blockKey,
  isGrouped = false,
}: GalleryBlockProps) {
  const blockClassName = block.className || "";
  const BlockTag = isGrouped ? "div" : "section";

  const isSlideshow = block.slideshow === true;
  const slideDuration = (block.slideDuration ?? 5) * 1000;

  // Helper to get alt text with filename fallback
  const getAltText = (img: any) => {
    if (img.alt) return img.alt;
    if (!img.src) return "";
    const filename =
      img.src
        .split("/")
        .pop()
        ?.replace(/\.[^/.]+$/, "") || "";
    return filename.replace(/-|_/g, " ");
  };

  // Helper to get object-position value
  const getObjectPosition = (img: any) => {
    const x = img.focusX ?? 50;
    const y = img.focusY ?? 50;
    return `${x}% ${y}%`;
  };

  return (
    <BlockTag
      key={blockKey}
      className={`:: gallery ${blockClassName} ${isSlideshow ? "slideshow" : ""}`}
      data-slide-duration={isSlideshow ? slideDuration : undefined}
    >
      {block.heading && (
        <h2 data-tina-field={tinaField(block, "heading")}>{block.heading}</h2>
      )}

      <div
        className="gallery-grid"
        data-tina-field={tinaField(block, "images")}
      >
        {block.images?.map((img: any, imgIndex: number) => {
          // Create unique key that includes blockKey to avoid duplicates across galleries
          const uniqueKey = `gallery-${blockKey}-${imgIndex}`;

          return (
            <figure
              key={uniqueKey}
              className={imgIndex === 0 ? "current" : ""}
              data-tina-field={tinaField(block.images[imgIndex])}
            >
              {img.src &&
                (img.link ? (
                  <a href={img.link} target={img.target || "_self"}>
                    <img
                      src={img.src}
                      alt={getAltText(img)}
                      style={{ objectPosition: getObjectPosition(img) }}
                    />
                  </a>
                ) : (
                  <img
                    src={img.src}
                    alt={getAltText(img)}
                    style={{ objectPosition: getObjectPosition(img) }}
                  />
                ))}
              {img.caption && <figcaption>{img.caption}</figcaption>}
            </figure>
          );
        })}
      </div>
    </BlockTag>
  );
}
