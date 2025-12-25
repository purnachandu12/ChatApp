package com.chandu.demo.Config;

import com.chandu.demo.Model.Message;
import com.chandu.demo.Model.Room;
import com.chandu.demo.Services.MessageService;
import com.chandu.demo.Services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.util.*;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final Map<Integer, Set<WebSocketSession>> activeSessions = Collections.synchronizedMap(new HashMap<>());
    private final Map<WebSocketSession, Integer> sessionRoomMap = Collections.synchronizedMap(new HashMap<>());

    @Autowired
    private RoomService roomService;

    @Autowired
    private MessageService messageService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String username = extractUserName(session);
        String roomIdParam = extractRoomId(session);

        int roomId;
        try {
            roomId = Integer.parseInt(roomIdParam);
        } catch (NumberFormatException e) {
            System.out.println("Invalid room ID format: " + roomIdParam);
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        // ✅ Check if room exists (must be created via REST API)
        Room room = roomService.getRoomById(roomId);
        if (room == null) {
            System.out.println("Room not found: " + roomId);
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        // Store mapping
        sessionRoomMap.put(session, roomId);

        // Add to active sessions
        activeSessions.computeIfAbsent(roomId, k -> Collections.synchronizedSet(new HashSet<>())).add(session);

        System.out.println(username + " joined room: " + room.getRoom_name() + " (ID: " + roomId + ")");

        // ✅ Send chat history from DB
        List<Message> history = messageService.getMessagesByRoomId(String.valueOf(roomId));
        for (Message msg : history) {
            session.sendMessage(new TextMessage(msg.getSender() + " : " + msg.getContent()));
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String username = extractUserName(session);
        Integer roomId = sessionRoomMap.get(session);

        if (roomId == null) {
            System.out.println("Room not found for this session");
            return;
        }

        // Save message in DB
        messageService.saveMessage(message.getPayload(), String.valueOf(roomId), username);

        // Broadcast to all users in this room
        Set<WebSocketSession> sessions = activeSessions.get(roomId);
        if (sessions != null) {
            for (WebSocketSession s : sessions) {
                if (s.isOpen() && s != session) {
                    s.sendMessage(new TextMessage(username + " : " + message.getPayload()));
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Integer roomId = sessionRoomMap.remove(session);
        if (roomId == null) return;

        Set<WebSocketSession> sessions = activeSessions.get(roomId);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                activeSessions.remove(roomId);
                System.out.println("No active users in room: " + roomId);
            }
        }
        System.out.println("Disconnected : " + session.getId());
    }

    // Extract roomId from path, e.g. /chat/42
    private String extractRoomId(WebSocketSession session) {
        String uri = Objects.requireNonNull(session.getUri()).toString();
        String[] parts = uri.split("/");
        String last = parts[parts.length - 1];
        if (last.contains("?")) {
            last = last.substring(0, last.indexOf("?"));
        }
        return last;
    }

    // Extract username from query parameter
    private String extractUserName(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri == null || uri.getQuery() == null) return "Anonymous";

        String query = uri.getQuery();
        for (String param : query.split("&")) {
            if (param.startsWith("username=")) {
                return param.substring("username=".length());
            }
        }
        return "Anonymous";
    }
}
