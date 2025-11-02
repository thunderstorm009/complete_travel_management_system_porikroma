package com.porikroma.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/debug")
public class DebugController {

    @GetMapping("/user-info")
    public ResponseEntity<Map<String, Object>> getUserInfo(HttpServletRequest request) {
        Map<String, Object> debug = new HashMap<>();
        debug.put("userId", request.getAttribute("userId"));
        debug.put("userRole", request.getAttribute("userRole"));
        debug.put("authHeader", request.getHeader("Authorization"));
        return ResponseEntity.ok(debug);
    }
}