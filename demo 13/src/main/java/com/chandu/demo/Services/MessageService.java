package com.chandu.demo.Services;

import com.chandu.demo.Model.Message;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class MessageService {

    @PersistenceContext
    private EntityManager entityManager;

    // Save a new message
    public void saveMessage(String content, String roomId, String sender) {
        Message message = new Message(content, roomId, sender, new Date());
        entityManager.persist(message);
    }

    // Fetch all messages for a given room, ordered by timestamp
    public List<Message> getMessagesByRoomId(String roomId) {
        String jpql = "SELECT m FROM Message m WHERE m.roomId = :roomId ORDER BY m.timeStamp ASC";
        TypedQuery<Message> query = entityManager.createQuery(jpql, Message.class);
        query.setParameter("roomId", roomId);
        return query.getResultList();
    }

    // Delete all messages in a room (when room expires)
    public void deleteMessagesByRoomId(String roomId) {
        String jpql = "DELETE FROM Message m WHERE m.roomId = :roomId";
        entityManager.createQuery(jpql)
                .setParameter("roomId", roomId)
                .executeUpdate();
    }
}
