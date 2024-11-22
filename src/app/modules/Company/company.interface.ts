export interface ICompany {
  name: string;
  description: string; 
  images: string[]; 
  openingHours: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  }; 
  websiteLink?: string; 
  contact: string; 
  email: string; 
  location: {
    addressText: string; 
    latitude: number; 
    longitude: number; 
  };
}
