export interface IReview {
    comment: string;
    rating: number;
    starrdId: string;
    images: string[];
    companyId: string;
    serviceId?: string;
}