import { z } from "zod";

// Define gender enum to match backend
export const GenderEnum = z.enum([
  "MALE",
  "FEMALE",
  "OTHER",
  "PREFER_NOT_TO_SAY",
]);

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    gender: GenderEnum,
    dateOfBirth: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: GenderEnum,
  dateOfBirth: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: z.string().max(20).optional(),
  travelPreferences: z.string().max(500).optional(),
  dietaryRestrictions: z.string().max(500).optional(),
});

export const tripCreateSchema = z
  .object({
    tripName: z
      .string()
      .min(1, "Trip name is required")
      .max(200, "Trip name must be less than 200 characters"),
    destinationId: z.number().min(1, "Please select a destination"),
    tripBudget: z.number().min(0, "Budget must be positive").optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const pinVerificationSchema = z.object({
  pin: z
    .string()
    .length(6, "PIN must be exactly 6 digits")
    .regex(/^\d{6}$/, "PIN must contain only numbers"),
});

export const resetPasswordSchema = z
  .object({
    pin: z
      .string()
      .length(6, "PIN must be exactly 6 digits")
      .regex(/^\d{6}$/, "PIN must contain only numbers"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const inviteUserSchema = z.object({
  inviteeUserId: z.number().min(1, "Please select a user to invite"),
  invitationMessage: z
    .string()
    .max(500, "Message must be less than 500 characters")
    .optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type TripCreateFormData = z.infer<typeof tripCreateSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type PinVerificationFormData = z.infer<typeof pinVerificationSchema>;
export type InviteUserFormData = z.infer<typeof inviteUserSchema>;
