import { AppError } from "./app-error";

export class StudentCpfAlreadyExistsError extends AppError {
  constructor() {
    super("CPF already in use by another student", 409);
  }
}
