import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";
import { PrismaClient } from "../../generated/client";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL não definida.");
}

const adapter = new PrismaLibSql({ url: dbUrl });

// Apenas loga qual DB está sendo usado quando executamos os testes unitários
if (process.env.VITEST_MODE === "unit") {
  console.log("USANDO BANCO =>", process.env.DATABASE_URL);
}

export const prisma = new PrismaClient({
  adapter,
});
