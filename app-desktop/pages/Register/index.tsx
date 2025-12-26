"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { studentService } from "@/lib/services/student.service";
import type { CreateStudentRequest } from "@/lib/types/student.types";
import { planService } from "@/lib/services/plan.service";
import type { Plan } from "@/lib/types/plan.types";
import { contractService } from "@/lib/services/contract.service";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Heart,
  MapPin,
  ShieldAlert,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Plan states
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  // Form states
  const [formData, setFormData] = useState<CreateStudentRequest>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    dateOfBirth: "",
    gender: "MALE",
    cep: "",
    address: "",
    numberAddress: "",
    neighborhood: "",
    city: "",
    state: "",
    emergencyContact: "",
    emergencyContactPhone: "",
    observation: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (value: string) => {
    const genderMap: Record<string, "MALE" | "FEMALE" | "OTHER"> = {
      m: "MALE",
      f: "FEMALE",
      o: "OTHER",
    };
    handleSelectChange("gender", genderMap[value] || "MALE");
  };

  // Load plans on mount
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setPlansLoading(true);
        setPlansError(null);
        const allPlans = await planService.list();
        // Filter only active plans
        const activePlans = allPlans.filter((plan) => plan.status === "ACTIVE");
        setPlans(activePlans);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao carregar planos";
        setPlansError(errorMessage);
        console.error("Erro ao carregar planos:", err);
      } finally {
        setPlansLoading(false);
      }
    };

    loadPlans();
  }, []);

  // Format price in BRL
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Nome completo é obrigatório");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email é obrigatório");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Telefone é obrigatório");
      return false;
    }
    if (!formData.cpf.trim()) {
      setError("CPF é obrigatório");
      return false;
    }
    if (!formData.dateOfBirth) {
      setError("Data de nascimento é obrigatória");
      return false;
    }
    if (!formData.cep.trim()) {
      setError("CEP é obrigatório");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Endereço é obrigatório");
      return false;
    }
    if (!formData.numberAddress.trim()) {
      setError("Número do endereço é obrigatório");
      return false;
    }
    if (!formData.neighborhood.trim()) {
      setError("Bairro é obrigatório");
      return false;
    }
    if (!formData.city.trim()) {
      setError("Cidade é obrigatória");
      return false;
    }
    if (!formData.state.trim()) {
      setError("Estado é obrigatório");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Formatar a data para ISO string e tratar campos opcionais
      const submitData: CreateStudentRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        gender: formData.gender,
        cep: formData.cep,
        address: formData.address,
        numberAddress: formData.numberAddress,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        emergencyContact: formData.emergencyContact?.trim() || undefined,
        emergencyContactPhone:
          formData.emergencyContactPhone?.trim() || undefined,
        observation: formData.observation?.trim() || undefined,
      };

      const newStudent = await studentService.create(submitData);

      // Se um plano foi selecionado, criar contrato
      if (selectedPlanId) {
        const selectedPlan = plans.find((p) => p.id === selectedPlanId);
        if (selectedPlan) {
          await contractService.create({
            studentId: newStudent.id,
            planId: selectedPlanId,
            pricePaid: Number(selectedPlan.price),
            durationMonths: selectedPlan.duration,
          });
        }
      }

      setSuccess(true);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/students");
      }, 2000);
    } catch (err) {
      let errorMessage = "Erro ao cadastrar aluno";

      if (err instanceof Error) {
        // Parse status code from error message format: [CODE] message
        const statusMatch = err.message.match(/\[(\d+)\]/);
        const statusCode = statusMatch ? statusMatch[1] : null;

        // Check for specific error codes or messages
        // Check message content first to distinguish between email and CPF errors
        if (err.message.toLowerCase().includes("cpf")) {
          errorMessage = "Este CPF já está sendo usado por outro aluno";
        } else if (err.message.toLowerCase().includes("email")) {
          errorMessage = "Este email já está sendo usado por outro aluno";
        } else if (statusCode === "409") {
          errorMessage = "Dados já existem no sistema";
        } else if (statusCode === "400") {
          errorMessage =
            "Dados inválidos. Verifique os campos e tente novamente";
        } else {
          // Remove status code from message for display
          errorMessage = err.message.replace(/\[\d+\]\s*/, "") || errorMessage;
        }
      }

      setError(errorMessage);

      // Only log unexpected errors to console
      if (
        !errorMessage.includes("já está sendo usado") &&
        !errorMessage.includes("inválidos")
      ) {
        console.warn("Erro ao cadastrar aluno:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Novo Aluno
            </h2>
            <p className="text-zinc-400 mt-2">
              Preencha as informações completas para realizar a matrícula.
            </p>
          </div>
          <Link
            href="/students"
            className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Alunos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Info */}
            <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                  <CardTitle className="text-lg font-medium">
                    Dados Pessoais
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-zinc-400">Nome Completo</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: João da Silva"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-blue-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">CPF</Label>
                  <Input
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-blue-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Data de Nascimento</Label>
                  <Input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-blue-500/50 block"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Gênero</Label>
                  <Select
                    value={
                      formData.gender === "MALE"
                        ? "m"
                        : formData.gender === "FEMALE"
                        ? "f"
                        : "o"
                    }
                    onValueChange={handleGenderChange}
                  >
                    <SelectTrigger className="bg-zinc-950/50 border-white/10 text-white focus:border-blue-500/50">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="m">Masculino</SelectItem>
                      <SelectItem value="f">Feminino</SelectItem>
                      <SelectItem value="o">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@exemplo.com"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-blue-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Telefone / WhatsApp</Label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-blue-500/50"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <CardTitle className="text-lg font-medium">
                    Endereço
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">CEP</Label>
                  <Input
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-orange-500/50"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-zinc-400">Logradouro</Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Rua, Avenida..."
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-orange-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Número</Label>
                  <Input
                    name="numberAddress"
                    value={formData.numberAddress}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-orange-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Bairro</Label>
                  <Input
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    placeholder="Bairro"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-orange-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Cidade</Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Cidade"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-orange-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Estado</Label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="UF"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-orange-500/50"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Secondary Info */}
          <div className="space-y-8">
            {/* Plan Selection */}
            <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-green-500" />
                  </div>
                  <CardTitle className="text-lg font-medium">
                    Plano & Pagamento
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Plano Selecionado</Label>
                  {plansLoading ? (
                    <div className="bg-zinc-950/50 border border-white/10 rounded-md px-3 py-2 text-zinc-500">
                      Carregando planos...
                    </div>
                  ) : plansError ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2 text-red-500 text-sm">
                      {plansError}
                    </div>
                  ) : plans.length === 0 ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md px-3 py-2 text-yellow-500 text-sm">
                      Nenhum plano ativo disponível
                    </div>
                  ) : (
                    <Select
                      value={selectedPlanId}
                      onValueChange={setSelectedPlanId}
                    >
                      <SelectTrigger className="bg-zinc-950/50 border-white/10 text-white focus:border-green-500/50">
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - {formatPrice(plan.price)} (
                            {plan.duration}{" "}
                            {plan.duration === 1 ? "mês" : "meses"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Data de Início</Label>
                  <Input
                    type="date"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-green-500/50 block"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Método de Pagamento</Label>
                  <Select>
                    <SelectTrigger className="bg-zinc-950/50 border-white/10 text-white focus:border-green-500/50">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="credit">Cartão de Crédito</SelectItem>
                      <SelectItem value="debit">Cartão de Débito</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <CardTitle className="text-lg font-medium">
                    Emergência
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Nome do Contato</Label>
                  <Input
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Nome do responsável"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-red-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">
                    Telefone de Emergência
                  </Label>
                  <Input
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-red-500/50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Health Info */}
            <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Heart className="w-5 h-5 text-purple-500" />
                  </div>
                  <CardTitle className="text-lg font-medium">Saúde</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">
                    Restrições Médicas / Observações
                  </Label>
                  <Textarea
                    name="observation"
                    value={formData.observation}
                    onChange={handleInputChange}
                    placeholder="Descreva alergias, lesões ou condições médicas..."
                    className="bg-zinc-950/50 border-white/10 text-white focus:border-purple-500/50 min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
            <CheckCircle2 className="w-5 h-5" />
            <p>Aluno cadastrado com sucesso! Redirecionando...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Actions */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
            <Link href="/students">
              <Button
                type="button"
                variant="ghost"
                className="text-zinc-400 hover:text-white hover:bg-white/5"
              >
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 rounded-xl shadow-lg shadow-red-600/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Cadastrando..." : "Confirmar Matrícula"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
