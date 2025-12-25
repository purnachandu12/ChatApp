package com.chandu.demo.Model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Message {

    @Column(name="id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="content")
    private String Content;

    @Column(name="room_id")
    private String roomId;

    @Column(name="sender")
    private String Sender;

    @Column(name="timeStamp")
    private Date timeStamp;

    public Message(){}


    public Message(String content, String roomId, String sender, Date timeStamp) {
        Content = content;
        this.roomId = roomId;
        Sender = sender;
        this.timeStamp = timeStamp;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return Content;
    }

    public void setContent(String content) {
        Content = content;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getSender() {
        return Sender;
    }

    public void setSender(String sender) {
        Sender = sender;
    }

    public Date getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Date timeStamp) {
        this.timeStamp = timeStamp;
    }

}
