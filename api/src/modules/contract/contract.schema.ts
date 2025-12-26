import { z } from "zod";

export const createContractSchema = z.object({
  studentId: z.string().uuid("ID do aluno inválido"),
  planId: z.string().uuid("ID do plano inválido"),
  startDate: z.string().datetime().optional(),
  pricePaid: z.number().positive("Preço deve ser positivo"),
  durationMonths: z.number().int().positive("Duração deve ser positiva"),
});

export type CreateContractRequest = z.infer<typeof createContractSchema>;
