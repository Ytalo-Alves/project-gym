export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  cep: string;
  address: string;
  numberAddress: string;
  neighborhood: string;
  city: string;
  state: string;
  emergencyContact?: string | null;
  emergencyContactPhone?: string | null;
  observation?: string | null;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  dateOfBirth: string; // ISO string format
  gender: "MALE" | "FEMALE" | "OTHER";
  cep: string;
  address: string;
  numberAddress: string;
  neighborhood: string;
  city: string;
  state: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  observation?: string;
}

export interface UpdateStudentRequest {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  cep?: string;
  address?: string;
  numberAddress?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  observation?: string;
}

export interface StudentResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  cep: string;
  address: string;
  numberAddress: string;
  neighborhood: string;
  city: string;
  state: string;
  emergencyContact: string | null;
  emergencyContactPhone: string | null;
  observation: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
