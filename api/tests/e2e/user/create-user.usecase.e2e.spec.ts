import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../../src/http/server";
import  request  from "supertest"
import { prisma } from "../../../src/infra/prisma";

describe('Create User - e2e Test', ()=> {
  beforeAll(async () => {
    await app.ready()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.user.deleteMany()
    await app.close()
  })

  it('Should be able create a user', async () => {
    const response = await request(app.server)
    .post("/create-user")
    .send({
      name: 'User 1',
      email: 'johndoe@email.com',
      password: '123456',
      role: 'admin'
    })

    expect(response.statusCode).toBe(201)
  })

  it('Should not be able to create a user with a duplicate email address', async () => {
  const user = {
    name: 'User 2',
    email: 'user2@email.com',
    password: '123456',
    role: 'admin'
  };

  // Primeiro cadastro
  await request(app.server)
    .post('/create-user')
    .send(user)
    .expect(201);

  // Segundo cadastro com o mesmo e-mail
  const response = await request(app.server)
    .post('/create-user')
    .send(user);

  expect(response.statusCode).toBe(409);
  expect(response.body).toEqual(
    expect.objectContaining({
      status: 'error',
      message: 'Email already in use'
    })
  );
});

})