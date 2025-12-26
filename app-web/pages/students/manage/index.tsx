import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserX,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { studentService } from "@/lib/services/student.service";
import type { Student } from "@/lib/types/student.types";
import { StudentEditModal } from "@/components/StudentEditModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ManageStudents() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal states
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await studentService.list();
      setStudents(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar alunos";
      setError(errorMessage);
      console.error("Erro ao carregar alunos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);
    setEditingStudent(null);
    await loadStudents();
  };

  const formatPhone = (phone: string): string => {
    // Format: (XX) XXXXX-XXXX
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
        7
      )}`;
    }
    return phone;
  };

  const formatCPF = (cpf: string): string => {
    // Format: XXX.XXX.XXX-XX
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(
        6,
        9
      )}-${cleaned.slice(9)}`;
    }
    return cpf;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
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
              Gerenciar Alunos
            </h2>
            <p className="text-zinc-400 mt-1">
              Visualize, edite e gerencie todos os alunos cadastrados.
            </p>
          </div>
        </div>

        <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg font-medium">
                Lista de Alunos
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    placeholder="Buscar aluno..."
                    className="pl-9 bg-zinc-950/50 border-white/10 text-white w-full md:w-64 focus:border-red-500/50"
                  />
                </div>
                <Button
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 hover:text-white"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Aluno</th>
                    <th className="px-6 py-4 font-medium">Telefone</th>
                    <th className="px-6 py-4 font-medium">CPF</th>
                    <th className="px-6 py-4 font-medium">Cidade</th>
                    <th className="px-6 py-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                          <p className="text-zinc-400">Carregando alunos...</p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-red-500">{error}</p>
                          <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="border-white/10 hover:bg-white/5"
                          >
                            Tentar Novamente
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <p className="text-zinc-400">
                          Nenhum aluno cadastrado ainda.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                        onDoubleClick={() =>
                          router.push(
                            `/students/search?q=${encodeURIComponent(
                              student.name
                            )}`
                          )
                        }
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={student.photoUrl || undefined}
                                alt={student.name}
                                key={student.photoUrl || student.id}
                              />
                              <AvatarFallback className="bg-zinc-800 text-white">
                                {student.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white">
                                {student.name}
                              </p>
                              <p className="text-xs text-red-500 font-bold">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          {formatPhone(student.phone)}
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          {formatCPF(student.cpf)}
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          {student.city} - {student.state}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-zinc-900 border-zinc-800 text-white"
                            >
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleEditClick(student)}
                                className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-zinc-800" />
                              <DropdownMenuItem className="text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <StudentEditModal
          student={editingStudent}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingStudent(null);
          }}
          onSuccess={handleEditSuccess}
        />
      </div>
    </DashboardLayout>
  );
}
