import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { getRoom } from '../services/api';

const JoinRoomModal = ({ onClose, onJoinRoom }) => {
    const [roomId, setRoomId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!roomId) {
            setError("Room ID is required");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const roomData = await getRoom(roomId);
            // Backend likely returns 'room_name' based on getter getRoom_name() or standard mapping
            const realName = roomData.room_name || roomData.roomName || `Room ${roomId}`;
            onJoinRoom({ id: roomId, name: realName });
            onClose();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 404) {
                setError("Room not found");
            } else {
                setError("Failed to join room. Please check ID.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-xl border animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Join Existing Room</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Room ID</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary focus:outline-none mb-2"
                            placeholder="e.g. 1"
                            autoFocus
                        />
                    </div>

                    {error && <div className="text-sm text-destructive">{error}</div>}

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent hover:text-accent-foreground"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 flex items-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Join
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinRoomModal;
