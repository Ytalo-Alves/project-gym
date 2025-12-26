"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlanFormData {
  name: string;
  duration: number;
  price: number;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
}

interface PlanFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PlanFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  initialData?: Partial<PlanFormData>;
  mode: "create" | "edit";
}

export function PlanFormModal({
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  initialData,
  mode,
}: PlanFormModalProps) {
  const [formData, setFormData] = useState<PlanFormData>({
    name: initialData?.name || "",
    duration: initialData?.duration || 30,
    price: initialData?.price || 0,
    description: initialData?.description || "",
    status: initialData?.status || "ACTIVE",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await onSubmit(formData);
      onOpenChange(false);
      // Reset form
      setFormData({
        name: "",
        duration: 30,
        price: 0,
        description: "",
        status: "ACTIVE",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao salvar plano");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setError("");
    setIsDeleting(true);

    try {
      await onDelete();
      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao excluir plano");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === "create" ? "Novo Plano" : "Editar Plano"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {mode === "create"
              ? "Preencha os dados para criar um novo plano"
              : "Atualize as informações do plano"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome do Plano */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">
              Nome do Plano *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Plano Premium"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* Duração e Preço */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-zinc-300">
                Duração (dias) *
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="30"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-zinc-300">
                Preço (R$) *
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="129.90"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-300">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva os benefícios e características do plano..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-zinc-300">
              Status *
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                setFormData({ ...formData, status: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                <SelectItem value="ACTIVE">Ativo</SelectItem>
                <SelectItem value="INACTIVE">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <DialogFooter className="gap-2">
            {mode === "edit" && onDelete && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading || isDeleting}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 mr-auto"
              >
                Excluir Plano
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || isDeleting}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : mode === "create" ? (
                "Criar Plano"
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[400px] bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400">
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Tem certeza que deseja excluir o plano "{formData.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setError("");
              }}
              disabled={isDeleting}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
