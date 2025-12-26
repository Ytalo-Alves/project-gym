import { FastifyInstance } from "fastify";
import { WorkoutController } from "../controllers/workout.controller";
import { authenticate } from "../../../../http/middleware/authenticate";

const workoutController = new WorkoutController();

export async function workoutRoutes(app: FastifyInstance) {
  app.get("/categories", { onRequest: [authenticate] }, workoutController.listCategories);
  app.get("/category/:categoryId", { onRequest: [authenticate] }, workoutController.listWorkoutsByCategory);
  app.get("/:id", { onRequest: [authenticate] }, workoutController.getWorkout);

  // Assignment routes
  app.post(
    "/students/:studentId/workouts/:workoutId/assign",
    { onRequest: [authenticate] },
    workoutController.assignWorkout
  );
  app.get(
    "/students/:studentId/assignments",
    { onRequest: [authenticate] },
    workoutController.getStudentAssignments
  );
  app.delete("/assignments/:assignmentId", { onRequest: [authenticate] }, workoutController.removeAssignment);
  app.get("/:workoutId/assignments", { onRequest: [authenticate] }, workoutController.getWorkoutAssignments);
}
