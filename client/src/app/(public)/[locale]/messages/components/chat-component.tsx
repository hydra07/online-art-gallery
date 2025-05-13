"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getMessages } from "@/service/chat";

type Message = {
  _id: string;
  sender: {
    _id: string;
    name: string;
    image?: string;
  };
  message: string;
  createdAt: string;
};

const senderId = "67cd36834fb221b559af9256"; // Giả sử người dùng hiện tại có ID này
const receiverId = "67a62dcb515d7caf247ff595"; // ID người nhận

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      const data = await getMessages(senderId, receiverId);
      setMessages(data);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      _id: Date.now().toString(),
      sender: { _id: senderId, name: "You" },
      message: input,
      createdAt: new Date().toISOString(),
    };

    // Cập nhật UI trước khi gửi API (tăng UX)
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      await axios.post("http://localhost:5000/api/chat/send", {
        senderId,
        receiverId,
        message: input,
      });
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col w-full h-full border rounded-lg bg-white shadow-lg">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">
            Hãy trò chuyện lịch sự cùng nhau nhé!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender._id === senderId ? "justify-end" : "justify-start"
              }`}
            >
              <div className="p-3 rounded-2xl max-w-[80%] bg-gray-100 text-gray-800">
                <strong>{msg.sender.name}:</strong> {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 border rounded-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-full"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
