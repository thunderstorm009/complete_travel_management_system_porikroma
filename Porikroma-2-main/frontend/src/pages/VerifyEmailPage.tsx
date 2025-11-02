import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  pinVerificationSchema,
  PinVerificationFormData,
} from "../utils/validation";
import { authApi } from "../api/auth";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Mail, Shield, Check } from "lucide-react";

const VerifyEmailPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PinVerificationFormData>({
    resolver: zodResolver(pinVerificationSchema),
  });

  const onSubmit = async (data: PinVerificationFormData) => {
    try {
      setIsLoading(true);
      const response = await authApi.verifyEmail(data.pin);

      if (response.token && response.user) {
        login(response.token, response.user);
        toast.success("Email verified successfully! Welcome to Porikroma!");
        navigate("/dashboard");
      } else {
        toast.success("Email verified successfully!");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit PIN to your email address. Enter it below to
            verify your account.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="pin"
              className="block text-sm font-medium text-gray-700"
            >
              6-Digit PIN
            </label>
            <input
              id="pin"
              type="text"
              maxLength={6}
              {...register("pin")}
              className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-center text-2xl tracking-widest"
              placeholder="000000"
            />
            {errors.pin && (
              <p className="mt-1 text-sm text-red-600">{errors.pin.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "Verify Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
