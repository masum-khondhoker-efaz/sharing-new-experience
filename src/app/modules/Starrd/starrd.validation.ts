import { z } from 'zod';

const starrdValidationSchema = z.object({
    name: z.string(),
    personalNote: z.string(),
    companyName: z.string(),
    websiteLink: z.string().url(),
    categoryName: z.string(),
    subCategoryName: z.string(),
    categoryId: z.string().optional(),
    subCategoryId: z.string().optional(),
    location: z.object({}).passthrough(),
    rating: z.number().optional(),
    socialLink: z.array(z.string().url()),
    uploadFiles: z.array(z.string()),
    userId: z.string().optional(),
    serviceId: z.string().optional(),
    
});

export const starrdValidation = { starrdValidationSchema };