import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon,
  MapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Crown, Shield } from "lucide-react";
import {
  User,
  Destination,
  SubDestination,
  Accommodation,
  Transport,
} from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import ImageUploader from "../components/ImageUploader";
import { toast } from "sonner";

import { adminApi } from "../api/admin";
import { adminDestinationApi } from "../api/adminDestination";

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "destinations"
  >("overview");
  const queryClient = useQueryClient();

  // Modal states
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showSubDestinationModal, setShowSubDestinationModal] = useState(false);
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [editingDestination, setEditingDestination] =
    useState<Destination | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    number | null
  >(null);

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: adminApi.getAnalytics,
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["admin", "users"],
    queryFn: adminApi.getAllUsers,
  });

  const { data: destinations, isLoading: destinationsLoading } = useQuery<
    Destination[]
  >({
    queryKey: ["admin", "destinations"],
    queryFn: adminApi.getAllDestinations,
  });

  const promoteUserMutation = useMutation({
    mutationFn: adminApi.promoteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User promoted to admin");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted");
    },
  });

  const deleteDestinationMutation = useMutation({
    mutationFn: adminApi.deleteDestination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] });
      toast.success("Destination deleted");
    },
  });

  const createDestinationMutation = useMutation({
    mutationFn: adminApi.createDestination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] });
      toast.success("Destination created successfully");
      setShowDestinationModal(false);
      setEditingDestination(null);
    },
  });

  const updateDestinationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Destination> }) =>
      adminApi.updateDestination(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] });
      toast.success("Destination updated successfully");
      setShowDestinationModal(false);
      setEditingDestination(null);
    },
  });

  // SubDestination mutations
  const createSubDestinationMutation = useMutation({
    mutationFn: ({
      destinationId,
      data,
    }: {
      destinationId: number;
      data: Partial<SubDestination>;
    }) => adminDestinationApi.createSubDestination(destinationId, data),
    onSuccess: () => {
      toast.success("Sub-destination created successfully");
      setShowSubDestinationModal(false);
    },
  });

  // Accommodation mutations
  const createAccommodationMutation = useMutation({
    mutationFn: ({
      destinationId,
      data,
    }: {
      destinationId: number;
      data: Partial<Accommodation>;
    }) => adminDestinationApi.createAccommodation(destinationId, data),
    onSuccess: () => {
      toast.success("Accommodation created successfully");
      setShowAccommodationModal(false);
    },
  });

  // Transport mutations
  const createTransportMutation = useMutation({
    mutationFn: ({
      destinationId,
      data,
    }: {
      destinationId: number;
      data: Partial<Transport>;
    }) => adminDestinationApi.createTransport(destinationId, data),
    onSuccess: () => {
      toast.success("Transport created successfully");
      setShowTransportModal(false);
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.totalUsers || 0}
              </p>
              <p className="text-sm text-green-600">
                +{analytics?.userGrowth || 0}% this month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Trips</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.activeTrips || 0}
              </p>
              <p className="text-sm text-green-600">
                +{analytics?.tripGrowth || 0}% this month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Destinations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.totalDestinations || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Overall Travel Managed
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                ${analytics?.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <ChartBarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p>Activity charts and recent actions will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">User Management</h2>
        <div className="text-sm text-gray-500">
          {users?.length || 0} total users
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.emailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => console.log("View user", user.userId)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View user"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    {user.role !== "ADMIN" && (
                      <button
                        onClick={() => promoteUserMutation.mutate(user.userId)}
                        className="text-green-600 hover:text-green-900"
                        title="Promote to admin"
                      >
                        <UserPlusIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this user?"
                          )
                        ) {
                          deleteUserMutation.mutate(user.userId);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                      title="Delete user"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDestinations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          Destination Management
        </h2>
        <button
          onClick={() => {
            setEditingDestination(null);
            setShowDestinationModal(true);
          }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Destination
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations?.map((destination) => (
          <div
            key={destination.destinationId}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={
                  destination.featuredImage ||
                  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
                }
                alt={destination.destinationName}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";
                }}
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {destination.destinationName}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {destination.budgetLevel?.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {destination.city}, {destination.country}
              </p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {destination.description}
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Best time: {destination.bestVisitTime}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingDestination(destination);
                        setShowDestinationModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit destination"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this destination?"
                          )
                        ) {
                          deleteDestinationMutation.mutate(
                            destination.destinationId
                          );
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                      title="Delete destination"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <button
                    onClick={() => {
                      setSelectedDestinationId(destination.destinationId);
                      setShowSubDestinationModal(true);
                    }}
                    className="flex items-center justify-center px-2 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded hover:bg-green-100 transition-colors"
                    title="Add sub-destination"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Sub-Dest
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDestinationId(destination.destinationId);
                      setShowAccommodationModal(true);
                    }}
                    className="flex items-center justify-center px-2 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
                    title="Add accommodation"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Hotel
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDestinationId(destination.destinationId);
                      setShowTransportModal(true);
                    }}
                    className="flex items-center justify-center px-2 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 rounded hover:bg-orange-100 transition-colors"
                    title="Add transport"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Transport
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (analyticsLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-3">
                  <Crown className="h-8 w-8 mr-3 text-yellow-300" />
                  <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                </div>
                <p className="text-xl text-purple-100">
                  Overview of platform statistics and performance metrics
                </p>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="h-16 w-16 text-purple-200" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8">
        {[
          { key: "overview", label: "Overview", icon: ChartBarIcon },
          { key: "users", label: "Users", icon: UsersIcon },
          { key: "destinations", label: "Destinations", icon: MapIcon },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === key
                ? "bg-primary-600 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "users" &&
        (usersLoading ? <LoadingSpinner /> : renderUsers())}
      {activeTab === "destinations" &&
        (destinationsLoading ? <LoadingSpinner /> : renderDestinations())}

      {/* Destination Modal */}
      <AnimatePresence>
        {showDestinationModal && (
          <DestinationModal
            destination={editingDestination}
            onClose={() => {
              setShowDestinationModal(false);
              setEditingDestination(null);
            }}
            onSubmit={(data) => {
              if (editingDestination) {
                updateDestinationMutation.mutate({
                  id: editingDestination.destinationId,
                  data,
                });
              } else {
                createDestinationMutation.mutate(data);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Sub-Destination Modal */}
      <AnimatePresence>
        {showSubDestinationModal && selectedDestinationId && (
          <SubDestinationModal
            destinationId={selectedDestinationId}
            onClose={() => {
              setShowSubDestinationModal(false);
              setSelectedDestinationId(null);
            }}
            onSubmit={(data) => {
              createSubDestinationMutation.mutate({
                destinationId: selectedDestinationId,
                data,
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Accommodation Modal */}
      <AnimatePresence>
        {showAccommodationModal && selectedDestinationId && (
          <AccommodationModal
            destinationId={selectedDestinationId}
            onClose={() => {
              setShowAccommodationModal(false);
              setSelectedDestinationId(null);
            }}
            onSubmit={(data) => {
              createAccommodationMutation.mutate({
                destinationId: selectedDestinationId,
                data,
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Transport Modal */}
      <AnimatePresence>
        {showTransportModal && selectedDestinationId && (
          <TransportModal
            destinationId={selectedDestinationId}
            onClose={() => {
              setShowTransportModal(false);
              setSelectedDestinationId(null);
            }}
            onSubmit={(data) => {
              createTransportMutation.mutate({
                destinationId: selectedDestinationId,
                data,
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal Components
interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  onSubmit: (data: Partial<Destination>) => void;
}

const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Destination>>({
    destinationName: destination?.destinationName || "",
    country: destination?.country || "",
    stateProvince: destination?.stateProvince || "",
    city: destination?.city || "",
    description: destination?.description || "",
    featuredImage: destination?.featuredImage || "",
    latitude: destination?.latitude || 0,
    longitude: destination?.longitude || 0,
    bestVisitTime: destination?.bestVisitTime || "",
    weatherInfo: destination?.weatherInfo || "",
    localLanguage: destination?.localLanguage || "",
    currency: destination?.currency || "USD",
    timeZone: destination?.timeZone || "",
    entryRequirements: destination?.entryRequirements || "",
    safetyRating: destination?.safetyRating,
    budgetLevel: destination?.budgetLevel,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {destination ? "Edit Destination" : "Add Destination"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination Name *
              </label>
              <input
                type="text"
                required
                value={formData.destinationName}
                onChange={(e) =>
                  setFormData({ ...formData, destinationName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                type="text"
                value={formData.stateProvince || ""}
                onChange={(e) =>
                  setFormData({ ...formData, stateProvince: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image *
            </label>
            <ImageUploader
              currentImage={formData.featuredImage}
              onImageUpload={(url: string) =>
                setFormData({ ...formData, featuredImage: url })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Best Visit Time *
              </label>
              <input
                type="text"
                required
                value={formData.bestVisitTime}
                onChange={(e) =>
                  setFormData({ ...formData, bestVisitTime: e.target.value })
                }
                placeholder="e.g., November to February"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local Language *
              </label>
              <input
                type="text"
                required
                value={formData.localLanguage}
                onChange={(e) =>
                  setFormData({ ...formData, localLanguage: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <input
                type="text"
                required
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                placeholder="e.g., USD, BDT"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Zone *
              </label>
              <input
                type="text"
                required
                value={formData.timeZone}
                onChange={(e) =>
                  setFormData({ ...formData, timeZone: e.target.value })
                }
                placeholder="e.g., GMT+6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Safety Rating *
              </label>
              <select
                required
                value={formData.safetyRating || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    safetyRating: e.target.value as Destination["safetyRating"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select safety rating</option>
                <option value="VERY_SAFE">Very Safe</option>
                <option value="SAFE">Safe</option>
                <option value="MODERATE">Moderate</option>
                <option value="CAUTION">Caution</option>
                <option value="AVOID">Avoid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Level *
              </label>
              <select
                required
                value={formData.budgetLevel || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budgetLevel: e.target.value as Destination["budgetLevel"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select budget level</option>
                <option value="BUDGET">Budget</option>
                <option value="MID_RANGE">Mid Range</option>
                <option value="LUXURY">Luxury</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weather Info
            </label>
            <textarea
              rows={2}
              value={formData.weatherInfo || ""}
              onChange={(e) =>
                setFormData({ ...formData, weatherInfo: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry Requirements
            </label>
            <textarea
              rows={2}
              value={formData.entryRequirements || ""}
              onChange={(e) =>
                setFormData({ ...formData, entryRequirements: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {destination ? "Update" : "Create"} Destination
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

interface SubDestinationModalProps {
  destinationId: number;
  onClose: () => void;
  onSubmit: (data: Partial<SubDestination>) => void;
}

const SubDestinationModal: React.FC<SubDestinationModalProps> = ({
  destinationId,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<SubDestination>>({
    subDestinationName: "",
    category: undefined,
    description: "",
    featuredImage: "",
    address: "",
    latitude: 0,
    longitude: 0,
    entryFee: 0,
    openingHours: "",
    contactPhone: "",
    contactEmail: "",
    websiteUrl: "",
    durationHours: 0,
    difficultyLevel: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add Sub-Destination</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-Destination Name *
              </label>
              <input
                type="text"
                required
                value={formData.subDestinationName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subDestinationName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as SubDestination["category"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="HISTORICAL">Historical</option>
                <option value="NATURAL">Natural</option>
                <option value="CULTURAL">Cultural</option>
                <option value="ADVENTURE">Adventure</option>
                <option value="RELIGIOUS">Religious</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="SHOPPING">Shopping</option>
                <option value="BEACH">Beach</option>
                <option value="MOUNTAIN">Mountain</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image *
            </label>
            <ImageUploader
              currentImage={formData.featuredImage}
              onImageUpload={(url: string) =>
                setFormData({ ...formData, featuredImage: url })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entry Fee ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.entryFee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    entryFee: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Hours
              </label>
              <input
                type="text"
                value={formData.openingHours || ""}
                onChange={(e) =>
                  setFormData({ ...formData, openingHours: e.target.value })
                }
                placeholder="e.g., 9:00 AM - 6:00 PM"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (hours)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.durationHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationHours: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contactPhone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={formData.websiteUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, websiteUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                value={formData.difficultyLevel || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficultyLevel: e.target
                      .value as SubDestination["difficultyLevel"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select difficulty</option>
                <option value="EASY">Easy</option>
                <option value="MODERATE">Moderate</option>
                <option value="HARD">Hard</option>
                <option value="EXTREME">Extreme</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Sub-Destination
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

interface AccommodationModalProps {
  destinationId: number;
  onClose: () => void;
  onSubmit: (data: Partial<Accommodation>) => void;
}

const AccommodationModal: React.FC<AccommodationModalProps> = ({
  destinationId,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Accommodation>>({
    accommodationName: "",
    accommodationType: undefined,
    description: "",
    address: "",
    contactPhone: "",
    contactEmail: "",
    websiteUrl: "",
    checkInTime: "",
    checkOutTime: "",
    pricePerNight: 0,
    currency: "USD",
    amenities: "",
    photos: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add Accommodation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accommodation Name *
              </label>
              <input
                type="text"
                required
                value={formData.accommodationName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accommodationName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                required
                value={formData.accommodationType || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accommodationType: e.target
                      .value as Accommodation["accommodationType"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="HOTEL">Hotel</option>
                <option value="RESORT">Resort</option>
                <option value="HOSTEL">Hostel</option>
                <option value="GUESTHOUSE">Guest House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="COTTAGE">Cottage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (URL) *
            </label>
            <ImageUploader
              currentImage={formData.photos?.[0]}
              onImageUpload={(url: string) =>
                setFormData({ ...formData, photos: [url] })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Night ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.pricePerNight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerNight: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <input
                type="text"
                required
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                placeholder="e.g., USD, BDT"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-In Time *
              </label>
              <input
                type="time"
                required
                value={formData.checkInTime}
                onChange={(e) =>
                  setFormData({ ...formData, checkInTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-Out Time *
              </label>
              <input
                type="time"
                required
                value={formData.checkOutTime}
                onChange={(e) =>
                  setFormData({ ...formData, checkOutTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contactPhone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={formData.websiteUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, websiteUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amenities (comma-separated)
            </label>
            <input
              type="text"
              value={formData.amenities || ""}
              onChange={(e) =>
                setFormData({ ...formData, amenities: e.target.value })
              }
              placeholder="e.g., WiFi, Pool, Gym, Parking"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Accommodation
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

interface TransportModalProps {
  destinationId: number;
  onClose: () => void;
  onSubmit: (data: Partial<Transport>) => void;
}

const TransportModal: React.FC<TransportModalProps> = ({
  destinationId,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Transport>>({
    transportType: undefined,
    operatorName: "",
    routeFrom: "",
    routeTo: "",
    departureTime: "",
    arrivalTime: "",
    durationMinutes: 0,
    frequency: "",
    price: 0,
    currency: "USD",
    amenities: "",
    websiteUrl: "",
    contactPhone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add Transport</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transport Type *
              </label>
              <select
                required
                value={formData.transportType || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transportType: e.target.value as Transport["transportType"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="BUS">Bus</option>
                <option value="TRAIN">Train</option>
                <option value="FLIGHT">Flight</option>
                <option value="CAR_RENTAL">Car Rental</option>
                <option value="BOAT">Boat</option>
                <option value="MOTORCYCLE">Motorcycle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operator Name *
              </label>
              <input
                type="text"
                required
                value={formData.operatorName}
                onChange={(e) =>
                  setFormData({ ...formData, operatorName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Route From *
              </label>
              <input
                type="text"
                required
                value={formData.routeFrom}
                onChange={(e) =>
                  setFormData({ ...formData, routeFrom: e.target.value })
                }
                placeholder="e.g., Dhaka"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Route To *
              </label>
              <input
                type="text"
                required
                value={formData.routeTo}
                onChange={(e) =>
                  setFormData({ ...formData, routeTo: e.target.value })
                }
                placeholder="e.g., Cox's Bazar"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <input
                type="text"
                required
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                placeholder="e.g., USD, BDT"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departure Time
              </label>
              <input
                type="time"
                value={formData.departureTime || ""}
                onChange={(e) =>
                  setFormData({ ...formData, departureTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arrival Time
              </label>
              <input
                type="time"
                value={formData.arrivalTime || ""}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.durationMinutes || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationMinutes: parseInt(e.target.value),
                  })
                }
                placeholder="e.g., 360 for 6 hours"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <input
                type="text"
                value={formData.frequency || ""}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                placeholder="e.g., Daily, 3 times/week"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={formData.websiteUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, websiteUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contactPhone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities (comma-separated)
              </label>
              <input
                type="text"
                value={formData.amenities || ""}
                onChange={(e) =>
                  setFormData({ ...formData, amenities: e.target.value })
                }
                placeholder="e.g., WiFi, AC, Meals"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Transport
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboardPage;
