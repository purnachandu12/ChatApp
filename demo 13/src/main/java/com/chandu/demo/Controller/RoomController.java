package com.chandu.demo.Controller;

import com.chandu.demo.Model.Room;
import com.chandu.demo.Services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping("/rooms")
    public ResponseEntity<?> createRoom(
            @RequestParam String username,
            @RequestParam String roomName,
            @RequestParam(defaultValue = "60") int expiryMinutes) {

        Room room = roomService.createRoom(username, expiryMinutes, roomName);

        // Return room details (ID, name, expiry)
        Map<String, Object> response = new HashMap<>();
        response.put("roomId", room.getId());
        response.put("roomName", room.getRoom_name());
        response.put("createdBy", room.getUserName());
        response.put("expiresAt", room.getExpiredAt());

        return ResponseEntity.ok(response);
    }


    // Optional: Get room details
    @GetMapping("/rooms/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable int id) {
        Room room = roomService.getRoomById(id);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(room);
    }
}
