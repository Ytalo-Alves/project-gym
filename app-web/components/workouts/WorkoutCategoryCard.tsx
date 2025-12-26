import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutCategory } from "@/lib/types/workout.types";
import { Dumbbell } from "lucide-react";
import Image from "next/image";

interface WorkoutCategoryCardProps {
  category: WorkoutCategory;
  onClick: () => void;
}

export function WorkoutCategoryCard({
  category,
  onClick,
}: WorkoutCategoryCardProps) {
  return (
    <Card
      className="group cursor-pointer bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white hover:bg-zinc-900 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-black/20 overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-48 w-full">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <Dumbbell className="w-12 h-12 text-zinc-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white">{category.name}</h3>
        </div>
      </div>
    </Card>
  );
}
