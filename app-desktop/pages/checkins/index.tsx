"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { OccupancyCard } from "@/components/OccupancyCard";
import { CheckInStats } from "@/components/CheckInStats";
import { CheckInTable } from "@/components/CheckInTable";
import { PeakHoursChart } from "@/components/PeakHoursChart";
import {
  generateTodayCheckIns,
  getCurrentOccupancy,
  generateHourlyDistribution,
  calculateStats,
  CheckInRecord,
} from "@/lib/faker-data";
import { useEffect, useState } from "react";
import { Download, Filter, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckInsPage() {
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Generate initial data only on client side
    const initialCheckIns = generateTodayCheckIns();
    setCheckIns(initialCheckIns);
    setMounted(true);
  }, []);

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Carregando...</div>
        </div>
      </DashboardLayout>
    );
  }

  const currentOccupancy = getCurrentOccupancy(checkIns);
  const hourlyDistribution = generateHourlyDistribution(checkIns);
  const stats = calculateStats(checkIns);

  // Filter check-ins based on search
  const filteredCheckIns = searchTerm
    ? checkIns.filter((checkIn) =>
        checkIn.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : checkIns;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-foreground tracking-tight">
              Check-ins
            </h2>
            <p className="text-muted-foreground mt-2">
              Monitore a ocupação da academia e o histórico de check-ins em
              tempo real.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/40 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border/60">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <CheckInStats
          today={stats.today}
          thisWeek={stats.thisWeek}
          thisMonth={stats.thisMonth}
          averageDaily={stats.averageDaily}
          peakHour={stats.peakHour}
        />

        {/* Occupancy and Peak Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OccupancyCard
            currentOccupancy={currentOccupancy}
            maxCapacity={150}
          />
          <PeakHoursChart data={hourlyDistribution} />
        </div>

        {/* Search Bar */}
        <Card className="bg-card border-border/60">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome do aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background/30 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* Check-ins Table */}
        <CheckInTable checkIns={filteredCheckIns} />

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border/60">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Tempo Médio de Treino
                </p>
                <p className="text-2xl font-semibold">1h 23min</p>
                <p className="text-xs text-muted-foreground">
                  Baseado nos últimos 30 dias
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/60">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Taxa de Frequência
                </p>
                <p className="text-2xl font-semibold">78%</p>
                <p className="text-xs text-muted-foreground">
                  Alunos ativos este mês
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/60">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Horário Mais Movimentado
                </p>
                <p className="text-2xl font-semibold">{stats.peakHour}</p>
                <p className="text-xs text-muted-foreground">
                  Horário de pico hoje
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
