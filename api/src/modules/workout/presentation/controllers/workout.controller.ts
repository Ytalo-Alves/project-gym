import { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import {
  assignmentIdSchema,
  assignWorkoutBodySchema,
  categoryIdSchema,
  studentWorkoutParamsSchema,
  workoutAssignmentsByWorkoutSchema,
  workoutIdSchema,
} from "../../workout.schema";
import { WorkoutRepository } from "../../infrastructure/repositories/workout.repository";

const workoutRepository = new WorkoutRepository();

function handleControllerError(
  reply: FastifyReply,
  error: unknown,
  message: string
) {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ error: "Invalid data", issues: error.issues });
  }

  return reply.status(500).send({ error: message });
}

export class WorkoutController {
  async listCategories(req: FastifyRequest, reply: FastifyReply) {
    try {
      const categories = await workoutRepository.listCategories();
      return reply.send(categories);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to list categories");
    }
  }

  async listWorkoutsByCategory(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { categoryId } = categoryIdSchema.parse(req.params);
      const workouts = await workoutRepository.listWorkoutsByCategory(
        categoryId
      );
      return reply.send(workouts);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to list workouts");
    }
  }

  async getWorkout(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = workoutIdSchema.parse(req.params);
      const workout = await workoutRepository.getWorkoutById(id);
      if (!workout) {
        return reply.status(404).send({ error: "Workout not found" });
      }
      return reply.send(workout);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to get workout");
    }
  }

  async assignWorkout(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { studentId, workoutId } = studentWorkoutParamsSchema.parse(
        req.params
      );
      const { notes } = assignWorkoutBodySchema.parse(req.body ?? {});
      const assignment = await workoutRepository.assignWorkout(
        studentId,
        workoutId,
        notes
      );
      return reply.send(assignment);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to assign workout");
    }
  }

  async getStudentAssignments(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { studentId } = studentWorkoutParamsSchema
        .pick({ studentId: true })
        .parse(req.params);
      const assignments = await workoutRepository.getStudentAssignments(
        studentId
      );
      return reply.send(assignments);
    } catch (error) {
      return handleControllerError(
        reply,
        error,
        "Failed to get student assignments"
      );
    }
  }

  async removeAssignment(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { assignmentId } = assignmentIdSchema.parse(req.params);
      await workoutRepository.removeAssignment(assignmentId);
      return reply.status(204).send();
    } catch (error) {
      return handleControllerError(reply, error, "Failed to remove assignment");
    }
  }

  async getWorkoutAssignments(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { workoutId } = workoutAssignmentsByWorkoutSchema.parse(
        req.params
      );
      const assignments = await workoutRepository.getWorkoutAssignments(
        workoutId
      );
      return reply.send(assignments);
    } catch (error) {
      return handleControllerError(
        reply,
        error,
        "Failed to get workout assignments"
      );
    }
  }
}
