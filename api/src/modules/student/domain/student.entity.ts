export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  dateOfBirth: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  dateOfBirth: Date;
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
  photoUrl?: string;
}

export interface UpdateStudentData {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  dateOfBirth?: Date;
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
  photoUrl?: string;
}
