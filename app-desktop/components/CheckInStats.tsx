"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Calendar, TrendingUp } from "lucide-react";

interface CheckInStatsProps {
  today: number;
  thisWeek: number;
  thisMonth: number;
  averageDaily: number;
  peakHour: string;
}

export function CheckInStats({
  today,
  thisWeek,
  thisMonth,
  averageDaily,
  peakHour,
}: CheckInStatsProps) {
  const stats = [
    {
      title: "Check-ins Hoje",
      value: today,
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Esta Semana",
      value: thisWeek,
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Este Mês",
      value: thisMonth,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Média Diária",
      value: averageDaily,
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      change: "Estável",
      changeType: "neutral" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="bg-card border-border/60 hover:bg-card/80 transition-colors"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-semibold">
                  {stat.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs. semana passada
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
