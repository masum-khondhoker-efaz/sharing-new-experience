export interface ICompany {
  companyName: string;
  description: string;
  uploadFiles: string[];
  openingHours: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  websiteLink: string;
  contact: string;
  email: string;
  location: {
    addressText: string;
    latitude: number;
    longitude: number;
  };
}
