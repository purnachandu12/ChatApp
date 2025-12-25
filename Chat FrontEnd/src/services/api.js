import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Adjust base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createRoom = async (roomName, username) => {
    try {
        const response = await api.post('/rooms', null, {
            params: { roomName, username },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
};

export const getRoom = async (roomId) => {
    try {
        const response = await api.get(`/rooms/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching room:', error);
        throw error;
    }
};

export default api;
