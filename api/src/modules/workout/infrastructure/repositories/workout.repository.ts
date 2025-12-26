import {
  Workout,
  WorkoutCategory,
  Exercise,
  WorkoutExercise,
  WorkoutAssignment,
} from "../../../../../generated/client";
import { prisma } from "../../../../infra/prisma";

export class WorkoutRepository {
  async listCategories(): Promise<WorkoutCategory[]> {
    return prisma.workoutCategory.findMany();
  }

  async getCategoryById(id: string): Promise<WorkoutCategory | null> {
    return prisma.workoutCategory.findUnique({
      where: { id },
    });
  }

  async listWorkoutsByCategory(categoryId: string): Promise<Workout[]> {
    return prisma.workout.findMany({
      where: { categoryId },
      include: {
        category: true,
        _count: {
          select: { exercises: true },
        },
      },
    });
  }

  async getWorkoutById(
    id: string
  ): Promise<
    | (Workout & { exercises: (WorkoutExercise & { exercise: Exercise })[] })
    | null
  > {
    return prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }

  async assignWorkout(
    studentId: string,
    workoutId: string,
    notes?: string
  ): Promise<WorkoutAssignment> {
    return prisma.workoutAssignment.create({
      data: {
        studentId,
        workoutId,
        notes,
      },
      include: {
        student: true,
        workout: true,
      },
    });
  }

  async getStudentAssignments(studentId: string): Promise<WorkoutAssignment[]> {
    return prisma.workoutAssignment.findMany({
      where: { studentId },
      include: {
        workout: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });
  }

  async removeAssignment(assignmentId: string): Promise<void> {
    await prisma.workoutAssignment.delete({
      where: { id: assignmentId },
    });
  }

  async getWorkoutAssignments(workoutId: string): Promise<WorkoutAssignment[]> {
    return prisma.workoutAssignment.findMany({
      where: { workoutId },
      include: {
        student: true,
      },
      orderBy: {
        assignedAt: "desc",
      },
    });
  }
}
