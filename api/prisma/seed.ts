import "dotenv/config";
import { hash } from "bcryptjs";
import { prisma } from "../src/infra/prisma";
import { seedWorkouts } from "./seed-workouts";

async function seedUsers() {
  console.log("Seeding users...");

  const adminPassword = await hash("123456", 8);
  const trainerPassword = await hash("123456", 8);
  const staffPassword = await hash("123456", 8);

  await prisma.user.upsert({
    where: { email: "admin@gym.com" },
    update: {
      password: adminPassword,
      role: "admin",
      name: "Admin",
    },
    create: {
      name: "Admin",
      email: "admin@gym.com",
      password: adminPassword,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "trainer@gym.com" },
    update: {
      password: trainerPassword,
      role: "trainer",
    },
    create: {
      name: "Treinador",
      email: "trainer@gym.com",
      password: trainerPassword,
      role: "trainer",
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@gym.com" },
    update: {
      password: staffPassword,
      role: "staff",
    },
    create: {
      name: "Atendente",
      email: "staff@gym.com",
      password: staffPassword,
      role: "staff",
    },
  });
}

async function seedPlans() {
  console.log("Seeding plans...");

  const plansData = [
    {
      name: "Mensal - Básico",
      duration: 1,
      price: 129.9,
      description: "Acesso total à academia por 1 mês.",
    },
    {
      name: "Trimestral - Performance",
      duration: 3,
      price: 349.9,
      description: "Plano de 3 meses com melhor custo-benefício.",
    },
    {
      name: "Anual - Premium",
      duration: 12,
      price: 1199.9,
      description: "Plano anual com melhores condições.",
    },
  ];

  const plans = [];

  for (const plan of plansData) {
    const existing = await prisma.plan.findFirst({
      where: { name: plan.name },
    });

    if (existing) {
      plans.push(existing);
    } else {
      const created = await prisma.plan.create({
        data: {
          name: plan.name,
          duration: plan.duration,
          price: plan.price,
          description: plan.description,
          status: "ACTIVE",
        },
      });
      plans.push(created);
    }
  }

  return plans;
}

async function seedStudents() {
  console.log("Seeding students...");

  const studentsData = [
    {
      name: "João Silva",
      email: "joao.silva@example.com",
      phone: "(11) 99999-0001",
      cpf: "11111111111",
      dateOfBirth: new Date("1990-01-15"),
      gender: "MALE" as const,
      cep: "01001-000",
      address: "Rua das Flores",
      numberAddress: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      emergencyContact: "Maria Silva",
      emergencyContactPhone: "(11) 98888-0001",
      observation: "Prefere treinos pela manhã.",
    },
    {
      name: "Maria Souza",
      email: "maria.souza@example.com",
      phone: "(11) 99999-0002",
      cpf: "22222222222",
      dateOfBirth: new Date("1988-05-20"),
      gender: "FEMALE" as const,
      cep: "01001-000",
      address: "Avenida Paulista",
      numberAddress: "1000",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      emergencyContact: "João Souza",
      emergencyContactPhone: "(11) 98888-0002",
      observation: "Foco em condicionamento físico.",
    },
    {
      name: "Carlos Pereira",
      email: "carlos.pereira@example.com",
      phone: "(11) 99999-0003",
      cpf: "33333333333",
      dateOfBirth: new Date("1995-09-10"),
      gender: "MALE" as const,
      cep: "01001-000",
      address: "Rua dos Atletas",
      numberAddress: "50",
      neighborhood: "Vila Olímpica",
      city: "São Paulo",
      state: "SP",
      emergencyContact: "Ana Pereira",
      emergencyContactPhone: "(11) 98888-0003",
      observation: "Atleta amador, busca performance.",
    },
    {
      name: "Ana Lima",
      email: "ana.lima@example.com",
      phone: "(11) 99999-0004",
      cpf: "44444444444",
      dateOfBirth: new Date("1992-03-08"),
      gender: "FEMALE" as const,
      cep: "04001-000",
      address: "Rua das Palmeiras",
      numberAddress: "250",
      neighborhood: "Vila Mariana",
      city: "São Paulo",
      state: "SP",
      emergencyContact: "Carlos Lima",
      emergencyContactPhone: "(11) 98888-0004",
      observation: "Objetivo: emagrecimento e condicionamento.",
    },
    {
      name: "Pedro Santos",
      email: "pedro.santos@example.com",
      phone: "(11) 99999-0005",
      cpf: "55555555555",
      dateOfBirth: new Date("1985-11-02"),
      gender: "MALE" as const,
      cep: "05001-000",
      address: "Avenida dos Esportes",
      numberAddress: "500",
      neighborhood: "Perdizes",
      city: "São Paulo",
      state: "SP",
      emergencyContact: "Fernanda Santos",
      emergencyContactPhone: "(11) 98888-0005",
      observation: "Treina para provas de corrida.",
    },
    {
      name: "Fernanda Costa",
      email: "fernanda.costa@example.com",
      phone: "(11) 99999-0006",
      cpf: "66666666666",
      dateOfBirth: new Date("1993-07-25"),
      gender: "FEMALE" as const,
      cep: "06001-000",
      address: "Rua do Movimento",
      numberAddress: "75",
      neighborhood: "Centro",
      city: "Osasco",
      state: "SP",
      emergencyContact: "Rafael Costa",
      emergencyContactPhone: "(11) 98888-0006",
      observation: "Foco em hipertrofia.",
    },
    {
      name: "Bruno Almeida",
      email: "bruno.almeida@example.com",
      phone: "(11) 99999-0007",
      cpf: "77777777777",
      dateOfBirth: new Date("1998-09-18"),
      gender: "MALE" as const,
      cep: "07001-000",
      address: "Rua dos Campeões",
      numberAddress: "12",
      neighborhood: "Centro",
      city: "Guarulhos",
      state: "SP",
      emergencyContact: "Juliana Almeida",
      emergencyContactPhone: "(11) 98888-0007",
      observation: "Pré-seleção para competições de fisiculturismo.",
    },
    {
      name: "Juliana Rocha",
      email: "juliana.rocha@example.com",
      phone: "(11) 99999-0008",
      cpf: "88888888888",
      dateOfBirth: new Date("1991-04-12"),
      gender: "FEMALE" as const,
      cep: "08001-000",
      address: "Avenida da Saúde",
      numberAddress: "320",
      neighborhood: "Saúde",
      city: "São Paulo",
      state: "SP",
      emergencyContact: "Bruno Rocha",
      emergencyContactPhone: "(11) 98888-0008",
      observation: "Reabilitação pós-cirúrgica, treinos leves.",
    },
    {
      name: "Rafael Oliveira",
      email: "rafael.oliveira@example.com",
      phone: "(11) 99999-0009",
      cpf: "99999999999",
      dateOfBirth: new Date("1989-12-30"),
      gender: "MALE" as const,
      cep: "09001-000",
      address: "Rua da Força",
      numberAddress: "210",
      neighborhood: "Centro",
      city: "Santo André",
      state: "SP",
      emergencyContact: "Camila Oliveira",
      emergencyContactPhone: "(11) 98888-0009",
      observation: "Foco em ganho de força.",
    },
    {
      name: "Camila Ferreira",
      email: "camila.ferreira@example.com",
      phone: "(11) 99999-0010",
      cpf: "10101010101",
      dateOfBirth: new Date("1996-06-05"),
      gender: "FEMALE" as const,
      cep: "09501-000",
      address: "Rua da Flexibilidade",
      numberAddress: "45",
      neighborhood: "Centro",
      city: "São Caetano do Sul",
      state: "SP",
      emergencyContact: "Lucas Ferreira",
      emergencyContactPhone: "(11) 98888-0010",
      observation: "Foco em mobilidade e alongamento.",
    },
  ];

  const students = [];

  for (const student of studentsData) {
    const existing = await prisma.student.findUnique({
      where: { email: student.email },
    });

    if (existing) {
      students.push(existing);
    } else {
      const created = await prisma.student.create({
        data: student,
      });
      students.push(created);
    }
  }

  return students;
}

async function seedContractsAndPayments() {
  console.log("Seeding contracts and payments...");

  const plans = await seedPlans();
  const students = await seedStudents();

  const now = new Date();

  // Helper to add months
  const addMonths = (date: Date, months: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  // Gera um contrato para cada aluno, alternando entre os planos disponíveis
  const contractsData = students.map((student, index) => {
    const plan = plans[index % plans.length];

    const monthOffset = Math.floor(index / plans.length);
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - monthOffset,
      1 + (index % 10)
    );

    return {
      student,
      plan,
      startDate,
    };
  });

  for (const entry of contractsData) {
    const existingContract = await prisma.contract.findFirst({
      where: {
        studentId: entry.student.id,
        planId: entry.plan.id,
      },
    });

    let contract = existingContract;

    if (!contract) {
      contract = await prisma.contract.create({
        data: {
          studentId: entry.student.id,
          planId: entry.plan.id,
          startDate: entry.startDate,
          endDate: addMonths(entry.startDate, entry.plan.duration),
          status: "ACTIVE",
          pricePaid: entry.plan.price,
        },
      });
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        contractId: contract.id,
      },
    });

    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          contractId: contract.id,
          amount: entry.plan.price,
          dueDate: entry.startDate,
          paidAt: entry.startDate,
          status: "PAID",
          method: "PIX",
        },
      });
    }
  }
}

