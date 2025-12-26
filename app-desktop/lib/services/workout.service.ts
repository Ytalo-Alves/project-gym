import { api } from "./api";
import {
  Workout,
  WorkoutCategory,
  WorkoutAssignment,
} from "../types/workout.types";

export const workoutService = {
  async listCategories(): Promise<WorkoutCategory[]> {
    return api.get<WorkoutCategory[]>("/workouts/categories");
  },

  async listWorkoutsByCategory(categoryId: string): Promise<Workout[]> {
    return api.get<Workout[]>(`/workouts/category/${categoryId}`);
  },

  async getWorkout(id: string): Promise<Workout> {
    return api.get<Workout>(`/workouts/${id}`);
  },

  async assignWorkout(
    studentId: string,
    workoutId: string,
    notes?: string
  ): Promise<WorkoutAssignment> {
    return api.post<WorkoutAssignment>(
      `/workouts/students/${studentId}/workouts/${workoutId}/assign`,
      { notes }
    );
  },

  async getStudentAssignments(studentId: string): Promise<WorkoutAssignment[]> {
    return api.get<WorkoutAssignment[]>(
      `/workouts/students/${studentId}/assignments`
    );
  },

  async removeAssignment(assignmentId: string): Promise<void> {
    return api.delete(`/workouts/assignments/${assignmentId}`);
  },

  async getWorkoutAssignments(workoutId: string): Promise<WorkoutAssignment[]> {
    return api.get<WorkoutAssignment[]>(`/workouts/${workoutId}/assignments`);
  },
};
