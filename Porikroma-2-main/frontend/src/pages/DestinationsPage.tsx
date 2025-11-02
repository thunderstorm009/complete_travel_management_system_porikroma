import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  MapIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import {
  MapPin,
  Filter,
  Globe,
  DollarSign,
  Shield,
  Clock,
  X,
} from "lucide-react";
import { destinationApi } from "../api/destination";
import LoadingSpinner from "../components/LoadingSpinner";
// import { formatCurrency } from "../utils/helpers"; // Unused for now

const DestinationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const {
    data: destinations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["destinations", searchTerm, selectedBudget, selectedCountry],
    queryFn: () =>
      destinationApi.getAllDestinations({
        search: searchTerm || undefined,
        budgetLevel: selectedBudget || undefined,
        country: selectedCountry || undefined,
      }),
  });

  const { data: countries = [] } = useQuery({
    queryKey: ["destination-countries"],
    queryFn: destinationApi.getAvailableCountries,
  });

  const { data: budgetLevels = [] } = useQuery({
    queryKey: ["destination-budget-levels"],
    queryFn: destinationApi.getAvailableBudgetLevels,
  });

  const formatBudgetLevel = (level: string) => {
    return level
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getBudgetColor = (level: string) => {
    switch (level) {
      case "BUDGET":
        return "bg-green-100 text-green-800";
      case "MID_RANGE":
        return "bg-yellow-100 text-yellow-800";
      case "LUXURY":
        return "bg-blue-100 text-blue-800";
      case "PREMIUM":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case "VERY_SAFE":
        return "bg-green-100 text-green-800";
      case "SAFE":
        return "bg-blue-100 text-blue-800";
      case "MODERATE":
        return "bg-yellow-100 text-yellow-800";
      case "CAUTION":
        return "bg-orange-100 text-orange-800";
      case "AVOID":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Globe className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Explore Destinations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing places for your next adventure
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-12"
        >
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-3">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Find Your Perfect Destination
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </motion.div>

            <motion.select
              whileHover={{ scale: 1.02 }}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </motion.select>

            <motion.select
              whileHover={{ scale: 1.02 }}
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="">All Budgets</option>
              {budgetLevels.map((level) => (
                <option key={level} value={level}>
                  {formatBudgetLevel(level)}
                </option>
              ))}
            </motion.select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm("");
                setSelectedCountry("");
                setSelectedBudget("");
              }}
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Clear Filters</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Destinations Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading destinations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600">
                  Failed to load destinations. Please try again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : destinations && destinations.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {destinations.map((destination, index) => (
                <motion.div
                  key={destination.destinationId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Link
                    to={`/destinations/${destination.destinationId}`}
                    className="block bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                      <img
                        src={
                          destination.featuredImage ||
                          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
                        }
                        alt={destination.destinationName}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-all duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {destination.destinationName}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getBudgetColor(
                            destination.budgetLevel
                          )}`}
                        >
                          <DollarSign className="h-3 w-3 mr-1" />
                          {destination.budgetLevel.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">
                          {destination.city && `${destination.city}, `}
                          {destination.country}
                        </span>
                      </div>

                      {destination.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {destination.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {destination.bestVisitTime && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1 text-orange-500" />
                              <span className="text-xs font-medium">
                                {destination.bestVisitTime}
                              </span>
                            </div>
                          )}
                        </div>

                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getSafetyColor(
                            destination.safetyRating
                          )}`}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {destination.safetyRating.replace("_", " ")}
                        </span>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                            {destination.currency}
                          </span>
                          <span className="text-blue-600 font-semibold group-hover:text-blue-800 transition-colors duration-200">
                            Explore →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Globe className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No destinations found
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                {searchTerm || selectedCountry || selectedBudget
                  ? "Try adjusting your filters to see more results."
                  : "No destinations are currently available."}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationsPage;
