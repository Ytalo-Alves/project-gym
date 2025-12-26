import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  cpf: z.string(),
  dateOfBirth: z.string().transform((str) => new Date(str)),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  cep: z.string(),
  address: z.string(),
  numberAddress: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  emergencyContact: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  observation: z.string().optional(),
});

export const updateStudentSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  dateOfBirth: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  cep: z.string().optional(),
  address: z.string().optional(),
  numberAddress: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  observation: z.string().optional(),
});

export const studentIdSchema = z.object({
  id: z.string().uuid(),
});
