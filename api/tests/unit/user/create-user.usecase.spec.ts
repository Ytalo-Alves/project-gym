import {describe, expect, it} from 'vitest'
import { InMemoryUserRepository } from '../../../src/modules/user/infra/in-memory/in-memory-user-repository'
import { CreateUserUseCase } from '../../../src/modules/user/app/create-user.usecase';
import { EmailInUseError } from '../../../src/core/errors/email-in-user-error';

  const repo = new InMemoryUserRepository();
  const sut = new CreateUserUseCase(repo)

describe('Create User - Unit Test', () => {
  it('should be able create a user', async () => {

    const user = await sut.create({
      name: 'john doe',
      email: 'johndoe@email.com',
      password: '123456',
      role: 'admin'
    })

    expect(user).toHaveProperty('id')
    expect(user.email).toBe('johndoe@email.com')
  })

  it('Should not be able to create a user with a duplicate email address', async () => {
    await sut.create({
      name: 'john',
      email: 'john@email.com',
      password: '123456',
      role: 'admin'
    })

    await expect(
      sut.create({
        name: 'Another john doe',
        email: 'johndoe@email.com',
        password: '123456',
        role: 'admin'
      })
    ).rejects.toBeInstanceOf(EmailInUseError)
  })
})