import { api } from "./api";
import type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentResponse,
} from "../types/student.types";

export const studentService = {
  async list(): Promise<Student[]> {
    try {
      const response = await api.get<StudentResponse[]>("/students");
      return response.map((student) => ({
        ...student,
        emergencyContact: student.emergencyContact || undefined,
        emergencyContactPhone: student.emergencyContactPhone || undefined,
        observation: student.observation || undefined,
        photoUrl: student.photoUrl || undefined,
      }));
    } catch (err) {
      console.error("Erro ao listar alunos:", err);
      return [];
    }
  },

  async getById(id: string): Promise<Student> {
    const response = await api.get<StudentResponse>(`/students/${id}`);
    return {
      ...response,
      emergencyContact: response.emergencyContact || undefined,
      emergencyContactPhone: response.emergencyContactPhone || undefined,
      observation: response.observation || undefined,
      photoUrl: response.photoUrl || undefined,
    };
  },

  async create(data: CreateStudentRequest): Promise<Student> {
    const response = await api.post<StudentResponse>("/students", data);
    return {
      ...response,
      emergencyContact: response.emergencyContact || undefined,
      emergencyContactPhone: response.emergencyContactPhone || undefined,
      observation: response.observation || undefined,
      photoUrl: response.photoUrl || undefined,
    };
  },

  async update(id: string, data: UpdateStudentRequest): Promise<Student> {
    const response = await api.put<StudentResponse>(`/students/${id}`, data);
    return {
      ...response,
      emergencyContact: response.emergencyContact || undefined,
      emergencyContactPhone: response.emergencyContactPhone || undefined,
      observation: response.observation || undefined,
      photoUrl: response.photoUrl || undefined,
    };
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
  },

  async uploadPhoto(
    id: string,
    photoBlob: Blob
  ): Promise<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append("file", photoBlob, "student-photo.jpg");

    // Get token from localStorage using the same key as api.ts
    const token =
      typeof window !== "undefined" ? localStorage.getItem("@gym:token") : null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/students/${id}/photo`,
      {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `[${response.status}] ${errorText || "Erro ao fazer upload da foto"}`
      );
    }

    return response.json();
  },
};
