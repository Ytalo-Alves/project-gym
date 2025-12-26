import { hash } from "bcryptjs";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";
import { PrismaClient } from "./generated/client";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL não definida.");
}

const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Listing users...");
  const users = await prisma.user.findMany();
  console.table(users);

  const adminEmail = "admin@gym.com";
  const newPassword = "123456";

  const admin = users.find((u) => u.email === adminEmail);

  if (admin) {
    console.log(`Found admin user: ${admin.email}`);
    const passwordHash = await hash(newPassword, 8);
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: passwordHash },
    });
    console.log(`Password for ${adminEmail} reset to '${newPassword}'`);
  } else {
    console.log(`User with email ${adminEmail} not found.`);
    console.log("Creating admin user...");
    const passwordHash = await hash(newPassword, 8);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: passwordHash,
        role: "admin",
      },
    });
    console.log(
      `Admin user created with email ${adminEmail} and password '${newPassword}'`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
