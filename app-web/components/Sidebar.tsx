"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  Settings,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/Home",
    icon: LayoutDashboard,
  },
  {
    title: "Alunos",
    href: "/students",
    icon: Users,
    matches: ["/Register"],
  },
  {
    title: "Planos",
    href: "/plans",
    icon: ClipboardList,
  },
  {
    title: "Financeiro",
    href: "/finance",
    icon: CreditCard,
  },
  {
    title: "Check-ins",
    href: "/checkins",
    icon: CalendarCheck,
  },
  {
    title: "Treinos",
    href: "/workouts",
    icon: Dumbbell,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/SignIn");
  };

  return (
    <aside className="w-72 bg-zinc-950/50 backdrop-blur-xl border-r border-white/5 h-screen flex flex-col transition-all duration-300">
      <div className="p-8 flex items-center justify-start">
        <img
          src="/logo.png"
          alt="Olimpo Fitness"
          className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
          Menu Principal
        </p>
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname?.startsWith(item.href + "/") ||
            (item.matches && item.matches.includes(pathname || ""));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-red-600/10 text-red-500"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-red-500"
                    : "text-zinc-500 group-hover:text-zinc-300"
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
        >
          <Settings className="w-5 h-5 text-zinc-500" />
          Configurações
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-1"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
