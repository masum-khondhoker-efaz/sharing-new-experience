export interface ICategory {
    id?: string;
    name: string;
    userId: string;
    starrdId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    subcategoryId?: string;
    subcategories?: ISubcategory[];
}

export interface ISubcategory {
    id?: string;
    name: string;
    categoryId: string;
    userId: string;
    starrdId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}