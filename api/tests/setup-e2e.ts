import { prisma } from "../src/infra/prisma";

process.env.NODE_ENV = "test";
process.env.DOTENV_CONFIG_PATH = ".env.test";

export default async () => {
  await prisma.$connect();   // 🔥 Garante reconexão entre execuções
};