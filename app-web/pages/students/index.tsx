import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, FileText, Search } from "lucide-react";
import Link from "next/link";

const studentActions = [
  {
    title: "Cadastrar Novo Aluno",
    description:
      "Adicione um novo aluno ao sistema, incluindo dados pessoais e plano.",
    icon: UserPlus,
    href: "/Register",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Gerenciar Alunos",
    description:
      "Busque, edite ou remova alunos. Atualize informações cadastrais.",
    icon: Users,
    href: "/students/manage", // Placeholder
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Relatórios de Assiduidade",
    description: "Visualize a frequência dos alunos e identifique ausências.",
    icon: FileText,
    href: "/students/reports", // Placeholder
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Consultar Ficha",
    description: "Acesse rapidamente a ficha de treino e histórico do aluno.",
    icon: Search,
    href: "/students/search", // Placeholder
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Gestão de Alunos
          </h2>
          <p className="text-zinc-400 mt-2">
            Gerencie matrículas, atualizações e relatórios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentActions.map((action) => (
            <Link key={action.title} href={action.href} className="group">
              <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white hover:bg-zinc-900 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-black/20 h-full">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.bgColor} transition-colors`}
                  >
                    <action.icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
