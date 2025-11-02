export interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  dateOfBirth?: string;
  profilePictureUrl?: string;
  bio?: string;
  location?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  travelPreferences?: string;
  dietaryRestrictions?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: "TRAVELLER" | "ADMIN";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  dateOfBirth?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface Destination {
  destinationId: number;
  destinationName: string;
  country: string;
  stateProvince?: string;
  city?: string;
  description?: string;
  featuredImage?: string;
  latitude?: number;
  longitude?: number;
  bestVisitTime?: string;
  weatherInfo?: string;
  localLanguage?: string;
  currency: string;
  timeZone?: string;
  entryRequirements?: string;
  safetyRating: "VERY_SAFE" | "SAFE" | "MODERATE" | "CAUTION" | "AVOID";
  budgetLevel: "BUDGET" | "MID_RANGE" | "LUXURY" | "PREMIUM";
  createdAt: string;
  updatedAt: string;
}

export interface SubDestination {
  subDestinationId: number;
  destinationId: number;
  subDestinationName: string;
  category:
    | "HISTORICAL"
    | "NATURAL"
    | "CULTURAL"
    | "ADVENTURE"
    | "RELIGIOUS"
    | "ENTERTAINMENT"
    | "SHOPPING"
    | "BEACH"
    | "MOUNTAIN";
  description?: string;
  featuredImage?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  entryFee: number;
  openingHours?: string;
  contactPhone?: string;
  contactEmail?: string;
  websiteUrl?: string;
  durationHours?: number;
  difficultyLevel: "EASY" | "MODERATE" | "HARD" | "EXTREME";
  accessibilityInfo?: string;
  bestVisitTime?: string;
  facilities?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  tripId: number;
  tripName: string;
  destinationId: number;
  destinationName?: string;
  creatorUserId: number;
  creatorName?: string;
  tripPhotoUrl?: string;
  tripBudget?: number;
  startDate?: string;
  endDate?: string;
  status: "PLANNING" | "CONFIRMED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  destination?: Destination;
  members?: TripMember[];
  subDestinations?: TripSubDestination[];
  accommodations?: TripAccommodation[];
  transports?: TripTransport[];
  expenses?: TripExpense[];
  totalExpenses?: number;
  memberCount?: number;
  currency?: string;
}

export interface TripSubDestination {
  subDestinationId: number;
  destinationId: number;
  destinationName?: string;
  subDestinationName: string;
  category: string;
  description?: string;
  featuredImage?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  entryFee?: number;
  openingHours?: string;
  contactPhone?: string;
  contactEmail?: string;
  websiteUrl?: string;
  durationHours?: number;
  difficultyLevel?: string;
  accessibilityInfo?: string;
  bestVisitTime?: string;
  facilities?: string;
  createdAt?: string;
  updatedAt?: string;
  estimatedCost?: number;
  status?: string;
  notes?: string;
}

export interface TripAccommodation {
  accommodationId: number;
  destinationId: number;
  destinationName?: string;
  accommodationName: string;
  accommodationType: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  websiteUrl?: string;
  checkInTime?: string;
  checkOutTime?: string;
  pricePerNight?: number;
  currency?: string;
  amenities?: string;
  roomTypes?: string;
  cancellationPolicy?: string;
  photos?: string[];
  createdAt?: string;
  updatedAt?: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfRooms?: number;
  roomType?: string;
  totalCost?: number;
  bookingStatus?: string;
  bookingReference?: string;
  specialRequests?: string;
}

export interface TripTransport {
  transportId: number;
  destinationId: number;
  destinationName?: string;
  transportType: string;
  operatorName?: string;
  routeFrom?: string;
  routeTo?: string;
  departureTime?: string;
  arrivalTime?: string;
  durationMinutes?: number;
  price?: number;
  currency?: string;
  seatTypes?: string;
  amenities?: string;
  bookingInfo?: string;
  contactPhone?: string;
  contactEmail?: string;
  websiteUrl?: string;
  frequency?: string;
  seasonalAvailability?: string;
  createdAt?: string;
  updatedAt?: string;
  journeyType?: string;
  travelDate?: string;
  tripDepartureTime?: string;
  tripArrivalTime?: string;
  numberOfPassengers?: number;
  seatPreference?: string;
  totalCost?: number;
  bookingStatus?: string;
  bookingReference?: string;
}

