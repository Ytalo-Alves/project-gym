import type { User, UserWithPassword } from "./user.entity";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "trainer" | "staff";
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: "admin" | "trainer" | "staff";
  password?: string;
  avatarUrl?: string;
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<UserWithPassword | null>;
  update(id: string, data: UpdateUserData): Promise<User>;
  findById(id: string): Promise<UserWithPassword | null>;
}
