import { UserRepository } from "../domain/user.interface";
import fs from "node:fs";
import util from "node:util";
import { pipeline } from "node:stream";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { appUrl, env } from "../../../config/env";

const pump = util.promisify(pipeline);

interface UploadAvatarRequest {
  userId: string;
  file: any; // Multipart file
}

export class UploadAvatarUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ userId, file }: UploadAvatarRequest) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const uploadDir = path.resolve(__dirname, "../../../../", env.UPLOAD_DIR);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExtension = path.extname(file.filename);
    const fileName = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    await pump(file.file, fs.createWriteStream(filePath));

    const avatarUrl = `${appUrl}/uploads/${fileName}`;

    await this.userRepository.update(userId, { avatarUrl });

    return { avatarUrl };
  }
}
