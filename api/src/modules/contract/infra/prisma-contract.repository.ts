import { prisma } from "../../../infra/prisma";
import {
  CreateContractData,
  ContractWithPlan,
} from "../domain/contract.entity";
import { ContractRepository } from "../domain/contract.repository";

export class PrismaContractRepository implements ContractRepository {
  async create(data: CreateContractData): Promise<ContractWithPlan> {
    const startDate = data.startDate || new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + data.durationMonths);

    const contract = await prisma.contract.create({
      data: {
        studentId: data.studentId,
        planId: data.planId,
        startDate,
        endDate,
        pricePaid: data.pricePaid,
        status: "ACTIVE",
      },
      include: {
        plan: true,
      },
    });

    return contract as unknown as ContractWithPlan;
  }

  async findByStudentId(studentId: string): Promise<ContractWithPlan[]> {
    const contracts = await prisma.contract.findMany({
      where: { studentId },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return contracts as unknown as ContractWithPlan[];
  }

  async findActiveByStudentId(
    studentId: string
  ): Promise<ContractWithPlan | null> {
    const contract = await prisma.contract.findFirst({
      where: {
        studentId,
        status: "ACTIVE",
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return contract as unknown as ContractWithPlan | null;
  }

  async countByPlanId(planId: string): Promise<number> {
    const count = await prisma.contract.count({
      where: {
        planId,
      },
    });

    return count;
  }

  async countActiveContracts(): Promise<number> {
    return prisma.contract.count({
      where: {
        status: "ACTIVE",
      },
    });
  }
}
