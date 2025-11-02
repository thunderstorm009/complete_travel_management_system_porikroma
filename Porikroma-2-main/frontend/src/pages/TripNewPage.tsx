import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  UserGroupIcon,
  HomeIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import {
  Plane,
  Map,
  Users,
  Camera,
  Calendar,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { tripApi } from "../api/trip";
import { destinationApi } from "../api/destination";
import { userApi } from "../api/user";
import LoadingSpinner from "../components/LoadingSpinner";
import ImageUploader from "../components/ImageUploader";
import { toast } from "react-hot-toast";

const TripNewPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({
    tripName: "",
    destinationId: 0,
    destination: null as any,
    tripBudget: 0,
    startDate: "",
    endDate: "",
    tripPhotoUrl: "",
    selectedSubDestinations: [] as any[],
    selectedAccommodations: [] as any[],
    selectedTransports: [] as any[],
    invitedMembers: [] as any[],
  });

  // Search states
  const [destinationSearch, setDestinationSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [budgetSearch, setBudgetSearch] = useState<number | null>(null);
  const [showBudgetResults, setShowBudgetResults] = useState(false);

  // Budget tracker state
  const [calculatedBudget, setCalculatedBudget] = useState(0);

  // Debounce state to prevent rapid clicking
  const [isProcessing, setIsProcessing] = useState(false);

  // Destination data
  const { data: destinations, isLoading: destinationsLoading } = useQuery({
    queryKey: ["destinations", destinationSearch],
    queryFn: () =>
      destinationApi.getAllDestinations({ search: destinationSearch }),
  });

  // Budget-filtered destinations
  const { data: budgetDestinations, isLoading: budgetDestinationsLoading } =
    useQuery({
      queryKey: ["budget-destinations", budgetSearch],
      queryFn: () => {
        if (!budgetSearch) return [];
        // Determine budget level based on amount
        let budgetLevel = "BUDGET";
        if (budgetSearch > 50000) budgetLevel = "LUXURY";
        else if (budgetSearch > 25000) budgetLevel = "PREMIUM";
        else if (budgetSearch > 10000) budgetLevel = "MID_RANGE";

        return destinationApi.getAllDestinations({ budgetLevel });
      },
      enabled: !!budgetSearch && showBudgetResults,
    });

  // Sub-destinations data
  const { data: subDestinations } = useQuery({
    queryKey: ["sub-destinations", tripData.destinationId],
    queryFn: () => destinationApi.getSubDestinations(tripData.destinationId),
    enabled: !!tripData.destinationId,
  });

  // Accommodations data
  const { data: accommodations } = useQuery({
    queryKey: ["accommodations", tripData.destinationId],
    queryFn: () => destinationApi.getAccommodations(tripData.destinationId),
    enabled: !!tripData.destinationId,
  });

  // Transports data
  const { data: transports } = useQuery({
    queryKey: ["transports", tripData.destinationId],
    queryFn: () => destinationApi.getTransports(tripData.destinationId),
    enabled: !!tripData.destinationId,
  });

  // User search for invitations
  const { data: searchUsers } = useQuery({
    queryKey: ["user-search", userSearch],
    queryFn: () => userApi.searchUsers(userSearch),
    enabled: userSearch.length > 2,
  });

  const createTripMutation = useMutation({
    mutationFn: async (data: any) => {
      // Step 1: Create the trip
      const trip = await tripApi.createTrip({
        tripName: data.tripName,
        destinationId: data.destinationId,
        tripBudget: data.tripBudget,
        startDate: data.startDate,
        endDate: data.endDate,
        tripPhotoUrl: data.tripPhotoUrl,
      });

      // Step 2: Add sub-destinations
      if (data.selectedSubDestinations.length > 0) {
        await tripApi.addSubDestinations(
          trip.tripId,
          data.selectedSubDestinations.map((s: any) => s.subDestinationId)
        );
      }

      // Step 3: Add accommodations
      if (data.selectedAccommodations.length > 0) {
        await tripApi.addAccommodations(
          trip.tripId,
          data.selectedAccommodations
        );
      }

      // Step 4: Add transports
      if (data.selectedTransports.length > 0) {
        await tripApi.addTransport(trip.tripId, data.selectedTransports);
      }

      // Step 5: Send invitations
      for (const member of data.invitedMembers) {
        await tripApi.inviteToTrip(trip.tripId, {
          inviteeUserId: member.userId,
          invitationMessage: `You've been invited to join "${data.tripName}"!`,
        });
      }

      return trip;
    },
    onSuccess: (newTrip) => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trip created successfully with all details!");
      navigate(`/trips/${newTrip.tripId}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create trip");
    },
  });

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step validation functions
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return tripData.destinationId > 0;
      case 2:
        return tripData.tripName && tripData.startDate && tripData.endDate;
      case 3:
        return true; // Sub-destinations are optional
      case 4:
        return true; // Accommodations are optional
      case 5:
        return true; // Transports are optional
      case 6:
        return true; // Members are optional
      default:
        return false;
    }
  };

  // Handle destination selection
  const handleDestinationSelect = (destination: any) => {
    setTripData((prev) => ({
      ...prev,
      destinationId: destination.destinationId,
      destination,
    }));
  };

  // Handle final trip creation
  const handleCreateTrip = () => {
    createTripMutation.mutate(tripData);
  };

  // Handle image upload
  const handleImageUpload = (url: string) => {
    setTripData((prev) => ({ ...prev, tripPhotoUrl: url }));
  };

  // Helper function to get days between dates
  const getDaysBetweenDates = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    return Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 3600 * 24)
    );
  };

  // Handle budget search
  const handleBudgetSearch = () => {
    if (budgetSearch && budgetSearch > 0) {
      setShowBudgetResults(true);
      setDestinationSearch(""); // Clear regular search when doing budget search
    }
  };

  // Clear budget search
  const clearBudgetSearch = () => {
    setShowBudgetResults(false);
    setBudgetSearch(null);
  };

  // Safe sub-destination selection handler with error boundaries
  const handleSubDestinationToggle = useCallback(
    (subDest: any) => {
      try {
        if (isProcessing) {
          return; // Prevent rapid clicks
        }

        if (!subDest || !subDest.subDestinationId) {
          console.error("Invalid sub-destination:", subDest);
          return;
        }

        setIsProcessing(true);

        setTripData((prev) => {
          try {
            const currentSelections = Array.isArray(
              prev.selectedSubDestinations
            )
              ? prev.selectedSubDestinations
              : [];

            const isSelected = currentSelections.some(
              (s) => s && s.subDestinationId === subDest.subDestinationId
            );

            if (isSelected) {
              return {
                ...prev,
                selectedSubDestinations: currentSelections.filter(
                  (s) => s && s.subDestinationId !== subDest.subDestinationId
                ),
              };
            } else {
              return {
                ...prev,
                selectedSubDestinations: [...currentSelections, subDest],
              };
            }
          } catch (innerError) {
            console.error("Error in setTripData:", innerError);
            return prev; // Return unchanged state on error
          }
        });

        // Reset processing state after a short delay
        setTimeout(() => setIsProcessing(false), 100);
      } catch (error) {
        console.error("Error in handleSubDestinationToggle:", error);
        setIsProcessing(false); // Reset on error
      }
    },
    [isProcessing]
  ); // Calculate budget with error handling
  const calculateCurrentBudget = useCallback(() => {
    try {
      let total = 0;

      // Add sub-destination costs safely
      if (Array.isArray(tripData.selectedSubDestinations)) {
        tripData.selectedSubDestinations.forEach((subDest) => {
          if (subDest && typeof subDest.entryFee === "number") {
            total += subDest.entryFee;
          }
        });
      }

      // Add accommodation costs safely
      if (
        tripData.startDate &&
        tripData.endDate &&
        Array.isArray(tripData.selectedAccommodations)
      ) {
        const days = getDaysBetweenDates(tripData.startDate, tripData.endDate);
        if (days > 0) {
          tripData.selectedAccommodations.forEach((acc) => {
            if (acc && typeof acc.pricePerNight === "number") {
              total += acc.pricePerNight * days;
            }
          });
        }
      }

      // Add transport costs safely
      if (Array.isArray(tripData.selectedTransports)) {
        tripData.selectedTransports.forEach((transport) => {
          if (transport && typeof transport.price === "number") {
            total += transport.price;
          }
        });
      }

      return Math.max(0, total); // Ensure non-negative
    } catch (error) {
      console.error("Error calculating budget:", error);
      return 0;
    }
  }, [
    tripData.selectedSubDestinations,
    tripData.selectedAccommodations,
    tripData.selectedTransports,
    tripData.startDate,
    tripData.endDate,
  ]);

  // Memoized budget value
  const calculatedBudgetValue = useMemo(
    () => calculateCurrentBudget(),
    [calculateCurrentBudget]
  );

  // Update budget in tripData when calculated value changes
  useEffect(() => {
    setCalculatedBudget(calculatedBudgetValue);
    if (calculatedBudgetValue !== tripData.tripBudget) {
      setTripData((prev) => ({ ...prev, tripBudget: calculatedBudgetValue }));
    }
  }, [calculatedBudgetValue, tripData.tripBudget]);

  if (destinationsLoading && currentStep === 1) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const steps = [
    { title: "Destination", icon: MapPinIcon },
    { title: "Trip Details", icon: CalendarIcon },
    { title: "Sub-Destinations", icon: MapIcon },
    { title: "Accommodations", icon: HomeIcon },
    { title: "Transport", icon: TruckIcon },
    { title: "Invite Members", icon: UserGroupIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Budget Tracker */}
      {currentStep > 1 && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Current Budget
              </p>
              <p className="text-lg font-bold text-blue-600">
                ৳{calculatedBudgetValue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <div>
              Sub-destinations: ৳
              {tripData.selectedSubDestinations
                .reduce((sum, s) => sum + (s.entryFee || 0), 0)
                .toLocaleString()}
            </div>
            <div>
              Accommodations: ৳
              {(() => {
                const days = getDaysBetweenDates(
                  tripData.startDate,
                  tripData.endDate
                );
                return tripData.selectedAccommodations.reduce(
                  (sum, a) => sum + (a.pricePerNight || 0) * days,
                  0
                );
              })().toLocaleString()}
            </div>
            <div>
              Transport: ৳
              {tripData.selectedTransports
                .reduce((sum, t) => sum + (t.price || 0), 0)
                .toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPinIcon className="h-6 w-6" />
              Create New Trip
            </h1>
            <p className="text-gray-600 mt-1">
              Plan your adventure step by step
            </p>
          </div>
          <div className="p-6">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const stepNumber = index + 1;
                  const isActive = currentStep === stepNumber;
                  const isCompleted = currentStep > stepNumber;
                  const Icon = step.icon;

                  return (
                    <div
                      key={stepNumber}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                          isCompleted
                            ? "bg-primary border-primary text-primary-foreground"
                            : isActive
                            ? "border-primary text-primary"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckIcon className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          isActive ? "text-primary" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              {/* Step 1: Destination Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Choose Your Destination
                    </h3>

                    {/* Budget Search Section */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h4 className="font-medium text-blue-900 mb-3">
                        Search by Budget
                      </h4>
                      <div className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-blue-700 mb-1">
                            Your Budget (BDT)
                          </label>
                          <input
                            type="number"
                            placeholder="Enter your budget..."
                            value={budgetSearch || ""}
                            onChange={(e) =>
                              setBudgetSearch(Number(e.target.value) || null)
                            }
                            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          onClick={handleBudgetSearch}
                          disabled={!budgetSearch}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <MagnifyingGlassIcon className="h-4 w-4" />
                          Search
                        </button>
                        {showBudgetResults && (
                          <button
                            onClick={clearBudgetSearch}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      {showBudgetResults && budgetSearch && (
                        <p className="text-sm text-blue-600 mt-2">
                          Showing destinations for budget: ৳
                          {budgetSearch.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Regular Search */}
                    {!showBudgetResults && (
                      <div className="relative mb-4">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search destinations by name..."
                          value={destinationSearch}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setDestinationSearch(e.target.value)
                          }
                          className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                      {(showBudgetResults
                        ? budgetDestinations
                        : destinations
                      )?.map((destination) => (
                        <div
                          key={destination.destinationId}
                          className={`cursor-pointer transition-all hover:shadow-lg bg-white border rounded-lg overflow-hidden ${
                            tripData.destinationId === destination.destinationId
                              ? "ring-2 ring-blue-500 border-blue-500"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleDestinationSelect(destination)}
                        >
                          {/* Destination Image */}
                          {destination.featuredImage ? (
                            <div className="h-32 w-full relative">
                              <img
                                src={destination.featuredImage}
                                alt={destination.destinationName}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute top-2 right-2">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    destination.budgetLevel === "BUDGET"
                                      ? "bg-green-100 text-green-800"
                                      : destination.budgetLevel === "MID_RANGE"
                                      ? "bg-blue-100 text-blue-800"
                                      : destination.budgetLevel === "PREMIUM"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {destination.budgetLevel.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-32 w-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                              <MapPinIcon className="h-12 w-12 text-white" />
                            </div>
                          )}

                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">
                                  {destination.destinationName}
                                </h4>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <MapPinIcon className="h-3 w-3" />
                                  {destination.country}
                                </p>
                              </div>
                              {tripData.destinationId ===
                                destination.destinationId && (
                                <CheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                            {destination.description && (
                              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                {destination.description}
                              </p>
                            )}
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {destination.safetyRating.replace("_", " ")}
                              </span>
                              <span className="text-xs text-gray-500">
                                {destination.currency}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {showBudgetResults && budgetDestinationsLoading && (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    )}

                    {showBudgetResults &&
                      budgetDestinations?.length === 0 &&
                      !budgetDestinationsLoading && (
                        <div className="text-center py-8 text-gray-500">
                          <MapPinIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>No destinations found within your budget range.</p>
                          <button
                            onClick={clearBudgetSearch}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Try searching by name instead
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Step 2: Trip Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Trip Details</h3>

                  <div>
                    <label
                      htmlFor="tripName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Trip Name
                    </label>
                    <input
                      id="tripName"
                      type="text"
                      value={tripData.tripName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTripData((prev) => ({
                          ...prev,
                          tripName: e.target.value,
                        }))
                      }
                      placeholder="Enter trip name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Start Date
                      </label>
                      <input
                        id="startDate"
                        type="date"
                        value={tripData.startDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTripData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        End Date
                      </label>
                      <input
                        id="endDate"
                        type="date"
                        value={tripData.endDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTripData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Budget
                    </label>
                    <p className="text-lg font-semibold text-blue-600">
                      ৳{calculatedBudgetValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      This budget will be calculated automatically based on your
                      selections in the next steps.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Photo (Optional)
                    </label>
                    <ImageUploader onImageUpload={handleImageUpload} />
                    {tripData.tripPhotoUrl && (
                      <div className="mt-2">
                        <img
                          src={tripData.tripPhotoUrl}
                          alt="Trip preview"
                          className="h-32 w-full object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Sub-Destinations */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Sub-Destinations (Optional)
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add specific places you want to visit within{" "}
                    {tripData.destination?.destinationName ||
                      "your destination"}
                  </p>

                  {!tripData.destinationId ? (
                    <div className="text-center py-8 text-gray-500">
                      <MapIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Please select a destination first.</p>
                    </div>
                  ) : !subDestinations ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : subDestinations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MapIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No sub-destinations available for this destination.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                      {subDestinations
                        .filter(
                          (subDest) => subDest && subDest.subDestinationId
                        )
                        .map((subDest) => {
                          try {
                            const selectedSubDestinations = Array.isArray(
                              tripData.selectedSubDestinations
                            )
                              ? tripData.selectedSubDestinations
                              : [];

                            const isSelected = selectedSubDestinations.some(
                              (s) =>
                                s &&
                                s.subDestinationId === subDest.subDestinationId
                            );

                            return (
                              <div
                                key={subDest.subDestinationId}
                                className={`cursor-pointer transition-all hover:shadow-lg bg-white border rounded-lg overflow-hidden ${
                                  isSelected
                                    ? "ring-2 ring-blue-500 border-blue-500"
                                    : "border-gray-200"
                                }`}
                                onClick={() =>
                                  handleSubDestinationToggle(subDest)
                                }
                              >
                                {/* Sub-destination Image */}
                                {subDest.featuredImage ? (
                                  <div className="h-24 w-full relative">
                                    <img
                                      src={subDest.featuredImage}
                                      alt={subDest.subDestinationName}
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                      <span className="px-2 py-1 text-xs font-semibold bg-white/80 text-gray-800 rounded-full">
                                        {subDest.category}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="h-24 w-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                                    <MapIcon className="h-8 w-8 text-white" />
                                  </div>
                                )}

                                <div className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold">
                                        {subDest.subDestinationName}
                                      </h4>
                                      <p className="text-xs text-gray-500 mb-1">
                                        {subDest.category.replace("_", " ")}
                                      </p>
                                      {subDest.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                          {subDest.description}
                                        </p>
                                      )}
                                      <div className="mt-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-green-600">
                                          {subDest.entryFee > 0
                                            ? `৳${subDest.entryFee}`
                                            : "Free"}
                                        </span>
                                        {subDest.durationHours && (
                                          <span className="text-xs text-gray-500">
                                            {subDest.durationHours}h
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <CheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0 ml-2" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          } catch (error) {
                            console.error(
                              "Error rendering sub-destination:",
                              subDest,
                              error
                            );
                            return null;
                          }
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Accommodations */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Accommodations (Optional)
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Select accommodations for your stay in{" "}
                    {tripData.destination?.destinationName}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                    {accommodations?.map((accommodation) => {
                      const isSelected = tripData.selectedAccommodations.some(
                        (a) =>
                          a.accommodationId === accommodation.accommodationId
                      );

                      return (
                        <div
                          key={accommodation.accommodationId}
                          className={`cursor-pointer transition-all hover:shadow-md bg-white border rounded-lg ${
                            isSelected
                              ? "ring-2 ring-blue-500 border-blue-500"
                              : "border-gray-200"
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setTripData((prev) => ({
                                ...prev,
                                selectedAccommodations:
                                  prev.selectedAccommodations.filter(
                                    (a) =>
                                      a.accommodationId !==
                                      accommodation.accommodationId
                                  ),
                              }));
                            } else {
                              setTripData((prev) => ({
                                ...prev,
                                selectedAccommodations: [
                                  ...prev.selectedAccommodations,
                                  accommodation,
                                ],
                              }));
                            }
                          }}
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <HomeIcon className="h-6 w-6 text-blue-600" />
                                <div>
                                  <h4 className="font-semibold">
                                    {accommodation.accommodationName}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {accommodation.accommodationType}
                                  </p>
                                  {accommodation.pricePerNight && (
                                    <p className="text-sm font-medium text-green-600">
                                      ৳
                                      {accommodation.pricePerNight.toLocaleString()}
                                      /night
                                    </p>
                                  )}
                                  {tripData.startDate &&
                                    tripData.endDate &&
                                    accommodation.pricePerNight && (
                                      <p className="text-xs text-blue-600">
                                        Total: ৳
                                        {(
                                          accommodation.pricePerNight *
                                          getDaysBetweenDates(
                                            tripData.startDate,
                                            tripData.endDate
                                          )
                                        ).toLocaleString()}
                                      </p>
                                    )}
                                </div>
                              </div>
                              {isSelected && (
                                <CheckIcon className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Transport */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Transport (Optional)
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Select transport options for your trip to{" "}
                    {tripData.destination?.destinationName}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                    {transports?.map((transport) => {
                      const isSelected = tripData.selectedTransports.some(
                        (t) => t.transportId === transport.transportId
                      );

                      return (
                        <div
                          key={transport.transportId}
                          className={`cursor-pointer transition-all hover:shadow-md bg-white border rounded-lg ${
                            isSelected
                              ? "ring-2 ring-blue-500 border-blue-500"
                              : "border-gray-200"
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setTripData((prev) => ({
                                ...prev,
                                selectedTransports:
                                  prev.selectedTransports.filter(
                                    (t) =>
                                      t.transportId !== transport.transportId
                                  ),
                              }));
                            } else {
                              setTripData((prev) => ({
                                ...prev,
                                selectedTransports: [
                                  ...prev.selectedTransports,
                                  transport,
                                ],
                              }));
                            }
                          }}
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <TruckIcon className="h-6 w-6 text-blue-600" />
                                <div>
                                  <h4 className="font-semibold">
                                    {transport.operatorName ||
                                      transport.transportType}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {transport.transportType}
                                  </p>
                                  {transport.price && (
                                    <p className="text-sm font-medium text-green-600">
                                      ৳{transport.price.toLocaleString()}/person
                                    </p>
                                  )}
                                  {transport.routeFrom && transport.routeTo && (
                                    <p className="text-xs text-gray-500">
                                      {transport.routeFrom} →{" "}
                                      {transport.routeTo}
                                    </p>
                                  )}
                                  {transport.durationMinutes && (
                                    <p className="text-xs text-gray-500">
                                      Duration:{" "}
                                      {Math.floor(
                                        transport.durationMinutes / 60
                                      )}
                                      h {transport.durationMinutes % 60}m
                                    </p>
                                  )}
                                </div>
                              </div>
                              {isSelected && (
                                <CheckIcon className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 6: Invite Members */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Invite Members (Optional)
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Invite friends and family to join your trip
                  </p>

                  <div className="relative mb-4">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by email or name..."
                      value={userSearch}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserSearch(e.target.value)
                      }
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Search Results */}
                  {searchUsers && searchUsers.length > 0 && (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {searchUsers.map((user) => {
                        const isInvited = tripData.invitedMembers.some(
                          (m) => m.userId === user.userId
                        );

                        return (
                          <div
                            key={user.userId}
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                              isInvited ? "bg-primary/10 border-primary" : ""
                            }`}
                            onClick={() => {
                              if (isInvited) {
                                setTripData((prev) => ({
                                  ...prev,
                                  invitedMembers: prev.invitedMembers.filter(
                                    (m) => m.userId !== user.userId
                                  ),
                                }));
                              } else {
                                setTripData((prev) => ({
                                  ...prev,
                                  invitedMembers: [
                                    ...prev.invitedMembers,
                                    user,
                                  ],
                                }));
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <UserGroupIcon className="h-6 w-6 text-primary" />
                              <div>
                                <p className="font-semibold">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            {isInvited && (
                              <CheckIcon className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Invited Members */}
                  {tripData.invitedMembers.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">
                        Invited Members ({tripData.invitedMembers.length})
                      </h4>
                      <div className="space-y-2">
                        {tripData.invitedMembers.map((member) => (
                          <div
                            key={member.userId}
                            className="flex items-center justify-between p-2 bg-primary/10 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <UserGroupIcon className="h-5 w-5 text-primary" />
                              <span className="font-medium">
                                {member.firstName} {member.lastName}
                              </span>
                            </div>
                            <button
                              className="px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              onClick={() => {
                                setTripData((prev) => ({
                                  ...prev,
                                  invitedMembers: prev.invitedMembers.filter(
                                    (m) => m.userId !== member.userId
                                  ),
                                }));
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>

                {currentStep < 6 ? (
                  <button
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCreateTrip}
                    disabled={createTripMutation.isPending || !isStepValid(2)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createTripMutation.isPending ? (
                      <>
                        <LoadingSpinner />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        Create Trip
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripNewPage;
