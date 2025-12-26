import type { UserRepository } from "../../user/domain/user.interface";
import type { Encrypter } from "../infra/encrypter";
import type { HashComparer } from "../infra/hash-comparer";
import type {
  AuthUserRequestDTO,
  AuthUserResponseDTO,
} from "../presentation/authenticate-user.dto";

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthUserRequestDTO): Promise<AuthUserResponseDTO> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new Error("Invalid credentials");

    const isValid = await this.hashComparer.compare(password, user.password);

    if (!isValid) throw new Error("Invalid credentials");

    const token = await this.encrypter.encrypt({
      sub: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || undefined,
    });

    return { token };
  }
}
