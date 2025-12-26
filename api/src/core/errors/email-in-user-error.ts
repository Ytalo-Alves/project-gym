import { AppError } from "./app-error";

export class EmailInUseError extends AppError {
  constructor() {
    super('Email already in use', 409)
  }
}