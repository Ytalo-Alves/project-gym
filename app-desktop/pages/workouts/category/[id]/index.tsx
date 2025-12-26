import { DashboardLayout } from "@/components/DashboardLayout";
import { WorkoutCard } from "@/components/workouts/WorkoutCard";
import { workoutService } from "@/lib/services/workout.service";
import { Workout, WorkoutCategory } from "@/lib/types/workout.types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WorkoutListPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [category, setCategory] = useState<WorkoutCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      loadData(id as string);
    }
  }, [id]);

  async function loadData(categoryId: string) {
    try {
      setLoading(true);
      // Fetch category details (we might need a new endpoint or just filter from list if we cached it, but better to fetch)
      // For now, I'll fetch workouts. I don't have a specific "getCategory" endpoint in my service yet, but I added it to repo.
      // I should update service to include getCategory if I want to show category name.
      // Or I can just list workouts and maybe the backend returns category info included?
      // My repo `listWorkoutsByCategory` includes `category: true`.

      const data = await workoutService.listWorkoutsByCategory(categoryId);
      setWorkouts(data);

      if (data.length > 0 && data[0].category) {
        setCategory(data[0].category);
      } else {
        // If no workouts, I might want to fetch category separately to show title.
        // But for now let's assume there are workouts or I'll just show "Treinos".
        // I'll add getCategory to service later if needed.
      }
    } catch (error) {
      console.error("Failed to load workouts", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <Link
            href="/workouts"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Categorias
          </Link>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {category ? category.name : "Treinos"}
          </h2>
          <p className="text-zinc-400 mt-2">Escolha um treino para começar.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            Nenhum treino encontrado nesta categoria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onClick={() => router.push(`/workouts/${workout.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
