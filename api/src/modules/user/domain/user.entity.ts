export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "trainer" | "staff";
  avatarUrl?: string | null;
  createdAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}
