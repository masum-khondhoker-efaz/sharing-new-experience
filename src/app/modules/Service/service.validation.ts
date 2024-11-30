import { z } from 'zod';

const serviceValidationSchema = z.object({
    serviceName: z.string().min(1, "Service name is required"),
    description: z.string().min(1, "Service description is required"),
    categoryId: z.string().min(1, "Category ID is required"),
    subcategoryId: z.string().min(1, "Subcategory ID is required"),
    companyId: z.string().min(1, "Company ID is required"),
    reviewIds: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
});

export const serviceValidation = {
    serviceValidationSchema,
};