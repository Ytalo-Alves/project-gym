import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUserRepository } from "../../../src/modules/user/infra/in-memory/in-memory-user-repository";
import { CreateUserUseCase } from "../../../src/modules/user/app/create-user.usecase";
import { UpdateUserUseCase } from "../../../src/modules/user/app/update-user.usecase";
import { email } from "zod";
import { EmailInUseError } from "../../../src/core/errors/email-in-user-error";

let repo: InMemoryUserRepository;
let createUser: CreateUserUseCase;
let sut : UpdateUserUseCase;

describe('Update user - Unit Test', () => {
  beforeEach(() => {
    repo = new InMemoryUserRepository();
    createUser = new CreateUserUseCase(repo);
    sut = new UpdateUserUseCase(repo)
  });

  it('should be able update a user', async () => {
    const user = await createUser.create({
      name: "John update",
      email: "johnupdate@example.com",
      password: "123456",
      role: "admin",
    });

    const update = await sut.update(user.id, {
      name: "john doe update"
    })

    expect(update.name).toBe("john doe update")
  })

  it('should not be able allow duplicate email on updated', async () => {
    await createUser.create({
      name: "user 1",
      email: "user1@example.com",
      password: "123456",
      role: "admin",
    })

    const user2 = await createUser.create({
      name: "user 2",
      email: "user2@example.com",
      password: "123456",
      role: "admin",
    })

    await expect(
      sut.update(user2.id, {email: 'user1@example.com'})
    ).rejects.toBeInstanceOf(EmailInUseError);
  })
})