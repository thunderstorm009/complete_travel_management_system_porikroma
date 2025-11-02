import api from "./client";
import { Expense, ExpenseSettlement } from "../types";

export const expenseApi = {
  getUserExpenses: async (): Promise<Expense[]> => {
    const response = await api.get("/users/me/expenses");
    return response.data;
  },

  getTripExpenses: async (tripId: number): Promise<Expense[]> => {
    const response = await api.get(`/trips/${tripId}/expenses`);
    return response.data;
  },

  getExpenseById: async (expenseId: number): Promise<Expense> => {
    const response = await api.get(`/expenses/${expenseId}`);
    return response.data;
  },

  createExpense: async (data: {
    tripId: number;
    expenseCategory: string;
    description: string;
    amount: number;
    currency: string;
    expenseDate: string;
    receiptUrl?: string;
    isShared: boolean;
    splitMethod: string;
  }): Promise<Expense> => {
    const response = await api.post("/expenses", data);
    return response.data;
  },

  updateExpense: async (
    expenseId: number,
    data: Partial<Expense>
  ): Promise<Expense> => {
    const response = await api.put(`/expenses/${expenseId}`, data);
    return response.data;
  },

  deleteExpense: async (expenseId: number): Promise<void> => {
    await api.delete(`/expenses/${expenseId}`);
  },

  settleExpense: async (
    expenseId: number,
    data: {
      owedToUserId: number;
      amount: number;
    }
  ): Promise<ExpenseSettlement> => {
    const response = await api.post(`/expenses/${expenseId}/settle`, data);
    return response.data;
  },

  getExpenseSettlements: async (
    expenseId: number
  ): Promise<ExpenseSettlement[]> => {
    const response = await api.get(`/expenses/${expenseId}/settlements`);
    return response.data;
  },

  markSettlementPaid: async (settlementId: number): Promise<void> => {
    await api.post(`/expense-settlements/${settlementId}/paid`);
  },

  getTripExpenseSummary: async (tripId: number): Promise<any> => {
    const response = await api.get(`/trips/${tripId}/expenses/summary`);
    return response.data;
  },
};
