import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "prod"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z
    .string()
    .min(1, "JWT_SECRET é obrigatório")
    .default("api-gym-monster-nodejs"),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  APP_URL: z.string().url().default("http://localhost:3333"),
  UPLOAD_DIR: z.string().default("uploads"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `Variáveis de ambiente inválidas: ${JSON.stringify(parsedEnv.error.format())}`
  );
}

export const env = parsedEnv.data;

export const corsOrigins = env.CORS_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const appUrl = env.APP_URL.replace(/\/+$/, "");
