"use client";

import {useState, useEffect, useRef} from "react";
import {io, Socket} from "socket.io-client";

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
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.sender === "You"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200"
            }`}
          >
            <div className="font-bold">{msg.sender}</div>
            <div>{msg.text}</div>
            <div className="text-xs opacity-70">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