export interface TripExpense {
  expenseId: number;
  tripId: number;
  tripName?: string;
  paidByUserId: number;
  paidByUserName?: string;
  expenseCategory: string;
  description: string;
  amount: number;
  currency: string;
  expenseDate: string;
  receiptUrl?: string;
  isShared: boolean;
  splitMethod: string;
  createdAt?: string;
  updatedAt?: string;
  settlements?: any[];
  totalOwed?: number;
  totalPaid?: number;
  isSettled?: boolean;
}

export interface TripMember {
  tripMemberId: number;
  tripId: number;
  userId: number;
  memberRole: "CREATOR" | "ADMIN" | "MEMBER";
  invitationStatus: "PENDING" | "ACCEPTED" | "DECLINED" | "REMOVED";
  invitedBy?: number;
  invitedAt: string;
  respondedAt?: string;
  budgetContribution?: number;
  emergencyContact?: string;
  dietaryPreferences?: string;
  specialRequirements?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface TripInvitation {
  invitationId: number;
  tripId: number;
  tripName?: string;
  tripPhotoUrl?: string;
  inviterUserId: number;
  inviterName?: string;
  inviterProfilePicture?: string;
  inviteeUserId: number;
  inviteeName?: string;
  invitationMessage?: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  invitedAt: string;
  respondedAt?: string;
  expiresAt?: string;
  trip?: Trip;
  inviter?: User;
  invitee?: User;
}

export interface Notification {
  notificationId: number;
  userId: number;
  notificationType:
    | "TRIP_INVITATION"
    | "TRIP_UPDATE"
    | "PAYMENT_REMINDER"
    | "GENERAL";
  title: string;
  message: string;
  relatedEntityType?: "TRIP" | "USER" | "EXPENSE";
  relatedEntityId?: number;
  isRead: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

export interface TripMessage {
  messageId: number;
  tripId: number;
  senderUserId: number;
  senderName: string;
  senderProfilePicture?: string;
  messageType: "TEXT" | "IMAGE" | "FILE" | "LOCATION" | "SYSTEM" | "POLL";
  content: string;
  attachmentUrl?: string;
  pollOptions?: any;
  replyToMessageId?: number;
  replyToContent?: string;
  replyToSenderName?: string;
  edited: boolean;
  editedAt?: string;
  createdAt: string;
}

export interface Expense {
  expenseId: number;
  tripId: number;
  paidByUserId: number;
  expenseCategory:
    | "ACCOMMODATION"
    | "TRANSPORT"
    | "FOOD"
    | "ACTIVITIES"
    | "SHOPPING"
    | "EMERGENCY"
    | "OTHER";
  description: string;
  amount: number;
  currency: string;
  expenseDate: string;
  receiptUrl?: string;
  isShared: boolean;
  splitMethod: "EQUAL" | "PERCENTAGE" | "AMOUNT" | "CUSTOM";
  createdAt: string;
  updatedAt: string;
  paidBy?: User;
  settlements?: ExpenseSettlement[];
}

export interface ExpenseSettlement {
  settlementId: number;
  expenseId: number;
  userId: number;
  amountOwed: number;
  amountPaid: number;
  isChecked: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Review {
  reviewId: number;
  userId: number;
  entityType: "DESTINATION" | "SUB_DESTINATION" | "ACCOMMODATION" | "TRANSPORT";
  entityId: number;
  tripId?: number;
  rating: number;
  reviewTitle?: string;
  reviewContent?: string;
  photos?: string[];
  isPublic: boolean;
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Accommodation {
  accommodationId: number;
  destinationId: number;
  accommodationName: string;
  accommodationType:
    | "HOTEL"
    | "RESORT"
    | "GUESTHOUSE"
    | "HOSTEL"
    | "APARTMENT"
    | "VILLA"
    | "COTTAGE";
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  websiteUrl?: string;
  checkInTime: string;
  checkOutTime: string;
  pricePerNight?: number;
  currency: string;
  amenities?: string;
  roomTypes?: string;
  cancellationPolicy?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Transport {
  transportId: number;
  destinationId: number;
  transportType:
    | "BUS"
    | "TRAIN"
    | "FLIGHT"
    | "CAR_RENTAL"
    | "BOAT"
    | "MOTORCYCLE";
  operatorName?: string;
  routeFrom?: string;
  routeTo?: string;
  departureTime?: string;
  arrivalTime?: string;
  durationMinutes?: number;
  price?: number;
  currency: string;
  seatTypes?: string;
  amenities?: string;
  bookingInfo?: string;
  contactPhone?: string;
  contactEmail?: string;
  websiteUrl?: string;
  frequency?: string;
  seasonalAvailability?: string;
  createdAt: string;
  updatedAt: string;
}
