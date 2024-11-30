import { z } from 'zod';


const PointsLevelValidationSchema = z.object({
    name: z.string(),
    points: z.number(),
});





export const pointsValidation = { PointsLevelValidationSchema, };