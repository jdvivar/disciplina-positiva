import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const es = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/es' }),
  schema: z.object({
    title: z.string(),
    chapter: z.number().optional(),
    order: z.number(),
  }),
});

export const collections = { es };
