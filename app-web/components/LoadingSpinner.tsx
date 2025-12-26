import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 rounded-full animate-pulse" />
          <Loader2 className="w-12 h-12 text-red-500 animate-spin relative z-10" />
        </div>
        <p className="text-zinc-400 text-sm font-medium animate-pulse">
          Carregando...
        </p>
      </div>
    </div>
  );
}
