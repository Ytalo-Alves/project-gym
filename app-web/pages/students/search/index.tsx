"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  User,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText,
  CreditCard,
  Calendar,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { studentService } from "@/lib/services/student.service";
import type { Student } from "@/lib/types/student.types";
import { contractService } from "@/lib/services/contract.service";
import type { Contract } from "@/lib/types/contract.types";

export default function StudentSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [student, setStudent] = useState<Student | null>(null);
  const [activeContract, setActiveContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Auto search if query param exists
  useEffect(() => {
    if (initialQuery && !searched) {
      handleSearch();
    }
  }, [initialQuery]);

  // Format CPF: 12345678901 -> 123.456.789-01
  const formatCpf = (cpf: string): string => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  // Format phone: 11999999999 -> (11) 99999-9999
  const formatPhone = (phone: string): string => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  // Format date: ISO -> DD/MM/YYYY
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Por favor, digite um termo de busca");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStudent(null);
    setActiveContract(null);

    try {
      const students = await studentService.list();
      const query = searchQuery.toLowerCase().trim();

      const cleanQuery = searchQuery.replace(/\D/g, "");
      const found = students.find((s) => {
        const nameMatch = s.name.toLowerCase().includes(query);
        const emailMatch = s.email.toLowerCase().includes(query);
        const cpfMatch =
          cleanQuery.length > 0 &&
          s.cpf.replace(/\D/g, "").includes(cleanQuery);

        return nameMatch || emailMatch || cpfMatch;
      });

      if (found) {
        setStudent(found);
        try {
          const contract = await contractService.getActiveByStudentId(found.id);
          setActiveContract(contract);
        } catch (err) {
          console.error("Erro ao buscar contrato:", err);
        }
      } else {
        setError("Nenhum aluno encontrado com esse termo");
      }
      setSearched(true);
    } catch (err) {
      console.error("Erro ao buscar aluno:", err);
      setError("Erro ao buscar aluno. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setStudent(null);
    setError(null);
    setSearched(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-red-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

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
            <h2 className="text-3xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
              Consultar Ficha
            </h2>
            <p className="text-zinc-400 mt-1">
              Busque por um aluno para visualizar sua ficha completa.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 text-white shadow-2xl shadow-black/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite o nome, CPF ou email do aluno..."
                  className="pl-12 h-14 bg-black/20 border-white/5 text-white text-lg focus:border-red-500/50 focus:ring-red-500/20 transition-all placeholder:text-zinc-600"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="h-14 px-8 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium flex-1 md:flex-none shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    "Buscar Aluno"
                  )}
                </Button>
                {(student || searched) && (
                  <Button
                    onClick={handleClearSearch}
                    variant="ghost"
                    className="h-14 px-6 text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && !isLoading && (
          <Card className="bg-red-500/10 border-red-500/20 text-white backdrop-blur-sm">
            <CardContent className="p-6 flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-red-500">{error}</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Tente buscar por nome completo, CPF ou email
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!student && !error && !isLoading && !searched && (
          <Card className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 text-white border-dashed">
            <CardContent className="p-16 text-center">
              <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Search className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-medium text-zinc-300 mb-2">
                Nenhuma busca realizada
              </h3>
              <p className="text-zinc-500 max-w-sm mx-auto">
                Utilize o campo de busca acima para encontrar alunos por nome,
                CPF ou email.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Result Section - Student Found */}
        {student && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column: Personal Info */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 text-white overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-red-500/20 to-red-600/20" />
                <CardContent className="p-6 flex flex-col items-center text-center relative pt-12">
                  <div className="w-28 h-28 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border-4 border-zinc-900 shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-300">
                    <User className="w-12 h-12 text-zinc-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {student.name}
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    CPF: {formatCpf(student.cpf)}
                  </p>
                  <span className="mt-4 px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                    Ativo
                  </span>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 text-white">
                <CardHeader className="pb-3 border-b border-white/5">
                  <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                      <Phone className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-0.5">Telefone</p>
                      <span className="text-zinc-200 font-medium">
                        {formatPhone(student.phone)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                      <Mail className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-0.5">Email</p>
                      <span className="text-zinc-200 font-medium break-all">
                        {student.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                      <MapPin className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-0.5">Local</p>
                      <span className="text-zinc-200 font-medium">
                        {student.city}, {student.state}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Active Plan */}
              {activeContract && (
                <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-xl border border-red-500/20 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <CardHeader className="pb-4 border-b border-white/5 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg shadow-red-500/20">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">
                          Plano Atual
                        </CardTitle>
                        <p className="text-xs text-zinc-400">
                          Detalhes da assinatura vigente
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                    <div>
                      <p className="text-sm text-zinc-400 mb-1">Plano</p>
                      <p className="text-2xl font-bold text-white tracking-tight">
                        {activeContract.plan.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400 mb-1">Valor</p>
                      <p className="text-2xl font-bold text-white tracking-tight">
                        R$ {Number(activeContract.pricePaid).toFixed(2)}
                        <span className="text-sm font-normal text-zinc-500 ml-1">
                          /mês
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400 mb-2">
                        Data de Início
                      </p>
                      <div className="flex items-center gap-2 bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <p className="text-sm font-medium text-white">
                          {formatDate(activeContract.startDate)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400 mb-2">Vencimento</p>
                      <div className="flex items-center gap-2 bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <p className="text-sm font-medium text-white">
                          {formatDate(activeContract.endDate)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Personal Details */}
              <Card className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 text-white">
                <CardHeader className="pb-4 border-b border-white/5">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="w-1 h-6 bg-zinc-700 rounded-full" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      Data de Nascimento
                    </p>
                    <p className="text-lg font-medium text-white">
                      {formatDate(student.dateOfBirth)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      Gênero
                    </p>
                    <p className="text-lg font-medium text-white">
                      {student.gender === "MALE"
                        ? "Masculino"
                        : student.gender === "FEMALE"
                        ? "Feminino"
                        : "Outro"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 text-white">
                <CardHeader className="pb-4 border-b border-white/5">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="w-1 h-6 bg-zinc-700 rounded-full" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      CEP
                    </p>
                    <p className="text-lg font-medium text-white">
                      {student.cep}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      Logradouro
                    </p>
                    <p className="text-lg font-medium text-white">
                      {student.address}, {student.numberAddress}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      Bairro
                    </p>
                    <p className="text-lg font-medium text-white">
                      {student.neighborhood}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      Cidade/Estado
                    </p>
                    <p className="text-lg font-medium text-white">
                      {student.city} - {student.state}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              {(student.emergencyContact || student.emergencyContactPhone) && (
                <Card className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 text-white">
                  <CardHeader className="pb-4 border-b border-white/5">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <span className="w-1 h-6 bg-red-500/50 rounded-full" />
                      Contato de Emergência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {student.emergencyContact && (
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">
                          Nome
                        </p>
                        <p className="text-lg font-medium text-white">
                          {student.emergencyContact}
                        </p>
                      </div>
                    )}
                    {student.emergencyContactPhone && (
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">
                          Telefone
                        </p>
                        <p className="text-lg font-medium text-white">
                          {formatPhone(student.emergencyContactPhone)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Health Observations */}
              {student.observation && (
                <Card className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 text-white">
                  <CardHeader className="pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <FileText className="w-5 h-5 text-purple-500" />
                      </div>
                      <CardTitle className="text-lg font-bold">
                        Observações de Saúde
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {student.observation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
