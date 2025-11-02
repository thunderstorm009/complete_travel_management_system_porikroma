package com.porikroma.service;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class SocketIOService {

    @Autowired
    private SocketIOServer server;

    @PostConstruct
    public void startServer() {
        // Set up event listeners
        server.addConnectListener(client -> {
            System.out.println("Client connected: " + client.getSessionId());
        });

        server.addDisconnectListener(client -> {
            System.out.println("Client disconnected: " + client.getSessionId());
        });

        // Handle join trip room
        server.addEventListener("join-trip", String.class, (client, tripId, ackSender) -> {
            System.out.println("Client " + client.getSessionId() + " joining trip: " + tripId);
            client.joinRoom("trip_" + tripId);
        });

        // Handle leave trip room
        server.addEventListener("leave-trip", String.class, (client, tripId, ackSender) -> {
            System.out.println("Client " + client.getSessionId() + " leaving trip: " + tripId);
            client.leaveRoom("trip_" + tripId);
        });

        server.start();
        System.out.println("Socket.IO server started on port 9092");
    }

    @PreDestroy
    public void stopServer() {
        if (server != null) {
            server.stop();
        }
    }

    public void sendMessageToTrip(Long tripId, Object message) {
        server.getRoomOperations("trip_" + tripId).sendEvent("new-message", message);
    }

    public void sendMessageUpdateToTrip(Long tripId, Object message) {
        server.getRoomOperations("trip_" + tripId).sendEvent("message-updated", message);
    }

    public void sendMessageDeleteToTrip(Long tripId, Long messageId) {
        server.getRoomOperations("trip_" + tripId).sendEvent("message-deleted", messageId);
    }

    public void sendNotificationToUser(Long userId, Object notification) {
        server.getRoomOperations("user_" + userId).sendEvent("new-notification", notification);
    }
}
