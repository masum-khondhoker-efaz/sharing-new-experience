import { z } from 'zod';

const MilestoneValidationSchema = z.object({
  name: z.string(),
  points: z.number(),
  badge: z.string(),
});

export const milestoneValidation = {
  MilestoneValidationSchema,
};
