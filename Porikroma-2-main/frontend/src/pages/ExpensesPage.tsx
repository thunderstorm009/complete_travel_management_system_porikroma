import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import ImageUploader from "../components/ImageUploader";
import { toast } from "sonner";
import { PlusIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  Wallet,
  Receipt,
  DollarSign,
  Users,
  Calendar,
  CreditCard,
} from "lucide-react";
import { expenseApi } from "../api/expense";

const expenseSchema = z.object({
  tripId: z.number().min(1, "Please select a trip"),
  expenseCategory: z.enum([
    "ACCOMMODATION",
    "TRANSPORT",
    "FOOD",
    "ACTIVITIES",
    "SHOPPING",
    "EMERGENCY",
    "OTHER",
  ]),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().default("USD"),
  expenseDate: z.string(),
  isShared: z.boolean().default(true),
  splitMethod: z
    .enum(["EQUAL", "PERCENTAGE", "AMOUNT", "CUSTOM"])
    .default("EQUAL"),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const ExpensesPage: React.FC = () => {
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string>("");

  const queryClient = useQueryClient();

  const { data: userTrips, isLoading: tripsLoading } = useQuery({
    queryKey: ["user-trips"],
    queryFn: () => import("../api/trip").then((m) => m.tripApi.getUserTrips()),
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ["trip-expenses", selectedTripId],
    queryFn: () =>
      selectedTripId
        ? expenseApi.getTripExpenses(selectedTripId)
        : Promise.resolve([]),
    enabled: !!selectedTripId,
  });

  const { data: userExpenses = [], isLoading: userExpensesLoading } = useQuery({
    queryKey: ["user-expenses"],
    queryFn: expenseApi.getUserExpenses,
  });

  const addExpenseMutation = useMutation({
    mutationFn: (data: any) => expenseApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["user-expenses"] });
      setShowAddExpense(false);
      reset();
      setReceiptUrl("");
      toast.success("Expense added successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add expense");
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: expenseApi.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["user-expenses"] });
      toast.success("Expense deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete expense");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      tripId: selectedTripId || undefined,
      currency: "USD",
      isShared: true,
      splitMethod: "EQUAL",
      expenseDate: new Date().toISOString().split("T")[0],
    },
  });

  React.useEffect(() => {
    if (selectedTripId) {
      setValue("tripId", selectedTripId);
    }
  }, [selectedTripId, setValue]);

  const onSubmit = (data: ExpenseFormData) => {
    addExpenseMutation.mutate({
      ...data,
      receiptUrl: receiptUrl || undefined,
    });
  };

  const handleReceiptUpload = (url: string) => {
    setReceiptUrl(url);
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      ACCOMMODATION: "bg-blue-100 text-blue-800",
      TRANSPORT: "bg-green-100 text-green-800",
      FOOD: "bg-yellow-100 text-yellow-800",
      ACTIVITIES: "bg-purple-100 text-purple-800",
      SHOPPING: "bg-pink-100 text-pink-800",
      EMERGENCY: "bg-red-100 text-red-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.OTHER;
  };

  if (tripsLoading || userExpensesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
              <Wallet className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent mb-4">
            Expense Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track and manage your trip expenses with smart splitting and
            categorization
          </p>
        </motion.div>

        {/* Trip Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Trip
          </label>
          <select
            value={selectedTripId || ""}
            onChange={(e) =>
              setSelectedTripId(e.target.value ? Number(e.target.value) : null)
            }
            className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Expenses</option>
            {userTrips?.map((trip) => (
              <option key={trip.tripId} value={trip.tripId}>
                {trip.tripName}
              </option>
            ))}
          </select>
        </div>

        {/* Add Expense Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddExpense(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Expense
          </button>
        </div>

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Add New Expense
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trip
                    </label>
                    <select
                      {...register("tripId", { valueAsNumber: true })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Trip</option>
                      {userTrips?.map((trip) => (
                        <option key={trip.tripId} value={trip.tripId}>
                          {trip.tripName}
                        </option>
                      ))}
                    </select>
                    {errors.tripId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.tripId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      {...register("expenseCategory")}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="ACCOMMODATION">Accommodation</option>
                      <option value="TRANSPORT">Transport</option>
                      <option value="FOOD">Food</option>
                      <option value="ACTIVITIES">Activities</option>
                      <option value="SHOPPING">Shopping</option>
                      <option value="EMERGENCY">Emergency</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.expenseCategory && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.expenseCategory.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      {...register("description")}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Dinner at restaurant"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("amount", { valueAsNumber: true })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                      {errors.amount && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.amount.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Currency
                      </label>
                      <select
                        {...register("currency")}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="BDT">BDT</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      {...register("expenseDate")}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Receipt (Optional)
                    </label>
                    <ImageUploader
                      onImageUpload={handleReceiptUpload}
                      currentImage={receiptUrl}
                      placeholder="Upload Receipt"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("isShared")}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Split with trip members
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddExpense(false);
                        reset();
                        setReceiptUrl("");
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addExpenseMutation.isPending}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                    >
                      {addExpenseMutation.isPending ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        "Add Expense"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {selectedTripId ? "Trip Expenses" : "All Expenses"}
            </h2>
          </div>

          {expensesLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {(selectedTripId ? expenses : userExpenses)?.map(
                (expense: any) => (
                  <div key={expense.expenseId} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                              expense.expenseCategory
                            )}`}
                          >
                            {expense.expenseCategory}
                          </span>
                          <h3 className="text-lg font-medium text-gray-900">
                            {expense.description}
                          </h3>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            Trip: {expense.tripName || "Unknown Trip"}
                          </span>
                          <span>
                            Paid by: {expense.paidBy?.firstName}{" "}
                            {expense.paidBy?.lastName}
                          </span>
                          <span>{expense.expenseDate}</span>
                          {expense.isShared && (
                            <span className="text-blue-600">Shared</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(expense.amount, expense.currency)}
                        </span>
                        {expense.receiptUrl && (
                          <button
                            onClick={() =>
                              window.open(expense.receiptUrl, "_blank")
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            deleteExpenseMutation.mutate(expense.expenseId)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {expense.settlements && expense.settlements.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Split Details:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {expense.settlements.map((settlement: any) => (
                            <div
                              key={settlement.settlementId}
                              className="flex justify-between items-center bg-gray-50 rounded p-2 text-sm"
                            >
                              <span>
                                {settlement.user?.firstName}{" "}
                                {settlement.user?.lastName}
                              </span>
                              <span className="font-medium">
                                {formatCurrency(
                                  settlement.amountOwed,
                                  expense.currency
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}

              {(!selectedTripId ? userExpenses : expenses)?.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No expenses found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExpensesPage;
