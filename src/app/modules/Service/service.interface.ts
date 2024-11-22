import { Category, Company, Review, Starrd, Subcategory } from "@prisma/client";


export interface IService {
    name: string;
    description: string;
    categoryId: string;
    subcategoryId: string;
    companyId: string;
    reviewIds: string[];
    images: string[];
    reviews: Review[];
    company: Company;
    category: Category;
    subcategory: Subcategory;
    starrds: Starrd[];
}