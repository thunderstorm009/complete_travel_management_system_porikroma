import api from "./client";
import { User, Destination, Trip } from "../types";

export const adminApi = {
  // Analytics
  getAnalytics: async () => {
    const response = await api.get("/admin/analytics");
    return response.data;
  },

  // User Management
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  promoteUser: async (userId: number): Promise<void> => {
    await api.patch(`/admin/users/${userId}/promote`);
  },

  demoteUser: async (userId: number): Promise<void> => {
    await api.patch(`/admin/users/${userId}/demote`);
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  getUserStats: async (userId: number) => {
    const response = await api.get(`/admin/users/${userId}/stats`);
    return response.data;
  },

  // Destination Management
  getAllDestinations: async (): Promise<Destination[]> => {
    const response = await api.get("/admin/destinations");
    return response.data;
  },

  createDestination: async (
    destination: Partial<Destination>
  ): Promise<Destination> => {
    const response = await api.post("/admin/destinations", destination);
    return response.data;
  },

  updateDestination: async (
    id: number,
    destination: Partial<Destination>
  ): Promise<Destination> => {
    const response = await api.put(`/admin/destinations/${id}`, destination);
    return response.data;
  },

  deleteDestination: async (id: number): Promise<void> => {
    await api.delete(`/admin/destinations/${id}`);
  },

  // Trip Management
  getAllTrips: async (): Promise<Trip[]> => {
    const response = await api.get("/admin/trips");
    return response.data;
  },

  getTripStats: async () => {
    const response = await api.get("/admin/trips/stats");
    return response.data;
  },

  // Content Management
  getContentStats: async () => {
    const response = await api.get("/admin/content/stats");
    return response.data;
  },

  // System Health
  getSystemHealth: async () => {
    const response = await api.get("/admin/system/health");
    return response.data;
  },
};
