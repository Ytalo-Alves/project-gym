import { AppError } from "./app-error";

export class StudentEmailAlreadyExistsError extends AppError {
  constructor() {
    super("Email already in use by another student", 409);
  }
}
