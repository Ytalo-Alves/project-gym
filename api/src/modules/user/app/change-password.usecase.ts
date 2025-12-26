import { compare, hash } from "bcryptjs";

import { UserNotFound } from "../../../core/errors/user-not-found";
import type { UserRepository } from "../domain/user.interface";
import { InvalidCredentialsError } from "../../../core/errors/invalid-credentials-error";

interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export class ChangePasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ userId, currentPassword, newPassword }: ChangePasswordInput) {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) throw new UserNotFound();

      // Verify current password
      const isPasswordValid = await compare(currentPassword, user.password);
      if (!isPasswordValid) throw new InvalidCredentialsError();

      // Hash new password
      const newPasswordHash = await hash(newPassword, 8);

      // Update password
      await this.userRepository.update(userId, { password: newPasswordHash });

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (err) {
      throw err;
    }
  }
}
