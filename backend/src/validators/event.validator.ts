import { z } from 'zod';

const propertySchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'number', 'boolean', 'date', 'select']),
  value: z.union([z.string(), z.number(), z.boolean()]),
  options: z.array(z.string()).optional(),
});

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: z.string().min(2),
    location: z.string().min(2),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    capacity: z.number().int().min(1),
    price: z.number().min(0).default(0),
    coverImage: z.string().url().optional().or(z.literal('')),
    properties: z.array(propertySchema).optional(),
  }),
});

export const updateEventSchema = z.object({
  body: createEventSchema.shape.body.partial(),
});

export const updateEventStatusSchema = z.object({
  body: z.object({
    status: z.enum(['draft', 'published']),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  }),
});
