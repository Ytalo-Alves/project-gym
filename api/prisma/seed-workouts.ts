import { prisma } from "../src/infra/prisma";

export async function seedWorkouts() {
  console.log("Seeding workouts...");

  // Categories
  const categories = [
    {
      name: "Grupo A",
      imageUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop",
    },
    {
      name: "Grupo B",
      imageUrl:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop",
    },
    {
      name: "Parte Inferior",
      imageUrl:
        "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop",
    },
    {
      name: "Parte Superior",
      imageUrl:
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop",
    },
    {
      name: "Cardio",
      imageUrl:
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop",
    },
    {
      name: "Alongamento",
      imageUrl:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop",
    },
  ];

  for (const cat of categories) {
    // Avoid duplicating categories on repeated seeds
    let category = await prisma.workoutCategory.findFirst({
      where: { name: cat.name },
    });

    if (!category) {
      category = await prisma.workoutCategory.create({
        data: cat,
      });
    }

    // Create a sample workout for each category (if not exists)
    let workout = await prisma.workout.findFirst({
      where: {
        title: `Treino de ${cat.name}`,
        categoryId: category.id,
      },
    });

    if (!workout) {
      workout = await prisma.workout.create({
        data: {
          title: `Treino de ${cat.name}`,
          description: `Um treino completo focado em ${cat.name}.`,
          level: "Intermediário",
          duration: 45,
          categoryId: category.id,
        },
      });
    }

    // Create some exercises
    const exercises = [
      { name: "Agachamento", description: "Agachamento livre com barra." },
      { name: "Supino", description: "Supino reto com barra." },
      { name: "Flexão", description: "Flexão de braços no solo." },
      { name: "Abdominal", description: "Abdominal supra." },
    ];

    let order = 1;
    for (const ex of exercises) {
      let exercise = await prisma.exercise.findFirst({
        where: { name: ex.name },
      });

      if (!exercise) {
        exercise = await prisma.exercise.create({
          data: ex,
        });
      }

      const existingWorkoutExercise = await prisma.workoutExercise.findFirst({
        where: {
          workoutId: workout.id,
          exerciseId: exercise.id,
        },
      });

      if (!existingWorkoutExercise) {
        await prisma.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId: exercise.id,
            sets: 3,
            reps: 12,
            restTime: 60,
            order: order++,
            instructions: "Mantenha a postura correta.",
          },
        });
      }
    }
  }

  console.log("Seeding workouts finished.");
}

async function main() {
  await seedWorkouts();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
