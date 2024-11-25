
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
  websiteLink: string;
  socialLink: string[];
  uploadFiles: string[];
  serviceId?: string;
}
