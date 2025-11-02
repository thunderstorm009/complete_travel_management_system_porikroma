import api from "./client";
import {
  Destination,
  SubDestination,
  Accommodation,
  Transport,
} from "../types";

export const adminDestinationApi = {
  // SubDestination Management
  createSubDestination: async (
    destinationId: number,
    subDestination: Partial<SubDestination>
  ): Promise<SubDestination> => {
    const response = await api.post(
      `/admin/destinations/${destinationId}/sub-destinations`,
      subDestination
    );
    return response.data;
  },

  updateSubDestination: async (
    destinationId: number,
    subDestinationId: number,
    subDestination: Partial<SubDestination>
  ): Promise<SubDestination> => {
    const response = await api.put(
      `/admin/destinations/${destinationId}/sub-destinations/${subDestinationId}`,
      subDestination
    );
    return response.data;
  },

  deleteSubDestination: async (
    destinationId: number,
    subDestinationId: number
  ): Promise<void> => {
    await api.delete(
      `/admin/destinations/${destinationId}/sub-destinations/${subDestinationId}`
    );
  },

  // Accommodation Management
  createAccommodation: async (
    destinationId: number,
    accommodation: Partial<Accommodation>
  ): Promise<Accommodation> => {
    const response = await api.post(
      `/admin/destinations/${destinationId}/accommodations`,
      accommodation
    );
    return response.data;
  },

  updateAccommodation: async (
    destinationId: number,
    accommodationId: number,
    accommodation: Partial<Accommodation>
  ): Promise<Accommodation> => {
    const response = await api.put(
      `/admin/destinations/${destinationId}/accommodations/${accommodationId}`,
      accommodation
    );
    return response.data;
  },

  deleteAccommodation: async (
    destinationId: number,
    accommodationId: number
  ): Promise<void> => {
    await api.delete(
      `/admin/destinations/${destinationId}/accommodations/${accommodationId}`
    );
  },

  // Transport Management
  createTransport: async (
    destinationId: number,
    transport: Partial<Transport>
  ): Promise<Transport> => {
    const response = await api.post(
      `/admin/destinations/${destinationId}/transports`,
      transport
    );
    return response.data;
  },

  updateTransport: async (
    destinationId: number,
    transportId: number,
    transport: Partial<Transport>
  ): Promise<Transport> => {
    const response = await api.put(
      `/admin/destinations/${destinationId}/transports/${transportId}`,
      transport
    );
    return response.data;
  },

  deleteTransport: async (
    destinationId: number,
    transportId: number
  ): Promise<void> => {
    await api.delete(
      `/admin/destinations/${destinationId}/transports/${transportId}`
    );
  },
};
