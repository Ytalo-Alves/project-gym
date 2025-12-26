import { DashboardLayout } from "@/components/DashboardLayout";
import { WorkoutCategoryCard } from "@/components/workouts/WorkoutCategoryCard";
import { workoutService } from "@/lib/services/workout.service";
import { WorkoutCategory } from "@/lib/types/workout.types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";

export default function WorkoutsPage() {
  const [categories, setCategories] = useState<WorkoutCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await workoutService.listCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-red-500" />
            Treinos
          </h2>
          <p className="text-zinc-400 mt-2">
            Selecione uma categoria para ver os treinos disponíveis.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <WorkoutCategoryCard
                key={category.id}
                category={category}
                onClick={() => router.push(`/workouts/category/${category.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
