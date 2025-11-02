import React, { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { tripApi } from "../api/trip";
import { notificationApi } from "../api/notification";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  CheckCircle,
  XCircle,
  Users,
  MapPin,
  Calendar,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react";

const TripInvitationResponsePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const invitationId = id ? parseInt(id) : null;
  const notificationId = searchParams.get("notificationId");

  const {
    data: invitation,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invitation", invitationId],
    queryFn: async () => {
      if (!invitationId) throw new Error("Invalid invitation ID");
      const invitations = await tripApi.getUserInvitations();
      const found = invitations.find(
        (inv) => inv.invitationId === invitationId
      );
      if (!found) throw new Error("Invitation not found");
      return found;
    },
    enabled: !!invitationId,
  });

  useEffect(() => {
    if (notificationId) {
      notificationApi.markAsRead(parseInt(notificationId)).catch(console.error);
    }
  }, [notificationId]);

  const respondMutation = useMutation({
    mutationFn: async ({ accept }: { accept: boolean }) => {
      if (!invitationId) throw new Error("Invalid invitation ID");
      await tripApi.respondToInvitation(invitationId, accept);
    },
    onSuccess: (_, { accept }) => {
      if (accept) {
        toast.success("Welcome to the trip! \ud83c\udf89", {
          description: "You've successfully joined this amazing adventure!",
        });
      } else {
        toast.success("Invitation declined", {
          description: "You've politely declined this trip invitation.",
        });
      }
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to respond to invitation");
    },
  });

  if (isLoading) return <LoadingSpinner />;

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 flex items-center justify-center">
        <motion.div
          className="max-w-md mx-auto px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center border border-white/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            >
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invitation Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The invitation you're looking for doesn't exist or may have
              expired.
            </p>
            <motion.button
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200"
            >
              Go to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <motion.div
        className="relative max-w-2xl mx-auto px-4 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-10 text-white relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
              >
                <Heart className="w-16 h-16 mx-auto mb-4 text-pink-300" />
              </motion.div>
              <motion.h1
                className="text-4xl font-bold mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Trip Invitation
              </motion.h1>
              <motion.p
                className="text-xl text-blue-100 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                You've been invited to join an amazing adventure!
              </motion.p>
            </div>
          </div>

          <motion.div
            className="p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center mb-8">
              <motion.h2
                className="text-3xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {invitation.tripName}
              </motion.h2>
              <div className="text-xl text-gray-600 mb-2">
                Invited by{" "}
                <span className="font-bold text-blue-600">
                  {invitation.inviterName || "Trip Organizer"}
                </span>
              </div>
            </div>

            <div className="mb-8 space-y-4">
              <motion.div
                className="flex items-center justify-center text-gray-600 p-3 bg-blue-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                <span className="font-medium">
                  Trip Details Available After Joining
                </span>
              </motion.div>
              <motion.div
                className="flex items-center justify-center text-gray-600 p-3 bg-indigo-50 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Clock className="w-5 h-5 mr-3 text-indigo-600" />
                <span className="font-medium">
                  Invited on{" "}
                  {new Date(invitation.invitedAt).toLocaleDateString()}
                </span>
              </motion.div>
            </div>

            {invitation.invitationMessage && (
              <motion.div
                className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Message:
                </h3>
                <p className="text-gray-700 text-lg italic">
                  "{invitation.invitationMessage}"
                </p>
              </motion.div>
            )}

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <motion.button
                onClick={() => respondMutation.mutate({ accept: true })}
                disabled={respondMutation.isPending}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-green-300 disabled:to-emerald-400 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-200"
              >
                <CheckCircle className="w-6 h-6" />
                {respondMutation.isPending ? (
                  <LoadingSpinner size="sm" variant="pulse" />
                ) : (
                  "Accept Invitation ✨"
                )}
              </motion.button>
              <motion.button
                onClick={() => respondMutation.mutate({ accept: false })}
                disabled={respondMutation.isPending}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-red-300 disabled:to-pink-400 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-200"
              >
                <XCircle className="w-6 h-6" />
                {respondMutation.isPending ? (
                  <LoadingSpinner size="sm" variant="pulse" />
                ) : (
                  "Decline Politely"
                )}
              </motion.button>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-600 hover:text-blue-600 underline font-medium transition-colors duration-200"
                disabled={respondMutation.isPending}
              >
                ← Back to Dashboard
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TripInvitationResponsePage;
