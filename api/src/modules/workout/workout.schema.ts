import { z } from "zod";

export const categoryIdSchema = z.object({
  categoryId: z.string().uuid(),
});

export const workoutIdSchema = z.object({
  id: z.string().uuid(),
});

export const studentWorkoutParamsSchema = z.object({
  studentId: z.string().uuid(),
  workoutId: z.string().uuid(),
});

export const assignmentIdSchema = z.object({
  assignmentId: z.string().uuid(),
});

export const workoutAssignmentsByWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
});

export const assignWorkoutBodySchema = z.object({
  notes: z.string().max(500).optional(),
});
