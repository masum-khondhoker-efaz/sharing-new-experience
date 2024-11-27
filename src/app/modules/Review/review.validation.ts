import { z } from 'zod';

const ReviewSchema = z.object({
  starrdId: z.string(),
  rating: z.number().int().min(1).max(5),
  images: z.string().array(),
  comment: z.string().max(500).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const reviewValidation = { ReviewSchema };