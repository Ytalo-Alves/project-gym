import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaUserRepository } from "../../../src/modules/user/infra/prisma-user.repository";
import { prisma } from "../../../src/infra/prisma";
import { hash } from "bcryptjs";

describe("Prisma User Repository - e2e Test", async () => {
  const repo = new PrismaUserRepository();

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("Should be able create and find a user by email (with password)", async () => {
    const passwordHash = await hash("123456", 8);

    await prisma.user.create({
      data: {
        name: "Prisma user",
        email: "prismauser@email.com",
        password: passwordHash,
        role: "admin",
      },
    });

    const user = await repo.findByEmail('prismauser@email.com');

    expect(user).not.toBeNull()
    expect(user?.email).toBe('prismauser@email.com')
    expect(user?.password).toBe(passwordHash)
  });

  it('Should return null if user does not exist', async() => {
    const user = await repo.findByEmail('notexist@email.com')

    expect(user).toBeNull();
  })
});
