import { z } from 'zod';

const ReviewSchema = z.object({
  serviceId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const reviewValidation = { ReviewSchema };