"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { User, Mail, Shield, Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService } from "@/lib/services/user.service";
import { AvatarCropModal } from "./AvatarCropModal";
import { useAuth } from "@/lib/contexts/AuthContext";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  isAdmin: boolean;
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
  isAdmin,
}: UserProfileModalProps) {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file as data URL for cropper
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploading(true);
    setError(null);

    try {
      // Convert blob to File for upload
      const croppedFile = new File([croppedBlob], "avatar.jpg", {
        type: "image/jpeg",
      });

      const response = await userService.uploadAvatar(croppedFile);

      console.log("Avatar upload response:", response);

      // Update user context immediately with new avatar URL
      updateUser({ avatarUrl: response.avatarUrl });

      console.log("Updated user context with avatarUrl:", response.avatarUrl);

      setSuccess(true);
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      setError("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await userService.updateProfile(user.id, formData);

      updateUser({ name: formData.name, email: formData.email });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao atualizar informações");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {isAdmin ? "Atualizar Informações" : "Minhas Informações"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center mt-4 mb-6">
          <div className="relative group">
            <Avatar
              key={user.avatarUrl}
              className="h-24 w-24 ring-4 ring-border/60"
            >
              <AvatarImage
                src={
                  user.avatarUrl
                    ? `${user.avatarUrl}?t=${new Date().getTime()}`
                    : undefined
                }
              />
              <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Clique na câmera para alterar a foto
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (existing fields) */}

          {/* Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-zinc-300 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Nome
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={!isAdmin}
              className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-zinc-300 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={!isAdmin}
              className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Role Field (Read-only) */}
          <div className="space-y-2">
            <Label
              htmlFor="role"
              className="text-sm font-medium text-zinc-300 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Função
            </Label>
            <Input
              id="role"
              value={user.role}
              disabled
              className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 opacity-50 cursor-not-allowed capitalize"
            />
          </div>

          {!isAdmin && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-sm text-yellow-500">
                Apenas administradores podem editar informações de perfil.
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-sm text-green-500">
                ✓ Informações atualizadas com sucesso!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              {isAdmin ? "Cancelar" : "Fechar"}
            </Button>
            {isAdmin && (
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>

      {/* Avatar Crop Modal */}
      {selectedImage && (
        <AvatarCropModal
          isOpen={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </Dialog>
  );
}
