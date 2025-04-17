"use client";

import {useState, useEffect, useRef} from "react";
import {io, Socket} from "socket.io-client";
import styles from "./Chat.module.scss";
import ChatSettings from "./ChatSettings";
import {convertRomajiToHiragana} from "../utils/romajiToHiragana";
import {useImeStatus} from "../hooks/useImeStatus";

interface Message {
  text: string;
  sender: string;
  timestamp: Date;
  userId: string;
}

interface TypingUser {
  userId: string;
  username: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [bugFreezeConfig, setBugFreezeConfig] = useState({
    blockedHiragana: ["あ", "い", "う", "え", "お"],
    freezeProbability: 0.3,
    bugHiragana: ["か", "き", "く", "け", "こ"],
    bugProbability: 0.7,
  });
  const isImeActive = useImeStatus();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

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

    newSocket.on("userTyping", (data) => {
      console.log("Received userTyping event:", data);
      setTypingUsers((prev) => {
        if (!prev.some((user) => user.userId === data.userId)) {
          return [...prev, {userId: data.userId, username: data.username}];
        }
        return prev;
      });
    });

    newSocket.on("userStoppedTyping", (data) => {
      console.log("Received userStoppedTyping event:", data);
      setTypingUsers((prev) =>
        prev.filter((user) => user.userId !== data.userId)
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    // アルファベット、ひらがな、記号（-、。、、）を許可
    const filteredText = inputText.replace(/[^a-zA-Z\u3040-\u309F\-\.\,]/g, "");

    setRawInput(filteredText);

    // ローマ字をひらがなに変換
    let convertedText = convertRomajiToHiragana(filteredText.toLowerCase());

    // バグ・フリーズモードの場合
    if (selectedOption === "option1") {
      const lastChar = convertedText[convertedText.length - 1];
      console.log("lastChar", lastChar);

      // フリーズ判定
      if (lastChar && bugFreezeConfig.blockedHiragana.includes(lastChar)) {
        if (Math.random() < bugFreezeConfig.freezeProbability) {
          // フリーズ発生：入力を受け付けない
          console.log("フリーズ発生！", lastChar);
          convertedText = convertedText.slice(0, -1);
        }
      }

      // バグ（繰り返し）判定
      if (lastChar && bugFreezeConfig.bugHiragana.includes(lastChar)) {
        console.log("バグ判定");
        if (Math.random() < bugFreezeConfig.bugProbability) {
          // バグ発生：2~3回ランダムに繰り返す
          const repeatCount = Math.floor(Math.random() * 2) + 2; // 2 or 3
          console.log("バグ発生！", lastChar, "を", repeatCount, "回繰り返し");
          convertedText =
            convertedText.slice(0, -1) + lastChar.repeat(repeatCount);
        }
      }
    }

    setMessage(convertedText);

    if (socket) {
      const socketId = socket.id || "unknown";
      const currentUsername = username.trim() || `User-${socketId.slice(0, 4)}`;
      // タイピング開始を通知
      socket.emit("typingStart", {username: currentUsername});

      // 既存のタイマーをクリア
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // 3秒後にタイピング終了を通知
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typingStop", {username: currentUsername});
      }, 3000);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const socketId = socket.id || "unknown";
      const currentUsername = username.trim() || `User-${socketId.slice(0, 4)}`;
      const newMessage: Message = {
        text: message,
        sender: currentUsername,
        timestamp: new Date(),
        userId: socketId,
      };
      console.log("Sending message:", newMessage);
      socket.emit("message", newMessage);
      socket.emit("typingStop", {username: currentUsername});
      setMessage("");
      setRawInput("");
    }
  };

  const handleThemeChange = (theme: string) => {
    console.log("Theme changed to:", theme);
    // テーマ変更の実装
  };

  const handleLanguageChange = (language: string) => {
    console.log("Language changed to:", language);
    // 言語変更の実装
  };

  const handleNotificationChange = (enabled: boolean) => {
    console.log("Notifications:", enabled ? "enabled" : "disabled");
    // 通知設定の実装
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleDebugChange = (settings: {
    blockedHiragana: string[];
    freezeProbability: number;
    bugHiragana: string[];
    bugProbability: number;
  }) => {
    setBugFreezeConfig(settings);
  };

  return (
    <div className={styles.chatContainer}>
      {isImeActive && (
        <div className={styles.imeWarning}>IMEを無効にしてください</div>
      )}
      <ChatSettings
        onOptionChange={handleOptionChange}
        onDebugChange={handleDebugChange}
      />
      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.userId === socket?.id
                ? styles.userMessage
                : styles.otherMessage
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
        {typingUsers.length > 0 && (
          <div className={styles.typingIndicator}>
            {typingUsers.map((user) => (
              <span key={user.userId}>{user.username} is typing...</span>
            ))}
          </div>
        )}
        {selectedOption === "option1" && (
          <div className={styles.bugFreezeInfo}>
            freeze: {bugFreezeConfig.blockedHiragana.join("、")} bug:{" "}
            {bugFreezeConfig.bugHiragana.join("、")}
          </div>
        )}
        <div className={styles.inputGroup}>
          <label
            htmlFor="username"
            style={{width: "3rem", lineHeight: "2rem", marginRight: "3rem"}}
          >
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.usernameInput}
            placeholder="Enter your name..."
          />
        </div>
        <div className={styles.inputGroup}>
          <label
            htmlFor="message"
            style={{width: "3rem", lineHeight: "2rem", marginRight: "3rem"}}
          >
            Message
          </label>
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            className={styles.messageInput}
            placeholder="Type a message..."
          />
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </div>
        <p className={styles.note}>
          注意：ページをリロードすると会話履歴が削除されます
        </p>
      </form>
    </div>
  );
}
