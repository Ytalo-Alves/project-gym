import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthenticateUserUseCase } from "../../../src/modules/auth/app/authenticate-user.usecase";
import { InMemoryUserRepository } from "../../../src/modules/user/infra/in-memory/in-memory-user-repository";
import bcrypt from "bcryptjs";

let userRepo: InMemoryUserRepository;
let sut: AuthenticateUserUseCase;

describe("Authenticate User UseCase - Unit Test", () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository();

    const fakeHashComparer = {
      compare: vi.fn().mockResolvedValue(true), // sempre verdadeiro
    };

    const fakeEncrypter = {
      encrypt: vi.fn().mockResolvedValue("fake-token"),
    };

    sut = new AuthenticateUserUseCase(
      userRepo,
      fakeHashComparer as any,
      fakeEncrypter as any
    );
  });

  it("should authenticate with valid credentials", async () => {
    const passwordHash = await bcrypt.hash("123456", 8);

    await userRepo.create({
      name: "Auth User",
      email: "auth@test.com",
      password: passwordHash,
      role: "admin",
    });

    const result = await sut.execute({
      email: "auth@test.com",
      password: "123456",
    });

    expect(result.token).toBe("fake-token");
  });

  it("should throw if credentials are invalid", async () => {
    // 👉 Agora o mock precisa retornar FALSE somente nesse teste
    const fakeHashComparer = {
      compare: vi.fn().mockResolvedValue(false),
    };

    const fakeEncrypter = {
      encrypt: vi.fn().mockResolvedValue("fake-token"),
    };

    const sutTemp = new AuthenticateUserUseCase(
      userRepo,
      fakeHashComparer as any,
      fakeEncrypter as any
    );

    const passwordHash = await bcrypt.hash("123456", 8);

    await userRepo.create({
      name: "Auth User",
      email: "auth@test.com",
      password: passwordHash,
      role: "admin",
    });

    await expect(
      sutTemp.execute({
        email: "auth@test.com",
        password: "wrong-pass",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
