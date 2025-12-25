package com.chandu.demo.Model;

import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.Date;

@Entity
@Table(name="room")
public class Room{

    @Id
    @Column(name="id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="username")
    private String userName;

    @Column(name="created_at")
    private Date createdAt;

    @Column(name="expires_at")
    private Date expiredAt;

    @Column(name="active")
    private boolean active;

    @Column(name="room_name")
    private String roomName;

    public Room(){}


    public Room(String userName, Date createdAt, Date expiredAt, boolean active,String roomName) {
        this.userName = userName;
        this.createdAt = createdAt;
        this.expiredAt = expiredAt;
        this.active = active;
        this.roomName=roomName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getExpiredAt() {
        return expiredAt;
    }

    public void setExpiredAt(Date expiredAt) {
        this.expiredAt = expiredAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getRoom_name() {
        return roomName;
    }

    public void setRoom_name(String roomName) {
        this.roomName = roomName;
    }
}
