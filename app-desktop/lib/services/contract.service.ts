import { api } from "./api";
import type { Contract, CreateContractRequest } from "../types/contract.types";

export const contractService = {
  async create(data: CreateContractRequest): Promise<Contract> {
    return api.post<Contract>("/contracts", data);
  },

  async getByStudentId(studentId: string): Promise<Contract[]> {
    return api.get<Contract[]>(`/contracts/student/${studentId}`);
  },

  async getActiveCount(): Promise<number> {
    const response = await api.get<{ count: number }>("/contracts/active/count");
    return response.count;
  },

  async getActiveByStudentId(studentId: string): Promise<Contract | null> {
    const contracts = await this.getByStudentId(studentId);
    return contracts.find((c) => c.status === "ACTIVE") || null;
  },
};
