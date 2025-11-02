import api from "./client";
import { User } from "../types";

export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/users/me");
    return response.data;
  },

  updateCurrentUser: async (data: Partial<User>): Promise<User> => {
    const response = await api.put("/users/me", data);
    return response.data;
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const response = await api.get(`/users/search?query=${query}`);
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  uploadAvatar: async (imageUrl: string): Promise<string> => {
    const response = await api.post(
      `/users/me/upload-avatar?imageUrl=${imageUrl}`
    );
    return response.data;
  },
};
