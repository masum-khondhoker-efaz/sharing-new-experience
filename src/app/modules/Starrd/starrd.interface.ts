export interface IStarrd {
    id: string;
    name: string;
    categoryId: string;
    subcategoryId: string;
    personalNote: string;
    location: string;
    rating: number;
    socialLink?: string;
    uploadFiles: string[];
    userId: string;
    shopId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}