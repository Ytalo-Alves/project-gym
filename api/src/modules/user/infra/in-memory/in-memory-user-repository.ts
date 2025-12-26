import { randomUUID } from "crypto";
import type { User, UserWithPassword } from "../../domain/user.entity";
import { hash } from "bcryptjs";
import type { CreateUserData, UpdateUserData, UserRepository } from "../../domain/user.interface";




export class InMemoryUserRepository implements UserRepository {
  public users: UserWithPassword[] = [];

  async create(data: CreateUserData): Promise<User> {
    const passwordHash = await hash(data.password, 8)

    const newUser: UserWithPassword = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: data.role,
      createdAt: new Date()
    };

    this.users.push(newUser)
    return newUser
  }
  async findByEmail(email: string): Promise<UserWithPassword| null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    const user = this.users[userIndex]

    const updated = {
      ...user,
      ...data
    }

    this.users[userIndex] = updated

    return updated
  }
  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }
}