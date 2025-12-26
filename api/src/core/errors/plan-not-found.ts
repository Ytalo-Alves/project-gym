import { AppError } from "./app-error";

export class PlanNotFound extends AppError {
  constructor() {
    super('Plan not found', 404)
  }
}

