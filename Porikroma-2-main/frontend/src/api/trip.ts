import api from "./client";
import { Trip, TripMember, TripInvitation } from "../types";

export const tripApi = {
  getUserTrips: async (): Promise<Trip[]> => {
    const response = await api.get("/users/me/trips");
    return response.data;
  },

  getTripById: async (id: number): Promise<Trip> => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  createTrip: async (data: {
    tripName: string;
    destinationId: number;
    tripPhotoUrl?: string;
    tripBudget?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<Trip> => {
    const response = await api.post("/trips", data);
    return response.data;
  },

  updateTrip: async (id: number, data: Partial<Trip>): Promise<Trip> => {
    const response = await api.put(`/trips/${id}`, data);
    return response.data;
  },

  deleteTrip: async (id: number): Promise<void> => {
    await api.delete(`/trips/${id}`);
  },

  getTripMembers: async (tripId: number): Promise<TripMember[]> => {
    const response = await api.get(`/trips/${tripId}/members`);
    return response.data;
  },

  inviteToTrip: async (
    tripId: number,
    data: {
      inviteeUserId: number;
      invitationMessage?: string;
    }
  ): Promise<TripInvitation> => {
    const response = await api.post(`/trips/${tripId}/invite`, data);
    return response.data;
  },

  getUserInvitations: async (): Promise<TripInvitation[]> => {
    const response = await api.get("/user/invitations");
    return response.data;
  },

  respondToInvitation: async (
    invitationId: number,
    accept: boolean
  ): Promise<void> => {
    const endpoint = accept ? "accept" : "decline";
    await api.post(`/invitations/${invitationId}/${endpoint}`);
  },

  addSubDestinations: async (
    tripId: number,
    subDestinationIds: number[]
  ): Promise<void> => {
    await api.post(`/trips/${tripId}/sub-destinations`, { subDestinationIds });
  },

  addAccommodations: async (
    tripId: number,
    accommodationData: any[]
  ): Promise<void> => {
    await api.post(`/trips/${tripId}/accommodations`, accommodationData);
  },

  addTransport: async (tripId: number, transportData: any[]): Promise<void> => {
    await api.post(`/trips/${tripId}/transports`, transportData);
  },
};
