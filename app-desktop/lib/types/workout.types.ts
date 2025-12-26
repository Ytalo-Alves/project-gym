export interface WorkoutCategory {
  id: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  title: string;
  description?: string;
  level?: string;
  duration?: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: WorkoutCategory;
  exercises?: WorkoutExercise[];
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  videoUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  order: number;
  instructions?: string;
  exercise?: Exercise;
}

export interface WorkoutAssignment {
  id: string;
  studentId: string;
  workoutId: string;
  assignedAt: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
  };
  workout?: Workout;
}
