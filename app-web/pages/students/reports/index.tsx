import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityChart } from "@/components/ActivityChart";
import {
  AlertTriangle,
  Calendar,
  TrendingDown,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const absentStudents = [
  {
    name: "Fernanda Lima",
    daysAbsent: 15,
    lastVisit: "05/11/2023",
    plan: "Plano Premium",
    phone: "(11) 99999-9999",
  },
  {
    name: "Ricardo Gomes",
    daysAbsent: 12,
    lastVisit: "08/11/2023",
    plan: "Plano Básico",
    phone: "(11) 98888-8888",
  },
  {
    name: "Patricia Alves",
    daysAbsent: 10,
    lastVisit: "10/11/2023",
    plan: "Plano Família",
    phone: "(11) 97777-7777",
  },
];

export default function AttendanceReports() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/students")}
              className="text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Relatórios de Assiduidade
              </h2>
              <p className="text-zinc-400 mt-1">
                Monitore a frequência e identifique alunos em risco de evasão.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5 hover:text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Filtrar Período
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Frequência Média</p>
                <p className="text-2xl font-bold">3.2x / semana</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Check-ins (Mês)</p>
                <p className="text-2xl font-bold">1,248</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  Alunos Ausentes (+10 dias)
                </p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <ActivityChart />
          </div>

          {/* Risk List */}
          <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white h-full">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <CardTitle className="text-lg font-medium">
                  Risco de Evasão
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {absentStudents.map((student, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-white">{student.name}</p>
                        <p className="text-xs text-zinc-500">{student.plan}</p>
                      </div>
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                        {student.daysAbsent} dias ausente
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-zinc-400">
                        Última visita: {student.lastVisit}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-green-500 hover:text-green-400 hover:bg-green-500/10"
                      >
                        Contatar WhatsApp
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/5">
                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/5 hover:text-white text-xs"
                >
                  Ver lista completa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
