"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardCard } from "@/components/DashBoardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { RevenueChart } from "@/components/RevenueChart";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useState } from "react";
import { FinanceReportModal } from "@/components/FinanceReportModal";

const paymentStatusData = [
  { name: "Em Dia", value: 320, color: "#22c55e" }, // green-500
  { name: "Pendentes", value: 45, color: "#eab308" }, // yellow-500
  { name: "Inadimplentes", value: 28, color: "#ef4444" }, // red-500
];

const defaultingStudents = [
  { name: "Carlos Eduardo", amount: "R$ 129,90", days: 5, plan: "Premium" },
  { name: "Fernanda Lima", amount: "R$ 89,90", days: 12, plan: "Básico" },
  { name: "Roberto Santos", amount: "R$ 129,90", days: 2, plan: "Premium" },
  { name: "Julia Martins", amount: "R$ 89,90", days: 25, plan: "Básico" },
];

export default function FinancePage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Financeiro
            </h2>
            <p className="text-zinc-400 mt-2">
              Visão detalhada de faturamento e inadimplência.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Exportar Relatório
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
              Nova Receita
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            icon={<DollarSign className="text-emerald-500" />}
            title="Faturamento Total"
            value="R$ 98.320"
          />
          <DashboardCard
            icon={<TrendingUp className="text-blue-500" />}
            title="Receita Prevista"
            value="R$ 105.400"
          />
          <DashboardCard
            icon={<AlertCircle className="text-red-500" />}
            title="Inadimplência"
            value="R$ 4.250"
          />
          <DashboardCard
            icon={<Wallet className="text-purple-500" />}
            title="Ticket Médio"
            value="R$ 115,00"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart (Reused) */}
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>

          {/* Payment Status Pie Chart */}
          <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white hover:border-white/10 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                Status de Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="rgba(0,0,0,0)"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#09090b",
                        border: "1px solid #27272a",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Defaulting Students List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Alunos Inadimplentes
            </h3>
            <a href="#" className="text-sm text-red-500 hover:text-red-400">
              Ver todos
            </a>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-zinc-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Aluno</th>
                  <th className="px-6 py-4 font-medium">Plano</th>
                  <th className="px-6 py-4 font-medium">Valor em Aberto</th>
                  <th className="px-6 py-4 font-medium">Atraso</th>
                  <th className="px-6 py-4 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {defaultingStudents.map((student, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{student.plan}</td>
                    <td className="px-6 py-4 text-red-400 font-medium">
                      {student.amount}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {student.days} dias
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1.5 rounded-md transition-colors">
                        Cobrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <FinanceReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
