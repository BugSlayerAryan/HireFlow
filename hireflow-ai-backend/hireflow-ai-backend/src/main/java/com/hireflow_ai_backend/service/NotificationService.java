package com.hireflow_ai_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendToUser(String email, String title, String message) {
        messagingTemplate.convertAndSendToUser(
                email,
                "/queue/notifications",
                Map.of("title", title, "message", message));
    }

    public void sendToTopic(String topic, String title, String message) {
        messagingTemplate.convertAndSend(
                "/topic/" + topic,
                Map.of("title", title, "message", message));
    }
}
