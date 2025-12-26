import { Button } from "./ui/button";
import Link from "next/link";

import { usePathname } from "next/navigation";

export function ActionMenu() {
  const pathname = usePathname();
  return (
    <div>
      {/* Menus de Ação */}
      <nav className="flex gap-2">
        <Link href="/Register">
          <Button
            variant="ghost"
            disabled={pathname === "/Register"}
            className="text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-red-700 border border-transparent rounded-md px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cadastrar Aluno
          </Button>
        </Link>

        <Button
          variant="ghost"
          className="text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-red-700 border border-transparent rounded-md px-3 py-1.5"
        >
          Atualizar Matricula
        </Button>

        <Button
          variant="ghost"
          className="text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-red-700 border border-transparent rounded-md px-3 py-1.5"
        >
          Planos
        </Button>
      </nav>
    </div>
  );
}
