"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface OccupancyCardProps {
  currentOccupancy: number;
  maxCapacity?: number;
}

export function OccupancyCard({
  currentOccupancy,
  maxCapacity = 150,
}: OccupancyCardProps) {
  const occupancyPercentage = Math.round(
    (currentOccupancy / maxCapacity) * 100
  );

  // Determine color based on occupancy
  const getOccupancyColor = () => {
    if (occupancyPercentage < 50) return "text-green-500";
    if (occupancyPercentage < 80) return "text-yellow-500";
    return "text-red-500";
  };

  const getOccupancyBg = () => {
    if (occupancyPercentage < 50) return "bg-green-500/10";
    if (occupancyPercentage < 80) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  const getOccupancyStatus = () => {
    if (occupancyPercentage < 50) return "Baixa";
    if (occupancyPercentage < 80) return "Moderada";
    return "Alta";
  };

  return (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-red-500" />
          Ocupação Atual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="text-5xl font-bold text-white">
            {currentOccupancy}
          </div>
          <div className="text-zinc-400 mb-2">/ {maxCapacity} pessoas</div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Capacidade</span>
            <span className={getOccupancyColor()}>{occupancyPercentage}%</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                occupancyPercentage < 50
                  ? "bg-green-500"
                  : occupancyPercentage < 80
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>

        {/* Status badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getOccupancyBg()}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${getOccupancyColor().replace(
              "text-",
              "bg-"
            )}`}
          />
          <span className={`text-sm font-medium ${getOccupancyColor()}`}>
            Ocupação {getOccupancyStatus()}
          </span>
        </div>

        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Users className="w-4 h-4" />
            <span>Pessoas atualmente na academia</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
