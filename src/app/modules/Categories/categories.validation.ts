import { z } from 'zod';

const CategorySchema = z.object({
    categoryName: z.string().min(1, "Name is required"),
});

const SubcategorySchema = z.object({
  subCategoryName: z.string(),
});


export const categoryValidation = {
  CategorySchema,
  SubcategorySchema,
};