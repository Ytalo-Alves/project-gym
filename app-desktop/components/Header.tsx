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
      <header className="flex items-center justify-between px-8 py-6 bg-background/40 backdrop-blur border-b border-border/50">
        {/* Logo removed - moved to Sidebar */}
        <div />

        <div className="flex items-center gap-6">
          {/* ActionMenu removed as per user request */}

          {/* Profile */}
          <div className="flex items-center gap-4 pl-6 border-l border-border/60">
            <div className="flex flex-col items-end">
              <span className="font-medium text-foreground text-sm">
                {userData.name}
              </span>
              <span className="text-xs text-primary capitalize">
                {userData.role}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  key={userData.avatarUrl}
                  className="h-10 w-10 cursor-pointer ring-2 ring-transparent hover:ring-ring/40 transition-all"
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

              <DropdownMenuContent className="rounded-xl shadow-2xl w-56 p-2">
                <DropdownMenuItem
                  onClick={() => setIsProfileModalOpen(true)}
                  className="cursor-pointer rounded-lg py-2.5 px-3 transition-colors"
                >
                  Atualizar informações
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="cursor-pointer rounded-lg py-2.5 px-3 transition-colors"
                >
                  Trocar senha
                </DropdownMenuItem>

                <div className="h-px bg-border my-2" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  variant="destructive"
                  className="cursor-pointer rounded-lg py-2.5 px-3 transition-colors"
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
