"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PlanFormModal } from "@/components/PlanFormModal";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { planService } from "@/lib/services/plan.service";
import type { Plan } from "@/lib/types/plan.types";
import { Check, Loader2, Plus, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Carregar planos ao montar o componente
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await planService.list();
      setPlans(data);
    } catch (err) {
      console.error("Erro ao carregar planos:", err);
      // Em caso de erro, consideramos que não há planos cadastrados
      setPlans([]);
      setError("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlan = async (data: any) => {
    await planService.create(data);
    await loadPlans(); // Recarregar lista
  };

  const handleEditPlan = async (data: any) => {
    if (!editingPlan) return;
    await planService.update(editingPlan.id, data);
    setEditingPlan(null);
    await loadPlans(); // Recarregar lista
  };

  const handleDeletePlan = async () => {
    if (!editingPlan) return;
    await planService.delete(editingPlan.id);
    setEditingPlan(null);
    await loadPlans(); // Recarregar lista
  };

  const getPlanColor = (index: number) => {
    const colors = ["blue", "red", "purple", "green", "yellow", "pink"];
    return colors[index % colors.length];
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Gerenciar Planos
              </h2>
              <p className="text-zinc-400 mt-1">
                Configure os planos e preços disponíveis na academia
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Plano
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-lg">
                Nenhum plano cadastrado ainda.
              </p>
              <p className="text-zinc-500 text-sm mt-2">
                Clique em "Novo Plano" para criar o primeiro plano.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => {
                const color = getPlanColor(index);
                const isPopular = index === 1; // Segundo plano é popular

                return (
                  <Card
                    key={plan.id}
                    className={`bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white relative overflow-hidden group hover:border-${color}-500/50 transition-all duration-300`}
                  >
                    {/* Indicador de Status */}
                    <div
                      className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
                        plan.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                      } shadow-lg`}
                      title={plan.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    />
                    {isPopular && (
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        MAIS POPULAR
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        {plan.name}
                      </CardTitle>
                      <p className="text-zinc-400 text-sm">
                        {plan.description || "Sem descrição"}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">
                          R$ {plan.price.toFixed(2).replace(".", ",")}
                        </span>
                        <span className="text-zinc-500">
                          /{plan.duration} Mês
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div
                            className={`p-1 rounded-full bg-${color}-500/10 text-${color}-500`}
                          >
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-zinc-300">
                            Duração: {plan.duration} Mês
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => setEditingPlan(plan)}
                        variant="outline"
                        className="w-full border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20"
                      >
                        <Settings2 className="w-4 h-4 mr-2" />
                        Editar Plano
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal de Criação */}
        <PlanFormModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreatePlan}
          mode="create"
        />

        {/* Modal de Edição */}
        {editingPlan && (
          <PlanFormModal
            open={!!editingPlan}
            onOpenChange={(open) => !open && setEditingPlan(null)}
            onSubmit={handleEditPlan}
            onDelete={handleDeletePlan}
            initialData={{
              name: editingPlan.name,
              duration: editingPlan.duration,
              price: editingPlan.price,
              description: editingPlan.description,
              status: editingPlan.status,
            }}
            mode="edit"
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
