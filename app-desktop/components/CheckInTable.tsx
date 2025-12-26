"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckInRecord, formatTime, formatDuration } from "@/lib/faker-data";
import { Clock, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";

interface CheckInTableProps {
  checkIns: CheckInRecord[];
}

export function CheckInTable({ checkIns }: CheckInTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(checkIns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCheckIns = checkIns.slice(startIndex, endIndex);

  return (
    <Card className="bg-card border-border/60">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Histórico de Check-ins Hoje
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Aluno
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Entrada
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Saída
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Duração
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCheckIns.map((checkIn) => (
                <tr
                  key={checkIn.id}
                  className="border-b border-border/60 hover:bg-accent/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {checkIn.studentName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/90">
                      <LogIn className="w-4 h-4 text-green-500" />
                      {formatTime(checkIn.checkInTime)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {checkIn.checkOutTime ? (
                      <div className="flex items-center gap-2 text-sm text-foreground/90">
                        <LogOut className="w-4 h-4 text-muted-foreground" />
                        {formatTime(checkIn.checkOutTime)}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground/90">
                      {formatDuration(checkIn.duration)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {checkIn.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/30 text-muted-foreground text-xs font-medium border border-border/60">
                        Concluído
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(endIndex, checkIns.length)}{" "}
              de {checkIns.length} registros
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-accent/40 text-foreground/90 text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-border/60"
              >
                Anterior
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent/40 text-foreground/90 hover:bg-accent border border-border/60"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-accent/40 text-foreground/90 text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-border/60"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
