import { api } from "./api";

export interface UpdateUserProfileData {
  name: string;
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userService = {
  async updateProfile(userId: string, data: UpdateUserProfileData) {
    return await api.put(`/update-user/${userId}`, data);
  },

  async changePassword(data: ChangePasswordData) {
    return await api.patch("/change-password", data);
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return await api.request<{ avatarUrl: string }>("/users/avatar", {
      method: "PATCH",
      body: formData as any, // Cast to any because RequestInit body doesn't strictly support FormData in all TS envs without config
    });
  },
};
