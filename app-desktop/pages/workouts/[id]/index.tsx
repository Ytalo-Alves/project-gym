import { DashboardLayout } from "@/components/DashboardLayout";
import { ExerciseItem } from "@/components/workouts/ExerciseItem";
import { AssignWorkoutModal } from "@/components/workouts/AssignWorkoutModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { workoutService } from "@/lib/services/workout.service";
import { Workout, WorkoutAssignment } from "@/lib/types/workout.types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock,
  BarChart,
  UserPlus,
  Users,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function WorkoutDetailsPage() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [assignments, setAssignments] = useState<WorkoutAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      loadData(id as string);
    }
  }, [id]);

  async function loadData(workoutId: string) {
    try {
      setLoading(true);
      const [workoutData, assignmentsData] = await Promise.all([
        workoutService.getWorkout(workoutId),
        workoutService.getWorkoutAssignments(workoutId),
      ]);
      setWorkout(workoutData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Failed to load workout", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveAssignment(assignmentId: string) {
    if (!confirm("Deseja remover esta atribuição?")) return;

    try {
      await workoutService.removeAssignment(assignmentId);
      setAssignments(assignments.filter((a) => a.id !== assignmentId));
    } catch (error) {
      console.error("Failed to remove assignment", error);
      alert("Erro ao remover atribuição");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!workout) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-zinc-500">
          Treino não encontrado.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <Link
            href={`/workouts/category/${workout.categoryId}`}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Lista
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                {workout.title}
              </h2>
              <p className="text-zinc-400 text-lg">{workout.description}</p>

              <div className="flex items-center gap-6 mt-4 text-zinc-500">
                {workout.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-red-500" />
                    <span>{workout.duration} min</span>
                  </div>
                )}
                {workout.level && (
                  <div className="flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-red-500" />
                    <span>{workout.level}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 shadow-lg shadow-red-600/20"
              onClick={() => setShowAssignModal(true)}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Atribuir a Aluno
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
              Lista de Exercícios
            </h3>

            {workout.exercises?.map((item, index) => (
              <ExerciseItem key={item.id} item={item} index={index} />
            ))}
          </div>

          <div>
            <Card className="bg-zinc-900/50 border-white/5 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5 text-red-500" />
                  Alunos Atribuídos ({assignments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <p className="text-zinc-500 text-sm">
                    Nenhum aluno atribuído ainda.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-white/5"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">
                            {assignment.student?.name}
                          </p>
                          <p className="text-zinc-500 text-xs">
                            {new Date(assignment.assignedAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveAssignment(assignment.id)}
                          className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AssignWorkoutModal
        open={showAssignModal}
        onOpenChange={setShowAssignModal}
        workoutId={workout.id}
        workoutTitle={workout.title}
        onAssigned={() => loadData(workout.id)}
      />
    </DashboardLayout>
  );
}
