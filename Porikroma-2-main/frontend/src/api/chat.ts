import api from "./client";
import { TripMessage } from "../types";

export const chatApi = {
  getTripMessages: async (tripId: number): Promise<TripMessage[]> => {
    const response = await api.get(`/trips/${tripId}/messages`);
    return response.data;
  },

  sendMessage: async (data: {
    tripId: number;
    messageType: string;
    content: string;
    attachmentUrl?: string;
    replyToMessageId?: number;
  }): Promise<TripMessage> => {
    const response = await api.post(`/trips/${data.tripId}/messages`, data);
    return response.data;
  },

  updateMessage: async (
    messageId: number,
    content: string
  ): Promise<TripMessage> => {
    const response = await api.put(`/messages/${messageId}`, { content });
    return response.data;
  },

  deleteMessage: async (messageId: number): Promise<void> => {
    await api.delete(`/messages/${messageId}`);
  },

  markMessagesAsRead: async (tripId: number): Promise<void> => {
    await api.post(`/trips/${tripId}/messages/mark-read`);
  },
};
