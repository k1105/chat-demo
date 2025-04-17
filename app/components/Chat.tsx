"use client";

import {useState, useEffect, useRef} from "react";
import {io, Socket} from "socket.io-client";
import styles from "./Chat.module.scss";

interface Message {
  text: string;
  sender: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3002";
    const newSocket = io(socketUrl);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("message", (message: Message) => {
      console.log("Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const newMessage: Message = {
        text: message,
        sender: "You",
        timestamp: new Date(),
      };
      console.log("Sending message:", newMessage);
      socket.emit("message", newMessage);
      setMessage("");
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.sender === "You" ? styles.userMessage : styles.otherMessage
            }`}
          >
            <div className={styles.sender}>{msg.sender}</div>
            <div>{msg.text}</div>
            <div className={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className={styles.messageForm}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.messageInput}
          placeholder="Type a message..."
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}
