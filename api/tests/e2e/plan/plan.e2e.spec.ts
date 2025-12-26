import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../src/http/server";
import request from "supertest";
import { prisma } from "../../../src/infra/prisma";

describe("Plan - e2e Test", () => {
  let token: string;

  beforeAll(async () => {
    await app.ready();
    await prisma.user.deleteMany();
    await prisma.plan.deleteMany();

    const adminEmail = "admin-plan@example.com";
    const adminPassword = "123456";

    await request(app.server).post("/create-user").send({
      name: "Admin Plan",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    const authResponse = await request(app.server).post("/authenticate").send({
      email: adminEmail,
      password: adminPassword,
    });

    token = authResponse.body.token;
  });

  afterAll(async () => {
    await prisma.plan.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it("Should be able to create a plan", async () => {
    const response = await request(app.server)
      .post("/plans")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Monthly Plan",
        duration: 1,
        price: 99.99,
        description: "Monthly gym membership",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual("Monthly Plan");
  });

  it("Should be able to list plans", async () => {
    const response = await request(app.server)
      .get("/plans")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toEqual("Monthly Plan");
  });

  it("Should be able to get a plan by id", async () => {
    const listResponse = await request(app.server)
      .get("/plans")
      .set("Authorization", `Bearer ${token}`);
    const planId = listResponse.body[0].id;

    const response = await request(app.server)
      .get(`/plans/${planId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toEqual(planId);
  });

  it("Should be able to update a plan", async () => {
    const listResponse = await request(app.server)
      .get("/plans")
      .set("Authorization", `Bearer ${token}`);
    const planId = listResponse.body[0].id;

    const response = await request(app.server)
      .put(`/plans/${planId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Monthly Plan Updated",
        price: 89.99,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual("Monthly Plan Updated");
    expect(response.body.price).toEqual(89.99);
  });

  it("Should be able to delete a plan", async () => {
    const listResponse = await request(app.server)
      .get("/plans")
      .set("Authorization", `Bearer ${token}`);
    const planId = listResponse.body[0].id;

    const response = await request(app.server)
      .delete(`/plans/${planId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(204);

    const getResponse = await request(app.server)
      .get(`/plans/${planId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getResponse.statusCode).toBe(404);
  });
});
