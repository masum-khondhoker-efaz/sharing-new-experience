import { z } from 'zod';

const ReviewSchema = z.object({
  starrdId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  companyId: z.string().optional(),
});

export const reviewValidation = { ReviewSchema };