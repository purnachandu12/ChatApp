import React from 'react';
import { Plus, LogIn, MessageSquare, X } from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = ({
    rooms,
    activeRoomId,
    onSwitchRoom,
    onCloseRoom,
    onOpenCreateModal,
    onOpenJoinModal
}) => {
    return (
        <div className="w-64 bg-card border-r flex flex-col h-full shadow-sm">
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Chat App
                </h1>
                <p className="text-xs text-muted-foreground mt-1">Multi-room Interface</p>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {rooms.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground text-sm">
                        No active rooms. Create or join one to start chatting.
                    </div>
                ) : (
                    rooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={() => onSwitchRoom(room.id)}
                            className={cn(
                                "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                                activeRoomId === room.id
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <MessageSquare className="w-4 h-4 shrink-0" />
                                <div className="truncate">
                                    <div className="font-medium text-sm truncate">{room.name}</div>
                                    <div className="text-xs opacity-70 truncate">ID: {room.id}</div>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCloseRoom(room.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 hover:bg-background/50 p-1 rounded-full transition-all"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t space-y-2">
                <button
                    onClick={onOpenCreateModal}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" /> Create Room
                </button>
                <button
                    onClick={onOpenJoinModal}
                    className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    <LogIn className="w-4 h-4" /> Join Room
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
