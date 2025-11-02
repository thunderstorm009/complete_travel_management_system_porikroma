import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BuildingOffice2Icon,
  TruckIcon,
  PhotoIcon,
  ClockIcon,
  BanknotesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Building,
  Truck,
  Camera,
  Clock,
  Banknote,
  Star,
  Send,
} from "lucide-react";
import { tripApi } from "../api/trip";
import { userApi } from "../api/user";
import LoadingSpinner from "../components/LoadingSpinner";

const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteQuery, setInviteQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const tripId = parseInt(id || "0");

  const {
    data: trip,
    isLoading: tripLoading,
    error: tripError,
  } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => tripApi.getTripById(tripId),
    enabled: !!tripId,
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["trip-members", tripId],
    queryFn: () => tripApi.getTripMembers(tripId),
    enabled: !!tripId,
  });

  const { data: searchResults } = useQuery({
    queryKey: ["user-search", inviteQuery],
    queryFn: () => userApi.searchUsers(inviteQuery),
    enabled: inviteQuery.length > 2,
  });

  const inviteMutation = useMutation({
    mutationFn: (data: { inviteeUserId: number; invitationMessage?: string }) =>
      tripApi.inviteToTrip(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-members", tripId] });
      setShowInviteModal(false);
      setSelectedUser(null);
      setInviteQuery("");
      toast.success("Invitation sent successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send invitation");
    },
  });

  const deleteTripMutation = useMutation({
    mutationFn: () => tripApi.deleteTrip(tripId),
    onSuccess: () => {
      toast.success("Trip deleted successfully!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete trip");
    },
  });

  const handleInviteUser = () => {
    if (selectedUser) {
      inviteMutation.mutate({
        inviteeUserId: selectedUser.userId,
        invitationMessage: `You've been invited to join "${trip?.tripName}"!`,
      });
    }
  };

  const handleDeleteTrip = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this trip? This action cannot be undone."
      )
    ) {
      deleteTripMutation.mutate();
    }
  };

  if (tripLoading || membersLoading) {
    return <LoadingSpinner />;
  }

  if (tripError || !trip) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center"
      >
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-white/20"
          >
            <div className="mb-6">
              <div className="mx-auto h-24 w-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Trip Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The trip you're looking for doesn't exist or you don't have access
              to it.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Back to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 0, 180],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trip Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl mb-8 border border-white/20 overflow-hidden"
        >
          <div className="relative">
            {trip.tripPhotoUrl && (
              <img
                src={trip.tripPhotoUrl}
                alt={trip.tripName}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
            <div className="absolute top-4 right-4 space-x-2">
              <button
                onClick={() => navigate(`/trips/${tripId}/edit`)}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md"
              >
                <Edit className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={handleDeleteTrip}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md"
              >
                <Trash2 className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {trip.tripName}
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>
                    {trip.destination?.destinationName || "Unknown Destination"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              {trip.startDate && trip.endDate && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(trip.startDate).toLocaleDateString()} -{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {trip.tripBudget && (
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>Budget: ${trip.tripBudget}</span>
                </div>
              )}
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{members?.length || 0} members</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/trips/${tripId}/chat`)}
                  className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 text-center transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Chat
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/trips/${tripId}/expenses`)}
                  className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl hover:from-green-100 hover:to-green-200 text-center transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Expenses
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInviteModal(true)}
                  className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 text-center transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">
                    Invite
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl hover:from-red-100 hover:to-red-200 text-center transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <span className="text-sm font-medium text-red-700">
                    Itinerary
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Trip Info */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Trip Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Status:
                  </span>
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {trip.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Created:
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Trip Data Sections */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sub-Destinations
              </h2>
              {trip.subDestinations && trip.subDestinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trip.subDestinations.map((sd: any) => (
                    <div
                      key={sd.subDestinationId}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center mb-2">
                        <PhotoIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-bold">
                          {sd.subDestinationName}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {sd.category}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {sd.description}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Entry Fee: {sd.entryFee ?? 0} {trip.currency || "BDT"}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Duration: {sd.durationHours ?? "-"} hrs
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Status: {sd.status}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Cost: {sd.estimatedCost ?? sd.entryFee ?? 0}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No sub-destinations added.</div>
              )}
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Accommodations
              </h2>
              {trip.accommodations && trip.accommodations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trip.accommodations.map((a: any) => (
                    <div
                      key={a.accommodationId}
                      className="border rounded-lg p-4"
                    >
                      <div className="font-bold mb-1">
                        {a.accommodationName}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Type: {a.accommodationType}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Price/Night: {a.pricePerNight} {a.currency}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Rooms: {a.numberOfRooms}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Total Cost: {a.totalCost}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Check-in: {a.checkInTime}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Check-out: {a.checkOutTime}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Booking Status: {a.bookingStatus}
                      </div>
                      {a.photos && a.photos.length > 0 && (
                        <img
                          src={a.photos[0]}
                          alt={a.accommodationName}
                          className="mt-2 h-24 w-full object-cover rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No accommodations added.</div>
              )}
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Transports
              </h2>
              {trip.transports && trip.transports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trip.transports.map((t: any) => (
                    <div key={t.transportId} className="border rounded-lg p-4">
                      <div className="font-bold mb-1">
                        {t.transportType} - {t.operatorName}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Route: {t.routeFrom} → {t.routeTo}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Price: {t.price} {t.currency}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Passengers: {t.numberOfPassengers}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Total Cost: {t.totalCost}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Booking Status: {t.bookingStatus}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No transports added.</div>
              )}
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Expenses
              </h2>
              <div className="text-lg font-bold mb-2">
                Total Expenses: {trip.totalExpenses} {trip.currency || "BDT"}
              </div>
              {trip.expenses && trip.expenses.length > 0 ? (
                <div className="divide-y">
                  {trip.expenses.map((e: any) => (
                    <div key={e.expenseId} className="py-2">
                      <div className="flex justify-between">
                        <span>{e.expenseCategory}</span>
                        <span>
                          {e.amount} {e.currency}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {e.description}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No expenses added.</div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trip Members */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Trip Members
                </h3>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="p-1 text-blue-600 hover:text-blue-700"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                {members?.map((member) => (
                  <div key={member.userId} className="flex items-center">
                    <img
                      src={
                        member.user?.profilePictureUrl || "/default-avatar.png"
                      }
                      alt={member.user?.username || "User"}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {member.user?.firstName} {member.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.memberRole}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        member.invitationStatus === "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : member.invitationStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {member.invitationStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Invite User to Trip
              </h3>

              <div className="mb-4">
                <input
                  type="text"
                  value={inviteQuery}
                  onChange={(e) => setInviteQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {searchResults && searchResults.length > 0 && (
                <div className="mb-4 max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                  {searchResults.map((user) => (
                    <button
                      key={user.userId}
                      onClick={() => setSelectedUser(user)}
                      className={`w-full p-3 text-left hover:bg-gray-50 flex items-center ${
                        selectedUser?.userId === user.userId
                          ? "bg-blue-50 border-blue-200"
                          : ""
                      }`}
                    >
                      <img
                        src={user.profilePictureUrl || "/default-avatar.png"}
                        alt={user.username}
                        className="h-8 w-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setSelectedUser(null);
                    setInviteQuery("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteUser}
                  disabled={!selectedUser || inviteMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {inviteMutation.isPending ? "Inviting..." : "Send Invite"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TripDetailPage;
