import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  MapPin,
  Globe,
  DollarSign,
  Shield,
  Clock,
  Home,
  Bus,
  Star,
  ArrowLeft,
  Building,
  Bed,
  Users,
  Calendar,
} from "lucide-react";
import { destinationApi } from "../api/destination";
import LoadingSpinner from "../components/LoadingSpinner";

const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const destinationId = parseInt(id || "0");

  const {
    data: destination,
    isLoading: destinationLoading,
    error: destinationError,
  } = useQuery({
    queryKey: ["destination", destinationId],
    queryFn: () => destinationApi.getDestinationById(destinationId),
    enabled: !!destinationId,
  });

  const { data: subDestinations = [], isLoading: subDestinationsLoading } =
    useQuery({
      queryKey: ["subDestinations", destinationId],
      queryFn: () => destinationApi.getSubDestinations(destinationId),
      enabled: !!destinationId,
    });

  const { data: accommodations = [], isLoading: accommodationsLoading } =
    useQuery({
      queryKey: ["accommodations", destinationId],
      queryFn: () => destinationApi.getAccommodations(destinationId),
      enabled: !!destinationId,
    });

  const { data: transports = [], isLoading: transportsLoading } = useQuery({
    queryKey: ["transports", destinationId],
    queryFn: () => destinationApi.getTransports(destinationId),
    enabled: !!destinationId,
  });

  const isLoading =
    destinationLoading ||
    subDestinationsLoading ||
    accommodationsLoading ||
    transportsLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (destinationError || !destination) {
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
                <MapPin className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Destination Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The destination you're looking for doesn't exist.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/destinations")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Back to Destinations
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate("/destinations")}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Destinations</span>
        </motion.button>

        {/* Destination Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl mb-8 border border-white/20 overflow-hidden"
        >
          {destination.featuredImage && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={
                  destination.featuredImage ||
                  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80"
                }
                alt={destination.destinationName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">
                  {destination.destinationName}
                </h1>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span>{destination.country}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {destination.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200"
                >
                  <DollarSign className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">Budget Level</p>
                  <p className="text-lg font-bold text-blue-700">
                    {destination.budgetLevel}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200"
                >
                  <Shield className="h-6 w-6 text-green-600 mb-2" />
                  <p className="text-xs text-gray-600">Safety Rating</p>
                  <p className="text-lg font-bold text-green-700">
                    {destination.safetyRating || "N/A"}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200"
                >
                  <Clock className="h-6 w-6 text-purple-600 mb-2" />
                  <p className="text-xs text-gray-600">Best Time</p>
                  <p className="text-lg font-bold text-purple-700">
                    {destination.bestVisitTime || "Year-round"}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200"
                >
                  <Globe className="h-6 w-6 text-orange-600 mb-2" />
                  <p className="text-xs text-gray-600">Language</p>
                  <p className="text-lg font-bold text-orange-700">
                    {destination.localLanguage || "N/A"}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sub-Destinations */}
        {subDestinations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20 mb-8"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Places to Visit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subDestinations.map((subDest, index) => (
                <motion.div
                  key={subDest.subDestinationId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
                >
                  {subDest.featuredImage && (
                    <img
                      src={
                        subDest.featuredImage ||
                        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80"
                      }
                      alt={subDest.subDestinationName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80";
                      }}
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {subDest.subDestinationName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {subDest.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Category:</span>
                        <span className="font-medium text-blue-600">
                          {subDest.category}
                        </span>
                      </div>
                      {subDest.entryFee !== null &&
                        subDest.entryFee !== undefined && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Entry Fee:</span>
                            <span className="font-medium text-green-600">
                              {subDest.entryFee} BDT
                            </span>
                          </div>
                        )}
                      {subDest.durationHours && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium text-purple-600">
                            {subDest.durationHours} hours
                          </span>
                        </div>
                      )}
                      {subDest.openingHours && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Hours:</span>
                          <span className="font-medium text-gray-700">
                            {subDest.openingHours}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Accommodations */}
        {accommodations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20 mb-8"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center">
              <Building className="h-7 w-7 mr-2 text-blue-600" />
              Accommodations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accommodations.map((accommodation, index) => (
                <motion.div
                  key={accommodation.accommodationId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-purple-100 overflow-hidden"
                >
                  {accommodation.photos && accommodation.photos.length > 0 && (
                    <img
                      src={accommodation.photos[0]}
                      alt={accommodation.accommodationName}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {accommodation.accommodationName}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Home className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium text-purple-600">
                          {accommodation.accommodationType}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">Price per Night:</span>
                        <span className="font-bold text-green-600">
                          {accommodation.pricePerNight} {accommodation.currency}
                        </span>
                      </div>
                      {accommodation.address && (
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-600 text-xs">
                            {accommodation.address}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>Check-in</span>
                          </div>
                          <p className="font-bold text-blue-600">
                            {accommodation.checkInTime || "N/A"}
                          </p>
                        </div>
                        <div className="bg-green-50 p-2 rounded-lg">
                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>Check-out</span>
                          </div>
                          <p className="font-bold text-green-600">
                            {accommodation.checkOutTime || "N/A"}
                          </p>
                        </div>
                      </div>
                      {accommodation.contactEmail && (
                        <p className="text-xs text-gray-500 mt-2">
                          📧 {accommodation.contactEmail}
                        </p>
                      )}
                      {accommodation.contactPhone && (
                        <p className="text-xs text-gray-500">
                          📞 {accommodation.contactPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Transports */}
        {transports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center">
              <Bus className="h-7 w-7 mr-2 text-blue-600" />
              Transportation Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transports.map((transport, index) => (
                <motion.div
                  key={transport.transportId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {transport.transportType}
                    </h3>
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Bus className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Operator:</span>
                      <span className="font-medium text-gray-900">
                        {transport.operatorName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium text-blue-600 text-xs">
                        {transport.routeFrom} → {transport.routeTo}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-green-600">
                        {transport.price} {transport.currency}
                      </span>
                    </div>
                    {transport.departureTime && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-600">Departure:</span>
                        <span className="font-medium text-purple-600">
                          {transport.departureTime}
                        </span>
                      </div>
                    )}
                    {transport.arrivalTime && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-gray-600">Arrival:</span>
                        <span className="font-medium text-orange-600">
                          {transport.arrivalTime}
                        </span>
                      </div>
                    )}
                    {transport.frequency && (
                      <div className="bg-yellow-50 p-2 rounded-lg mt-3">
                        <p className="text-xs text-gray-600">Frequency</p>
                        <p className="font-bold text-yellow-700">
                          {transport.frequency}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DestinationDetailPage;
