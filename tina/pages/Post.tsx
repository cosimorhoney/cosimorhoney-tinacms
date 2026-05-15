import { tinaField, useTina } from "tinacms/dist/react";
import type { BlogQuery, BlogQueryVariables } from "../__generated__/types.ts";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import FormattedDate from "../../src/components/react/FormattedDate.tsx";

type Props = {
  variables: BlogQueryVariables;
  data: BlogQuery;
  query: string;
};

export default function AdminBlogPost(props: Props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const blog = data.blog;

  return (
    <article>
      <div
        data-tina-field={tinaField(blog, "heroImage")}
        className="hero-image"
        data-src={blog.heroImage}
      >
        {blog.heroImage && (
          <img
            width={1020}
            height={510}
            src={blog.heroImage}
            alt={blog.heroImageAlt || ""}
            data-tina-field={tinaField(blog, "heroImage")}
          />
        )}
      </div>
      <div className="blog-content">
        <div className="blog-meta">
          <h1 className="title" data-tina-field={tinaField(blog, "title")}>
            {blog.title}
          </h1>
          <div className="date" data-tina-field={tinaField(blog, "pubDate")}>
            <FormattedDate date={blog.pubDate} />
            {blog.updatedDate && (
              <div
                className="last-updated-on"
                data-tina-field={tinaField(blog, "updatedDate")}
              >
                Last updated on <FormattedDate date={blog.updatedDate} />
              </div>
            )}
          </div>
        </div>
        <div className="post-content" data-tina-field={tinaField(blog, "body")}>
          <TinaMarkdown content={blog.body} />
        </div>
      </div>
    </article>
  );
}
