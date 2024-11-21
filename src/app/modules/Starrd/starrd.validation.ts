import { z } from 'zod';

const starrdValidationSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    category: z.string(),
    subcategory: z.string(),
    location: z.string(),
    personalNote: z.string(),
    rating: z.number().int().min(0).max(5),
    socialLink: z.string().url().optional(),
    uploadFiles: z.array(z.string()),
    userId: z.string().optional(),
    shopId: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export const starrdValidation = { starrdValidationSchema, };