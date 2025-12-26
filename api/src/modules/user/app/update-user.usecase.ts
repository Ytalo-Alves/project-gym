import { EmailInUseError } from "../../../core/errors/email-in-user-error";
import { UserNotFound } from "../../../core/errors/user-not-found";
import type { UpdateUserData, UserRepository } from "../domain/user.interface";


export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async update(id: string, data: UpdateUserData) {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) throw new UserNotFound();

      if (data.email) {
        const emailExists = await this.userRepository.findByEmail(data.email);
        if (emailExists && emailExists.id !== id) throw new EmailInUseError();
      }

      const userUpdate = await this.userRepository.update(id, data);

      return {
        id: userUpdate.id,
        name: userUpdate.name,
        email: userUpdate.email,
        role: userUpdate.role,
        createdAt: userUpdate.createdAt,
      };
    } catch (err) {
      throw err;
    }
  }
}
