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
    <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-500" />
          Histórico de Check-ins Hoje
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">
                  Aluno
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">
                  Entrada
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">
                  Saída
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">
                  Duração
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCheckIns.map((checkIn) => (
                <tr
                  key={checkIn.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {checkIn.studentName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <LogIn className="w-4 h-4 text-green-500" />
                      {formatTime(checkIn.checkInTime)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {checkIn.checkOutTime ? (
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <LogOut className="w-4 h-4 text-red-500" />
                        {formatTime(checkIn.checkOutTime)}
                      </div>
                    ) : (
                      <span className="text-sm text-zinc-500">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-zinc-300">
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
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-700/50 text-zinc-400 text-xs font-medium">
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
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <div className="text-sm text-zinc-400">
              Mostrando {startIndex + 1} a {Math.min(endIndex, checkIns.length)}{" "}
              de {checkIns.length} registros
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          ? "bg-red-500 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
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
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
