export class UpdateUserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: "admin" | "trainer" | "staff";
  createdAt: Date;

  constructor(data: UpdateUserResponseDTO) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.createdAt = data.createdAt;
  }
}
