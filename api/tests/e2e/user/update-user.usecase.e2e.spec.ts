import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../src/http/server";
import { prisma } from "../../../src/infra/prisma";
import request from "supertest";

describe("Update user - e2e Test", () => {
  beforeAll(async () => {
    await app.ready();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it("Should be able update a user", async () => {
    const email = "userupdate@email.com";
    const password = "123456";

    const createUserResponse = await request(app.server)
      .post("/create-user")
      .send({
        name: "User Update",
        email,
        password,
        role: "admin",
      })
      .expect(201);

    const userId = createUserResponse.body.id;

    const authResponse = await request(app.server)
      .post("/authenticate")
      .send({ email, password });

    const token = authResponse.body.token;

    const updateResponse = await request(app.server)
      .put(`/update-user/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "User",
      });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.name).toBe("User");
  });

  it("Should not be able allow duplicate email on update", async () => {
    // Create first user with a specific email
    await request(app.server)
      .post("/create-user")
      .send({
        name: "User One",
        email: "duplicate@email.com",
        password: "123456",
        role: "admin",
      })
      .expect(201);

    // Create second user with a different email
    const secondUserResponse = await request(app.server)
      .post("/create-user")
      .send({
        name: "User Two",
        email: "unique@email.com",
        password: "123456",
        role: "admin",
      })
      .expect(201);

    // Authenticate as second user to update
    const authResponse = await request(app.server)
      .post("/authenticate")
      .send({
        email: "unique@email.com",
        password: "123456",
      });

    const token = authResponse.body.token;

    // Attempt to update second user's email to the duplicate email
    const updateResponse = await request(app.server)
      .put(`/update-user/${secondUserResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "duplicate@email.com",
      });

    // Expect a conflict response (409) for duplicate email
    expect(updateResponse.statusCode).toBe(409);
  });
});
