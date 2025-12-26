import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workout } from "@/lib/types/workout.types";
import { Clock, BarChart, ChevronRight } from "lucide-react";

interface WorkoutCardProps {
  workout: Workout;
  onClick: () => void;
}

export function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  return (
    <Card
      className="group cursor-pointer bg-card border-border/60 hover:bg-card/80 hover:border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-black/20"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold transition-colors flex justify-between items-center">
          {workout.title}
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {workout.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {workout.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{workout.duration} min</span>
            </div>
          )}
          {workout.level && (
            <div className="flex items-center gap-1">
              <BarChart className="w-4 h-4" />
              <span>{workout.level}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
