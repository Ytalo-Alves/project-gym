import { FastifyInstance } from "fastify";
import { PrismaContractRepository } from "../../infra/prisma-contract.repository";
import { PrismaStudentRepository } from "../../../student/infra/prisma-student.repository";
import { PrismaPlanRepository } from "../../../plan/infra/prisma-plan.repository";
import { CreateContractUseCase } from "../../app/create-contract.usecase";
import { GetStudentContractsUseCase } from "../../app/get-student-contracts.usecase";
import { CountActiveContractsUseCase } from "../../app/count-active-contracts.usecase";
import { CreateContractController } from "../controllers/create-contract.controller";
import { GetStudentContractsController } from "../controllers/get-student-contracts.controller";
import { CountActiveContractsController } from "../controllers/count-active-contracts.controller";
import { authenticate } from "../../../../http/middleware/authenticate";

export async function contractRoutes(app: FastifyInstance) {
  const contractRepository = new PrismaContractRepository();
  const studentRepository = new PrismaStudentRepository();
  const planRepository = new PrismaPlanRepository();

  // Use cases
  const createContractUseCase = new CreateContractUseCase(
    contractRepository,
    studentRepository,
    planRepository
  );
  const getStudentContractsUseCase = new GetStudentContractsUseCase(
    contractRepository
  );
  const countActiveContractsUseCase = new CountActiveContractsUseCase(
    contractRepository
  );

  // Controllers
  const createContractController = new CreateContractController(
    createContractUseCase
  );
  const getStudentContractsController = new GetStudentContractsController(
    getStudentContractsUseCase
  );
  const countActiveContractsController = new CountActiveContractsController(
    countActiveContractsUseCase
  );

  // Routes
  app.get(
    "/contracts/active/count",
    { onRequest: [authenticate] },
    (request, reply) => countActiveContractsController.handle(request, reply)
  );

  app.post(
    "/contracts",
    { onRequest: [authenticate] },
    (request, reply) => createContractController.handle(request, reply)
  );

  app.get(
    "/contracts/student/:studentId",
    { onRequest: [authenticate] },
    (request, reply) => getStudentContractsController.handle(request, reply)
  );
}
