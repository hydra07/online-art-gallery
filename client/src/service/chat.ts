"use server";
import axios, { createApi } from '@/lib/axios';
import axiosInstance from 'axios';

export async function sendMessage({
    senderId,
    receiverId,
    message,
    replyTo = "",
  }: {
    senderId: string;
    receiverId: string;
    message: string;
    replyTo?: string;
  }) {
    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        senderId,
        receiverId,
        message,
        replyTo,
      });
  
      if (res.status === 201) {
        return res.data;
      } else {
        console.error(`❌ Failed to send message: ${res.statusText}`);
      }
    } catch (err) {
      console.error("❌ Error when sending message:", err);
    }
  }

  export async function getMessages(senderId: string, receiverId: string) {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chat/user/${senderId}/${receiverId}`
      );
  
      return res.data;
    } catch (err) {
      console.error("❌ Error when fetching messages:", err);
      return [];
    }
  }
  
