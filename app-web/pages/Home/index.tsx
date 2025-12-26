"use client";

import { DashboardCard } from "@/components/DashBoardCard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CheckCircle, Users, ClipboardList, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ActivityChart } from "@/components/ActivityChart";
import { UpcomingClasses } from "@/components/UpcomingClasses";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Home() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Visão Geral
            </h2>
            <span className="text-zinc-400 text-sm">
              Última atualização: Hoje, 14:30
            </span>
          </div>

          {/* Operational Metrics Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <DashboardCard
              icon={<Users className="text-blue-500" />}
              title="Alunos Ativos"
              value="328"
              onClick={() => router.push("/students")}
            />
            <DashboardCard
              icon={<CheckCircle className="text-green-500" />}
              title="Check-ins Hoje"
              value="57"
              onClick={() => router.push("/checkins")}
            />
            <DashboardCard
              icon={<Users className="text-purple-500" />}
              title="Ocupação Atual"
              value="42/100"
              onClick={() => {}}
            />
            <DashboardCard
              icon={<Users className="text-emerald-500" />}
              title="Novos Alunos"
              value="+12"
              onClick={() => router.push("/students")}
            />
            <DashboardCard
              icon={<AlertCircle className="text-yellow-500" />}
              title="Autorizar Check-ins"
              value="3"
              onClick={() => router.push("/checkins")}
            />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Activity Chart & Feed */}
            <div className="lg:col-span-2 space-y-8">
              {/* Activity Chart */}
              <ActivityChart />

              {/* Activity Feed */}
              <section className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <ClipboardList className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Atividades Recentes
                    </h3>
                  </div>
                  <button className="text-xs text-zinc-400 hover:text-white transition-colors font-medium">
                    Ver histórico
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      time: "09:32",
                      text: "João Silva realizou check-in",
                      type: "checkin",
                    },
                    {
                      time: "10:15",
                      text: "Ana Souza renovou o plano Premium",
                      type: "payment",
                    },
                    {
                      time: "11:00",
                      text: "Pedro Lima foi cadastrado por Admin",
                      type: "new_user",
                    },
                    {
                      time: "11:45",
                      text: "Pagamento recebido de R$ 129,90",
                      type: "payment",
                    },
                    {
                      time: "12:30",
                      text: "Mariana Costa finalizou treino A",
                      type: "workout",
                    },
                  ].map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <span className="text-xs font-mono text-zinc-500">
                        {activity.time}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-zinc-300">{activity.text}</p>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "checkin"
                            ? "bg-green-500"
                            : activity.type === "payment"
                            ? "bg-emerald-500"
                            : activity.type === "new_user"
                            ? "bg-blue-500"
                            : "bg-orange-500"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Upcoming Classes */}
            <div className="lg:col-span-1">
              <UpcomingClasses />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
