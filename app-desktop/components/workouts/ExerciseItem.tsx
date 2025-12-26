import { Card, CardContent } from "@/components/ui/card";
import { WorkoutExercise } from "@/lib/types/workout.types";
import { PlayCircle, Clock, Repeat } from "lucide-react";
import Image from "next/image";

interface ExerciseItemProps {
  item: WorkoutExercise;
  index: number;
}

export function ExerciseItem({ item, index }: ExerciseItemProps) {
  return (
    <Card className="bg-zinc-900/30 border border-white/5 overflow-hidden">
      <CardContent className="p-0 flex flex-col md:flex-row">
        {item.exercise?.imageUrl && (
          <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
            <Image
              src={item.exercise.imageUrl}
              alt={item.exercise.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-medium text-red-500 uppercase tracking-wider mb-1 block">
                Exercício {index + 1}
              </span>
              <h4 className="text-xl font-bold text-white mb-2">
                {item.exercise?.name}
              </h4>
              <p className="text-zinc-400 text-sm">
                {item.exercise?.description}
              </p>
            </div>
            {item.exercise?.videoUrl && (
              <a
                href={item.exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-red-500"
              >
                <PlayCircle className="w-6 h-6" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {item.sets && (
              <div className="bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-zinc-500 block mb-1">Séries</span>
                <span className="text-lg font-semibold text-white">
                  {item.sets}
                </span>
              </div>
            )}
            {item.reps && (
              <div className="bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-zinc-500 block mb-1">
                  Repetições
                </span>
                <span className="text-lg font-semibold text-white">
                  {item.reps}
                </span>
              </div>
            )}
            {item.duration && (
              <div className="bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-zinc-500 block mb-1">
                  Duração
                </span>
                <span className="text-lg font-semibold text-white">
                  {item.duration}s
                </span>
              </div>
            )}
            {item.restTime && (
              <div className="bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-zinc-500 block mb-1">
                  Descanso
                </span>
                <span className="text-lg font-semibold text-white">
                  {item.restTime}s
                </span>
              </div>
            )}
          </div>

          {item.instructions && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-200">
                <span className="font-semibold">Dica:</span> {item.instructions}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
