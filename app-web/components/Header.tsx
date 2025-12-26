"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { UserProfileModal } from "./UserProfileModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { useState } from "react";

export function Header() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/SignIn");
  };

  // Use actual user data from context
  const userData = {
    id: user?.id || "",
    name: user?.name || "Usuário",
    email: user?.email || "",
    role: user?.role || "staff",
    avatarUrl: user?.avatarUrl,
  };

  const isAdmin = userData.role.toLowerCase() === "admin";

  return (
    <>
      <header className="flex items-center justify-between px-8 py-6 bg-transparent">
        {/* Logo removed - moved to Sidebar */}
        <div />

        <div className="flex items-center gap-6">
          {/* ActionMenu removed as per user request */}

          {/* Profile */}
          <div className="flex items-center gap-4 pl-6 border-l border-white/10">
            <div className="flex flex-col items-end">
              <span className="font-medium text-zinc-200 text-sm">
                {userData.name}
              </span>
              <span className="text-xs text-red-500 capitalize">
                {userData.role}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  key={userData.avatarUrl}
                  className="h-10 w-10 cursor-pointer ring-2 ring-transparent hover:ring-zinc-700 transition-all"
                >
                  <AvatarImage
                    src={
                      userData.avatarUrl
                        ? `${userData.avatarUrl}?t=${new Date().getTime()}`
                        : undefined
                    }
                    alt="Usuário"
                  />
                  <AvatarFallback>
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl w-56 p-2">
                <DropdownMenuItem
                  onClick={() => setIsProfileModalOpen(true)}
                  className="cursor-pointer text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 rounded-lg py-2.5 px-3 transition-colors"
                >
                  Atualizar informações
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="cursor-pointer text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 rounded-lg py-2.5 px-3 transition-colors"
                >
                  Trocar senha
                </DropdownMenuItem>

                <div className="h-px bg-zinc-800 my-2" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg py-2.5 px-3 transition-colors"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Modals */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={userData}
        isAdmin={isAdmin}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}
