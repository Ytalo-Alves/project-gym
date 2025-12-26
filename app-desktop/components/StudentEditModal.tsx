"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { Student, UpdateStudentRequest } from "@/lib/types/student.types";
import { planService } from "@/lib/services/plan.service";
import type { Plan } from "@/lib/types/plan.types";
import { contractService } from "@/lib/services/contract.service";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  CreditCard,
  Camera,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StudentPhotoCaptureModal } from "@/components/StudentPhotoCaptureModal";

interface StudentEditModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StudentEditModal({
  student,
  isOpen,
  onClose,
  onSuccess,
}: StudentEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [initialPlanId, setInitialPlanId] = useState<string>("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);

  const [formData, setFormData] = useState<UpdateStudentRequest>({
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

  // Fetch plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await planService.list();
        setPlans(data.filter((p) => p.status === "ACTIVE"));
      } catch (err) {
        console.error("Erro ao carregar planos:", err);
      }
    };
    fetchPlans();
  }, []);

  // Populate form when student changes
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone,
        cpf: student.cpf,
        dateOfBirth: student.dateOfBirth.split("T")[0], // Convert ISO to YYYY-MM-DD
        gender: student.gender,
        cep: student.cep,
        address: student.address,
        numberAddress: student.numberAddress,
        neighborhood: student.neighborhood,
        city: student.city,
        state: student.state,
        emergencyContact: student.emergencyContact || "",
        emergencyContactPhone: student.emergencyContactPhone || "",
        observation: student.observation || "",
      });

      // Set photo preview if exists
      setPhotoPreview(student.photoUrl || null);
      setPhotoBlob(null);

      // Fetch active contract
      const fetchContract = async () => {
        try {
          const contract = await contractService.getActiveByStudentId(
            student.id
          );
          if (contract) {
            setSelectedPlanId(contract.planId);
            setInitialPlanId(contract.planId);
          } else {
            setSelectedPlanId("");
            setInitialPlanId("");
          }
        } catch (err) {
          console.error("Erro ao buscar contrato:", err);
        }
      };
      fetchContract();

      setError(null);
      setSuccess(false);
    }
  }, [student]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
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
    setFormData((prev) => ({
      ...prev,
      gender: genderMap[value] || "MALE",
    }));
  };

  const handlePhotoCapture = (blob: Blob) => {
    setPhotoBlob(blob);
    setPhotoPreview(URL.createObjectURL(blob));
    setIsCameraOpen(false);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoBlob(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      // Prepare data for API
      const updateData: UpdateStudentRequest = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth!).toISOString(),
        emergencyContact: formData.emergencyContact?.trim() || undefined,
        emergencyContactPhone:
          formData.emergencyContactPhone?.trim() || undefined,
        observation: formData.observation?.trim() || undefined,
      };

      await studentService.update(student.id, updateData);

      // Upload photo if captured
      if (photoBlob) {
        await studentService.uploadPhoto(student.id, photoBlob);
      }

      // Check if plan changed
      if (selectedPlanId && selectedPlanId !== initialPlanId) {
        const selectedPlan = plans.find((p) => p.id === selectedPlanId);
        if (selectedPlan) {
          await contractService.create({
            studentId: student.id,
            planId: selectedPlanId,
            pricePaid: Number(selectedPlan.price),
            durationMonths: selectedPlan.duration,
          });
        }
      }

      setSuccess(true);

      // Close modal and notify parent after a short delay
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err) {
      let errorMessage = "Erro ao atualizar aluno";

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
        } else if (statusCode === "404") {
          errorMessage = "Aluno não encontrado";
        } else {
          // Remove status code from message for display
          errorMessage = err.message.replace(/\[\d+\]\s*/, "") || errorMessage;
        }
      }

      setError(errorMessage);

      // Only log unexpected errors to console to avoid triggering Next.js error overlay
      if (
        !errorMessage.includes("já está sendo usado") &&
        !errorMessage.includes("inválidos") &&
        !errorMessage.includes("não encontrado")
      ) {
        console.warn("Erro ao atualizar aluno:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Editar Aluno</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Atualize as informações do aluno abaixo.
          </DialogDescription>
        </DialogHeader>

        {/* Photo Section */}
        <div className="flex flex-col items-center gap-4 py-6 border-b border-white/10">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={photoPreview || undefined}
                alt={student?.name || "Student"}
              />
              <AvatarFallback className="bg-zinc-800 text-white text-3xl">
                {student?.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            {photoPreview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 transition-colors"
                title="Remover foto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
          <Button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            variant="outline"
            className="bg-transparent border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            <Camera className="w-4 h-4 mr-2" />
            {photoPreview ? "Alterar Foto" : "Capturar Foto"}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
              Dados Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-zinc-400">Nome Completo</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-zinc-950/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-zinc-950/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Telefone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-zinc-950/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">CPF</Label>
                <Input
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="bg-zinc-950/50 border-white/10 text-white"
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
                  className="bg-zinc-950/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
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
                  <SelectTrigger className="bg-zinc-950/50 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="m">Masculino</SelectItem>
                    <SelectItem value="f">Feminino</SelectItem>
                    <SelectItem value="o">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">CEP</Label>
                <Input
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  className="bg-zinc-950/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Número</Label>
                <Input
                  name="numberAddress"
                  value={formData.numberAddress}
                  onChange={handleInputChange}
                  className="bg-zinc-950/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-zinc-400">Logradouro</Label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="bg-zinc-950/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Bairro</Label>
                <Input
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  className="bg-zinc-950/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Cidade</Label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="bg-zinc-950/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-zinc-400">Estado</Label>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="UF"
                  className="bg-zinc-950/50 border-white/10 text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
              Contato de Emergência
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Nome do Contato</Label>
                <Input
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="bg-zinc-950/50 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Telefone de Emergência</Label>
                <Input
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  className="bg-zinc-950/50 border-white/10 text-white"
                />
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
              Observações de Saúde
            </h3>
            <div className="space-y-2">
              <Label className="text-zinc-400">
                Restrições Médicas / Observações
              </Label>
              <Textarea
                name="observation"
                value={formData.observation}
                onChange={handleInputChange}
                className="bg-zinc-950/50 border-white/10 text-white min-h-[100px]"
                placeholder="Descreva alergias, lesões ou condições médicas..."
              />
            </div>
          </div>

          {/* Plan Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Plano e Contrato
            </h3>
            <div className="space-y-2">
              <Label className="text-zinc-400">Plano Atual</Label>
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger className="bg-zinc-950/50 border-white/10 text-white">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - R$ {Number(plan.price).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPlanId !== initialPlanId && (
                <p className="text-sm text-yellow-500 mt-1">
                  Atenção: Alterar o plano criará um novo contrato ativo a
                  partir de hoje.
                </p>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
              <CheckCircle2 className="w-5 h-5" />
              <p>Aluno atualizado com sucesso!</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
              className="text-zinc-400 hover:text-white hover:bg-white/5"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Camera Modal */}
      <StudentPhotoCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCapture={handlePhotoCapture}
      />
    </Dialog>
  );
}
