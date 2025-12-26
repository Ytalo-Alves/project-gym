import { z } from "zod";

export const authenticateUserSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase().trim(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type AuthenticateUserInput = z.infer<typeof authenticateUserSchema>;
