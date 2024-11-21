import { z } from 'zod';

const CategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
});

const SubcategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    categoryId: z.string().uuid(),
});


export const categoryValidation = {
  CategorySchema,
  SubcategorySchema,
};