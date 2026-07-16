import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid event ObjectId'),
    quantity: z.number().int().min(1).default(1),
  }),
});

export const cancelBookingSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ObjectId'),
  }),
});
