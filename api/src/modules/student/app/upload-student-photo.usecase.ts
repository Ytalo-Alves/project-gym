import { StudentRepository } from "../domain/student.repository";
import fs from "node:fs";
import util from "node:util";
import { pipeline } from "node:stream";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { appUrl, env } from "../../../config/env";

const pump = util.promisify(pipeline);

interface UploadStudentPhotoRequest {
  studentId: string;
  file: any; // Multipart file
}

export class UploadStudentPhotoUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute({ studentId, file }: UploadStudentPhotoRequest) {
    const student = await this.studentRepository.findById(studentId);

    if (!student) {
      throw new Error("Student not found");
    }

    const uploadDir = path.resolve(
      __dirname,
      "../../../../",
      env.UPLOAD_DIR,
      "student-photos"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExtension = path.extname(file.filename);
    const fileName = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    await pump(file.file, fs.createWriteStream(filePath));

    const photoUrl = `${appUrl}/uploads/student-photos/${fileName}`;

    await this.studentRepository.update(studentId, { photoUrl });

    return { photoUrl };
  }
}
