package com.chandu.demo.Services;

import com.chandu.demo.Model.Room;
import com.chandu.demo.Services.MessageService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class RoomService {

    @PersistenceContext
    private EntityManager entityManager;

    private final MessageService messageService;

    public RoomService(MessageService messageService) {
        this.messageService = messageService;
    }

    // Create a new room
    public Room createRoom(String userName, int durationMinutes,String roomName) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);
        Room room = new Room(userName, now, expiresAt, true,roomName);
        entityManager.persist(room);
        return room;
    }

    // Get a room by ID if still active and not expired
    public Room getRoomById(int roomId) {
        Room room = entityManager.find(Room.class, roomId);
        if (room == null) return null;

        Date now = new Date();
        if (room.getExpiredAt().before(now)) {
            deleteRoom(roomId);
            return null;
        }
        return room;
    }

    // Delete a room manually or automatically on expiry
    public void deleteRoom(int roomId) {
        Room room = entityManager.find(Room.class, roomId);
        if (room != null) {
            messageService.deleteMessagesByRoomId(String.valueOf(roomId));
            entityManager.remove(room);
        }
    }


    // Automatically remove expired rooms every minute
    @Scheduled(fixedRate = 60000)
    public void removeExpiredRooms() {
        Date now = new Date();
        String jpql = "SELECT r FROM Room r WHERE r.expiredAt < :now";
        TypedQuery<Room> query = entityManager.createQuery(jpql, Room.class);
        query.setParameter("now", now);
        List<Room> expiredRooms = query.getResultList();

        for (Room r : expiredRooms) {
            System.out.println("Deleting expired room: " + r.getId());
            deleteRoom(r.getId());
        }
    }

    public Room getActiveRoomByName(String roomName) {
        String jpql = "SELECT r FROM Room r WHERE r.roomName = :roomName AND r.active = true";
        TypedQuery<Room> query = entityManager.createQuery(jpql, Room.class);
        query.setParameter("roomName", roomName);

        List<Room> results = query.getResultList();
        if (results.isEmpty()) {
            return null; // No active room found
        }
        return results.get(0); // Return the first match
    }

}
