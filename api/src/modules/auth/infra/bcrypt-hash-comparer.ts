import bcrypt from "bcryptjs";
import type { HashComparer } from "./hash-comparer";

export class BcryptHashComparer implements HashComparer {
  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
