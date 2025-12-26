import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileText, Download, Loader2 } from "lucide-react";

import { generateFinanceReport } from "@/lib/utils/generateFinanceReport";

interface FinanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FinanceReportModal({
  isOpen,
  onClose,
}: FinanceReportModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState("revenue");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState("pdf");

  const handleGenerate = async () => {
    setIsLoading(true);

    if (format === "pdf") {
      generateFinanceReport({
        type: reportType,
        startDate,
        endDate,
      });
    } else {
      // Simulate API call for other formats
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Generating report:", {
        reportType,
        startDate,
        endDate,
        format,
      });
    }

    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-5 h-5 text-emerald-500" />
            Gerar Relatório Financeiro
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-zinc-400">
              Tipo de Relatório
            </Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger
                id="type"
                className="bg-zinc-900 border-zinc-800 focus:ring-emerald-500/20"
              >
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="revenue">Faturamento Geral</SelectItem>
                <SelectItem value="defaults">Inadimplência</SelectItem>
                <SelectItem value="expenses">Despesas</SelectItem>
                <SelectItem value="balance">Balanço Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-zinc-400">
                Data Inicial
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-zinc-900 border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-zinc-400">
                Data Final
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-zinc-900 border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format" className="text-zinc-400">
              Formato
            </Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger
                id="format"
                className="bg-zinc-900 border-zinc-800 focus:ring-emerald-500/20"
              >
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="pdf">PDF (Documento)</SelectItem>
                <SelectItem value="csv">CSV (Planilha)</SelectItem>
                <SelectItem value="excel">Excel (XLSX)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Gerar Relatório
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
