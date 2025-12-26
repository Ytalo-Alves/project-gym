import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string(),
  duration: z.number().int().positive(),
  price: z.number().positive(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
});

export const updatePlanSchema = z.object({
  name: z.string().optional(),
  duration: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const planIdSchema = z.object({
  id: z.string().uuid(),
});
