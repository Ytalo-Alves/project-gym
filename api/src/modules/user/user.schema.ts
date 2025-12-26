import z from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["admin", "trainer", "staff"]).default("admin"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updatedUserSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
});

export type UpdateUserSchema = z.infer<typeof updatedUserSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
