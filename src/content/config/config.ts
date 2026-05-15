import { defineCollection, z } from "astro:content";

const pageCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    blocks: z
      .union([z.array(z.any()), z.null(), z.undefined()])
      .transform((val) => val ?? []),
  }),
});

export const collections = {
  page: pageCollection,
};
