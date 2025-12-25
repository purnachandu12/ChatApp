import React, { useState, useEffect, useRef } from 'react';
import { Send, Hash, Loader2 } from 'lucide-react';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { cn } from '../lib/utils';

const ChatWindow = ({ roomId, roomName, username }) => {
    const { messages, isConnected, sendMessage } = useChatWebSocket(roomId, username);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="h-16 border-b flex items-center px-6 justify-between bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                        <Hash className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg">{roomName}</h2>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>ID: {roomId}</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className={cn("flex items-center gap-1", isConnected ? "text-green-500" : "text-yellow-500")}>
                                <span className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-500" : "bg-yellow-500")} />
                                {isConnected ? "Connected" : "Connecting..."}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-muted-foreground">
                    Logged in as <span className="font-semibold text-foreground">{username}</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                    // System messages logic if sender is 'System' (from our hook fallback)
                    const isSystem = msg.sender === 'System';

                    // Robust comparison for "Is Me"
                    // Ensure we handle potential whitespace or case differences if backend didn't normalize
                    const isMe = msg.sender?.trim() === username?.trim();

                    if (isSystem) {
                        return (
                            <div key={index} className="flex justify-center my-2">
                                <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                                    {msg.content}
                                </div>
                            </div>
                        )
                    }

                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex w-full",
                                isMe ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                    isMe
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-card text-card-foreground border rounded-bl-none"
                                )}
                            >
                                {!isMe && (
                                    <div className="text-xs font-semibold mb-1 opacity-70">
                                        {msg.sender}
                                    </div>
                                )}
                                <div className="break-words">{msg.content}</div>
                                {msg.timestamp && (
                                    <div className={cn("text-[10px] mt-1 text-right opacity-60", isMe ? "text-primary-foreground" : "text-muted-foreground")}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Message #${roomId}...`}
                        className="flex-1 bg-background border px-4 py-2.5 rounded-full focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/60 shadow-sm"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !inputValue.trim()}
                        className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                    >
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
