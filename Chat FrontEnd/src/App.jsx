import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import CreateRoomModal from './components/CreateRoomModal';
import JoinRoomModal from './components/JoinRoomModal';
import LoginScreen from './components/LoginScreen';
import { MessageSquareDashed } from 'lucide-react';

function App() {
  const [username, setUsername] = useState('');
  const [rooms, setRooms] = useState([]); // Array of { id, name, username }
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  if (!username) {
    return <LoginScreen onLogin={setUsername} />;
  }

  const handleRoomCreated = (room) => {
    // Room object from API: { roomId, roomName, createdBy, expiresAt }
    const newRoom = {
      id: room.roomId,
      name: room.roomName,
      username: username, // Use global username
    };
    setRooms(prev => [...prev, newRoom]);
    setActiveRoomId(newRoom.id);
  };

  const handleJoinRoom = ({ id, name }) => {
    // Check if already joined
    if (rooms.find(r => r.id == id)) {
      setActiveRoomId(id);
      return;
    }

    const newRoom = {
      id,
      name, // Might be "Room ID" if we don't fetch details
      username: username
    };
    setRooms(prev => [...prev, newRoom]);
    setActiveRoomId(id);
  };

  const handleCloseRoom = (roomId) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
    if (activeRoomId === roomId) {
      setActiveRoomId(null);
    }
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar
        rooms={rooms}
        activeRoomId={activeRoomId}
        onSwitchRoom={setActiveRoomId}
        onCloseRoom={handleCloseRoom}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
      />

      <div className="flex-1 flex flex-col relative w-full h-full">
        {activeRoom ? (
          <ChatWindow
            key={activeRoom.id} // Re-mount when room changes to reset hooks? Or let hook handle ID change.
            // Using key ensures clean state wipe when switching rooms instantly.
            roomId={activeRoom.id}
            roomName={activeRoom.name}
            username={activeRoom.username}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center animate-in fade-in duration-500">
            <div className="bg-secondary/50 p-6 rounded-full mb-6">
              <MessageSquareDashed className="w-16 h-16 opacity-50" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome, {username}!</h2>
            <p className="max-w-md">
              Create a new room or join an existing one to start chatting.
              You can be in multiple rooms at once!
            </p>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateRoomModal
          username={username}
          onClose={() => setIsCreateModalOpen(false)}
          onRoomCreated={handleRoomCreated}
        />
      )}

      {isJoinModalOpen && (
        <JoinRoomModal
          onClose={() => setIsJoinModalOpen(false)}
          onJoinRoom={handleJoinRoom}
        />
      )}
    </div>
  );
}

export default App;
