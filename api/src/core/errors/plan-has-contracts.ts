import { AppError } from "./app-error";

export class PlanHasContracts extends AppError {
  constructor() {
    super('Não é possível excluir o plano pois ele possui contratos associados', 400)
  }
}

