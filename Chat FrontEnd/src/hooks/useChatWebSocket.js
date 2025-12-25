import { useState, useEffect, useRef, useCallback } from 'react';

export const useChatWebSocket = (roomId, username) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!roomId || !username) return;

        // Construct WebSocket URL
        // Backend uses /chat/{roomId}?username={username}
        const wsUrl = `ws://localhost:8080/chat/${roomId}?username=${username}`;

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log(`Connected to room ${roomId}`);
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            const message = event.data;
            // Message format from backend: "Sender : Content"
            // We might want to parse it if validation allows, otherwise just store raw string
            // or try to parse sender/content.
            // Backend code: session.sendMessage(new TextMessage(msg.getSender() + " : " + msg.getContent()));

            // Let's store it as object { sender, content, id }
            // We need to parse "Sender : Content"
            // Assuming naive split for now
            const separatorIndex = message.indexOf(' : ');
            if (separatorIndex !== -1) {
                const sender = message.substring(0, separatorIndex);
                const content = message.substring(separatorIndex + 3);
                setMessages((prev) => [...prev, { sender, content, timestamp: new Date() }]);
            } else {
                // System message or unexpected format
                setMessages((prev) => [...prev, { sender: 'System', content: message, timestamp: new Date() }]);
            }
        };

        socket.onclose = () => {
            console.log(`Disconnected from room ${roomId}`);
            setIsConnected(false);
        };

        socket.onerror = (error) => {
            console.error(`WebSocket error in room ${roomId}:`, error);
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
        };
    }, [roomId, username]);

    const sendMessage = useCallback((content) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(content); // Backend expects raw string or JSON? 
            // Backend: messageService.saveMessage(message.getPayload(), ...)
            // It treats payload as content. 
            // And in handleTextMessage: s.sendMessage(new TextMessage(username + " : " + message.getPayload()));
            // So we just send the content string.

            // Optimistically add message to local state since backend doesn't echo it back to sender
            setMessages((prev) => [...prev, {
                sender: username,
                content,
                timestamp: new Date()
            }]);
        }
    }, [username]);

    return { messages, isConnected, sendMessage };
};