async function seedWorkoutAssignments() {
  console.log("Seeding workout assignments...");

  const students = await prisma.student.findMany({
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  const workouts = await prisma.workout.findMany({
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  if (students.length === 0 || workouts.length === 0) {
    console.log("No students or workouts available to assign.");
    return;
  }

  const assignmentsData = [
    {
      studentId: students[0].id,
      workoutId: workouts[0].id,
      status: "PENDING" as const,
      notes: "Iniciar com carga leve e progredir semanalmente.",
    },
    {
      studentId: students[1].id,
      workoutId: workouts[1]?.id ?? workouts[0].id,
      status: "IN_PROGRESS" as const,
      notes: "Foco em execução correta dos movimentos.",
    },
    {
      studentId: students[2].id,
      workoutId: workouts[2]?.id ?? workouts[0].id,
      status: "COMPLETED" as const,
      notes: "Aluno completou o ciclo de treino.",
    },
  ];

  for (const data of assignmentsData) {
    const existing = await prisma.workoutAssignment.findFirst({
      where: {
        studentId: data.studentId,
        workoutId: data.workoutId,
      },
    });

    if (!existing) {
      await prisma.workoutAssignment.create({
        data: {
          studentId: data.studentId,
          workoutId: data.workoutId,
          status: data.status,
          notes: data.notes,
        },
      });
    }
  }
}

async function main() {
  console.log("Starting full database seed...");

  await seedUsers();
  await seedContractsAndPayments();
  await seedWorkouts();
  await seedWorkoutAssignments();

  console.log("Database seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
