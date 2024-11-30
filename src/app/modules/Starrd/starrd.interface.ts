
export interface IStarrd {
  name: string;
  personalNote: string;
  companyName: string;
  categoryName: string;
  subCategoryName: string;
  categoryId?: string;
  subCategoryId?: string;
  companyId?: string;
  location:{
    addressText: string;
    latitude: number;
    longitude: number;
  };
  rating?: number;
  favorite?: boolean;
  reviewIds?: string[];
  websiteLink: string;
  socialLink: string[];
  serviceId?: string;
}
