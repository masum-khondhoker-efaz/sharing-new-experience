import { z } from 'zod';
const OpeningHoursSchema = z.object({
  Monday: z.string(),
  Tuesday: z.string(),
  Wednesday: z.string(),
  Thursday: z.string(),
  Friday: z.string(),
  Saturday: z.string(),
  Sunday: z.string(),
});

// Define the main Company schema
const companyValidationSchema = z.object({
  companyName: z.string(),
  description: z.string(),
  uploadFiles: z.array(z.string()),
  openingHours: OpeningHoursSchema, // Reference the openingHours schema
  websiteLink: z.string().optional(),
  contact: z.string(),
  email: z.string().email(),
  location: z.object({
    addressText: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export const companyValidation = {
    companyValidationSchema,
};
