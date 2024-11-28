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
    favorite: z.boolean().optional(),
    serviceId: z.string().optional(),
    
});

const starrdFavoriteValidation = z.object({ 
    favorite: z.boolean().optional(),
});

export const starrdValidation = { 
    starrdValidationSchema,
    starrdFavoriteValidation
};