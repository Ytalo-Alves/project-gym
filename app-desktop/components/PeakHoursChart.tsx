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
    <Card className="bg-card border-border/60">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
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
                  <span className="text-muted-foreground font-medium w-16">
                    {formatHour(item.hour)}
                  </span>
                  <span
                    className={`font-semibold ${
                      isPeak ? "text-primary" : "text-foreground/90"
                    }`}
                  >
                    {item.count} check-ins
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isPeak ? "bg-primary" : "bg-accent"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Horário de pico</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-muted-foreground">Outros horários</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
