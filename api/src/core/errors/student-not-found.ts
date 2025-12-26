import { AppError } from "./app-error";

export class StudentNotFoundError extends AppError {
  constructor() {
    super("Student not found", 404);
  }
}
