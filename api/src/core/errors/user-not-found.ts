import { AppError } from "./app-error";

export class UserNotFound extends AppError {
  constructor() {
    super('User not found', 404)
  }
}