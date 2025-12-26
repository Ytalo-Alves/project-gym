import { User, type UserWithPassword } from "../domain/user.entity";
import {
  CreateUserData,
  UpdateUserData,
  UserRepository,
} from "../domain/user.interface";
import { prisma } from "../../../infra/prisma";

export class PrismaUserRepository implements UserRepository {
  async update(id: string, data: UpdateUserData) {
    // Use updateMany + findUnique as a workaround for intermittent adapter timeouts
    await prisma.user.updateMany({ where: { id }, data });

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) throw new Error("User not found after update");

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as User["role"],
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }

  async findById(id: string): Promise<UserWithPassword | null> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as User["role"],
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      password: user.password,
    };
  }
  async create(data: CreateUserData): Promise<User> {
    const user = await prisma.user.create({ data });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as User["role"],
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      ...user,
      role: user.role as User["role"],
      avatarUrl: user.avatarUrl,
    };
  }
}
