import api from "./client";
import {
  Destination,
  SubDestination,
  Accommodation,
  Transport,
} from "../types";

export const destinationApi = {
  getAllDestinations: async (params?: {
    search?: string;
    country?: string;
    budgetLevel?: string;
    page?: number;
    size?: number;
  }): Promise<Destination[]> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.country) queryParams.append("country", params.country);
    if (params?.budgetLevel)
      queryParams.append("budgetLevel", params.budgetLevel);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.size) queryParams.append("size", params.size.toString());

    const response = await api.get(`/destinations?${queryParams.toString()}`);
    return response.data;
  },

  getDestinationById: async (id: number): Promise<Destination> => {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },

  getSubDestinations: async (
    destinationId: number
  ): Promise<SubDestination[]> => {
    const response = await api.get(
      `/destinations/${destinationId}/sub-destinations`
    );
    return response.data;
  },

  getAccommodations: async (
    destinationId: number
  ): Promise<Accommodation[]> => {
    const response = await api.get(
      `/destinations/${destinationId}/accommodations`
    );
    return response.data;
  },

  getTransports: async (destinationId: number): Promise<Transport[]> => {
    const response = await api.get(`/destinations/${destinationId}/transports`);
    return response.data;
  },

  getAvailableCountries: async (): Promise<string[]> => {
    const response = await api.get("/destinations/filters/countries");
    return response.data;
  },

  getAvailableBudgetLevels: async (): Promise<string[]> => {
    const response = await api.get("/destinations/filters/budget-levels");
    return response.data;
  },
};
