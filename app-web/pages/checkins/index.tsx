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
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Check-ins
            </h2>
            <p className="text-zinc-400 mt-2">
              Monitore a ocupação da academia e o histórico de check-ins em
              tempo real.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors">
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
        <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar por nome do aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-white/5 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* Check-ins Table */}
        <CheckInTable checkIns={filteredCheckIns} />

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-zinc-400 font-medium">
                  Tempo Médio de Treino
                </p>
                <p className="text-2xl font-bold text-white">1h 23min</p>
                <p className="text-xs text-zinc-500">
                  Baseado nos últimos 30 dias
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-zinc-400 font-medium">
                  Taxa de Frequência
                </p>
                <p className="text-2xl font-bold text-white">78%</p>
                <p className="text-xs text-zinc-500">Alunos ativos este mês</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-zinc-400 font-medium">
                  Horário Mais Movimentado
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats.peakHour}
                </p>
                <p className="text-xs text-zinc-500">Horário de pico hoje</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
