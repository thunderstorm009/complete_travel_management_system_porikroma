package com.porikroma.config;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SocketIOConfig {

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname("localhost");
        config.setPort(9092);
        
        // CORS configuration for Engine.IO v4
        config.setOrigin("http://localhost:3000");
        config.setAllowCustomRequests(true);
        
        // Transport and protocol settings
        config.setMaxFramePayloadLength(1024 * 1024);
        config.setMaxHttpContentLength(1024 * 1024);
        config.setPingTimeout(60000);
        config.setPingInterval(25000);
        
        return new SocketIOServer(config);
    }
}
