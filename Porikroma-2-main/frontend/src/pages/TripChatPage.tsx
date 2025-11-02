import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import io, { Socket } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { TripMessage } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import ImageUploader from "../components/ImageUploader";
import { toast } from "sonner";
import {
  PaperAirplaneIcon,
  PhotoIcon,
  PaperClipIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { Send, Image, Paperclip, Smile, MessageCircle } from "lucide-react";
import { chatApi } from "../api/chat";

const TripChatPage: React.FC = () => {
  const { id: tripId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showImageUploader, setShowImageUploader] = useState(false);

  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ["trip-messages", tripId],
    queryFn: () => {
      console.log("Fetching messages for trip:", tripId);
      return tripId
        ? chatApi.getTripMessages(parseInt(tripId))
        : Promise.resolve([]);
    },
    enabled: !!tripId,
    refetchInterval: 2000, // Poll every 2 seconds as fallback while Socket.IO is being fixed
  });

  // Debug logging
  useEffect(() => {
    console.log("TripChatPage mounted with tripId:", tripId);
    console.log("Messages:", messages);
    console.log("Messages loading:", messagesLoading);
    console.log("Messages error:", messagesError);
    console.log("User:", user);
  }, [tripId, messages, messagesLoading, messagesError, user]);

  const { data: trip } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () =>
      tripId
        ? import("../api/trip").then((m) =>
            m.tripApi.getTripById(parseInt(tripId))
          )
        : Promise.resolve(null),
    enabled: !!tripId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: (newMessage) => {
      console.log("Message sent successfully:", newMessage);
      setMessage("");
      setShowImageUploader(false);

      // Immediately add the message to the local cache for instant UI update
      queryClient.setQueryData(
        ["trip-messages", tripId],
        (oldMessages: TripMessage[] = []) => [...oldMessages, newMessage]
      );

      // Also invalidate to ensure fresh data from server
      queryClient.invalidateQueries({ queryKey: ["trip-messages", tripId] });
    },
    onError: (error: any) => {
      console.error("Failed to send message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    },
  });

  // Socket.IO connection
  useEffect(() => {
    if (!tripId || !user) return;

    console.log("Initializing Socket.IO connection for trip:", tripId);

    const newSocket = io(
      process.env.REACT_APP_SOCKET_URL || "http://localhost:9092",
      {
        auth: {
          token: localStorage.getItem("token"),
        },
        transports: ["polling", "websocket"],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        forceNew: true,
      }
    );

    newSocket.on("connect", () => {
      console.log("Socket.IO connected:", newSocket.id);
      newSocket.emit("join-trip", tripId);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    newSocket.on("joined-trip", (message) => {
      console.log("Successfully joined trip room:", message);
    });

    newSocket.on("new-message", (newMessage: TripMessage) => {
      console.log("Received new message via Socket.IO:", newMessage);
      queryClient.setQueryData(
        ["trip-messages", tripId],
        (oldMessages: TripMessage[] = []) => {
          // Avoid duplicate messages
          const messageExists = oldMessages.some(
            (msg) => msg.messageId === newMessage.messageId
          );
          if (messageExists) {
            console.log("Message already exists, skipping duplicate");
            return oldMessages;
          }
          console.log("Adding new message to chat");
          return [...oldMessages, newMessage];
        }
      );
    });

    newSocket.on(
      "user-typing",
      (data: { userId: number; userName: string; isTyping: boolean }) => {
        if (data.userId !== user.userId) {
          setTypingUsers((prev) => {
            if (data.isTyping) {
              return prev.includes(data.userName)
                ? prev
                : [...prev, data.userName];
            } else {
              return prev.filter((name) => name !== data.userName);
            }
          });
        }
      }
    );

    newSocket.on("message-updated", (updatedMessage: TripMessage) => {
      queryClient.setQueryData(
        ["trip-messages", tripId],
        (oldMessages: TripMessage[] = []) =>
          oldMessages.map((msg) =>
            msg.messageId === updatedMessage.messageId ? updatedMessage : msg
          )
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [tripId, user, queryClient]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typing indicator
  useEffect(() => {
    if (!socket || !tripId) return;

    const typingTimeout = setTimeout(() => {
      if (isTyping) {
        socket.emit("typing", { tripId, isTyping: false });
        setIsTyping(false);
      }
    }, 1000);

    return () => clearTimeout(typingTimeout);
  }, [message, socket, tripId, isTyping]);

  const handleSendMessage = () => {
    if (!message.trim() || !tripId) return;

    sendMessageMutation.mutate({
      tripId: parseInt(tripId),
      messageType: "TEXT",
      content: message,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);

    if (!socket || !tripId) return;

    if (!isTyping && value.trim()) {
      setIsTyping(true);
      socket.emit("typing", { tripId, isTyping: true });
    }
  };

  const handleImageUpload = (url: string) => {
    if (!tripId) return;

    sendMessageMutation.mutate({
      tripId: parseInt(tripId),
      messageType: "IMAGE",
      content: "Image shared",
      attachmentUrl: url,
    });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const groupMessagesByDate = (messages: TripMessage[]) => {
    const groups: { [key: string]: TripMessage[] } = {};

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const isConsecutiveMessage = (
    currentMsg: TripMessage,
    prevMsg: TripMessage | null
  ) => {
    if (!prevMsg) return false;

    const timeDiff =
      new Date(currentMsg.createdAt).getTime() -
      new Date(prevMsg.createdAt).getTime();
    const fiveMinutes = 5 * 60 * 1000;

    return (
      currentMsg.senderUserId === prevMsg.senderUserId && timeDiff < fiveMinutes
    );
  };

  if (messagesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Chat
          </h2>
          <p className="text-gray-600">
            {messagesError instanceof Error
              ? messagesError.message
              : "Failed to load messages"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {trip?.tripName} Chat
            </h1>
            <p className="text-sm text-gray-500">
              {trip?.members?.length} members
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {typingUsers.length > 0 && (
              <div className="text-sm text-gray-500 italic">
                {typingUsers.length === 1
                  ? `${typingUsers[0]} is typing...`
                  : `${typingUsers.length} people are typing...`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((msg, index) => {
              const prevMsg = index > 0 ? dateMessages[index - 1] : null;
              const isConsecutive = isConsecutiveMessage(msg, prevMsg);
              const isOwnMessage = msg.senderUserId === user?.userId;

              return (
                <div
                  key={msg.messageId}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  } ${isConsecutive ? "mt-1" : "mt-4"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      isOwnMessage ? "order-2" : "order-1"
                    }`}
                  >
                    {!isConsecutive && !isOwnMessage && (
                      <div className="mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {msg.senderName}
                        </span>
                      </div>
                    )}

                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isOwnMessage
                          ? "bg-primary-600 text-white"
                          : "bg-white text-gray-900 shadow-sm border"
                      } ${
                        isConsecutive && isOwnMessage ? "rounded-br-sm" : ""
                      } ${
                        isConsecutive && !isOwnMessage ? "rounded-bl-sm" : ""
                      }`}
                    >
                      {msg.messageType === "IMAGE" && msg.attachmentUrl && (
                        <div className="mb-2">
                          <img
                            src={msg.attachmentUrl}
                            alt="Attachment"
                            className="max-w-full h-auto rounded cursor-pointer"
                            onClick={() =>
                              window.open(msg.attachmentUrl, "_blank")
                            }
                          />
                        </div>
                      )}

                      {msg.messageType === "FILE" && msg.attachmentUrl && (
                        <div className="mb-2">
                          <a
                            href={msg.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                          >
                            <PaperClipIcon className="h-4 w-4" />
                            <span>View File</span>
                          </a>
                        </div>
                      )}

                      <div className="break-words">{msg.content}</div>

                      {msg.edited && (
                        <div
                          className={`text-xs mt-1 ${
                            isOwnMessage ? "text-blue-200" : "text-gray-500"
                          }`}
                        >
                          (edited)
                        </div>
                      )}
                    </div>

                    {!isConsecutive && (
                      <div
                        className={`text-xs text-gray-500 mt-1 ${
                          isOwnMessage ? "text-right" : "text-left"
                        }`}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </div>
                    )}
                  </div>

                  {!isConsecutive && !isOwnMessage && (
                    <div className="order-1 mr-3">
                      {msg.senderProfilePicture ? (
                        <img
                          src={msg.senderProfilePicture}
                          alt={msg.senderName}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm">
                          {msg.senderName?.[0]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Share Image
              </h3>
              <ImageUploader
                onImageUpload={handleImageUpload}
                placeholder="Upload Image to Share"
              />
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowImageUploader(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-end space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowImageUploader(true)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <PhotoIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
              <FaceSmileIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={1}
              style={{
                minHeight: "40px",
                maxHeight: "120px",
              }}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendMessageMutation.isPending ? (
              <LoadingSpinner size="sm" />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripChatPage;
