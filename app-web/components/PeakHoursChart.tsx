"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface PeakHoursChartProps {
  data: { hour: number; count: number }[];
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count));

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return (
    <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-red-500" />
          Horários de Pico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => {
            const percentage = (item.count / maxCount) * 100;
            const isPeak = item.count === maxCount;

            return (
              <div key={item.hour} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400 font-medium w-16">
                    {formatHour(item.hour)}
                  </span>
                  <span
                    className={`font-semibold ${
                      isPeak ? "text-red-500" : "text-zinc-300"
                    }`}
                  >
                    {item.count} check-ins
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isPeak
                        ? "bg-linear-to-r from-red-600 to-red-500"
                        : percentage > 70
                        ? "bg-linear-to-r from-orange-600 to-orange-500"
                        : percentage > 40
                        ? "bg-linear-to-r from-yellow-600 to-yellow-500"
                        : "bg-linear-to-r from-blue-600 to-blue-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-linear-to-r from-red-600 to-red-500" />
              <span className="text-zinc-400">Horário de pico</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-600 to-blue-500" />
              <span className="text-zinc-400">Baixa ocupação</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
