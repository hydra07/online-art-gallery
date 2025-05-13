import { createAxiosInstance } from "@/lib/axios";
import type BaseResponse from "@/types/response";
export interface Notification {
    _id: string;
    title: string;
    content?: string;
    isRead: boolean;
    isSystem: boolean;
    refType: string;
    refId?: string; // Add optional refId field for navigation
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }
const PAGE_SIZE = 5;
const notificationService = {
    async fetchNotifications({ pageParam = 0 }) {
      const axiosInstance = await createAxiosInstance({ useToken: true });
      if (!axiosInstance) return null;
      
      const res = await axiosInstance.get<BaseResponse<{
        notifications: Notification[];
        total: number;
      }>>(
        `/notification?take=${PAGE_SIZE}&skip=${pageParam * PAGE_SIZE}`
      );
      
      return {
        notifications: res.data.data.notifications,
        total: res.data.data.total,
        nextPage: res.data.data.notifications.length === PAGE_SIZE ? pageParam + 1 : undefined
      };
    },
    
    // Update fetchUnreadCount to ensure it always returns a valid value
    async  fetchUnreadCount() {
      try {
        const axiosInstance = await createAxiosInstance({ useToken: true });
        if (!axiosInstance) return 0;
        
        const res = await axiosInstance.get('/notification/unread');
        // Ensure we return 0 if data is undefined or null
        return res.data?.data || 0;
      } catch (error) {
        console.error("Error fetching unread count:", error);
        return 0; // Always return a default value on error
      }
    },
    
    async  markAsRead(id?: string) {
      const axiosInstance = await createAxiosInstance({ useToken: true });
      if (!axiosInstance) return null;
      const url = id ? `/notification/read/${id}` : '/notification/read';
      const res = await axiosInstance.put(url);
      return res.data;
    },
    
    async deleteNotification(id: string) {
      const axiosInstance = await createAxiosInstance({ useToken: true });
      if (!axiosInstance) return null;
      
      const res = await axiosInstance.delete(`/notification/delete/${id}`);
      return res.data;
    }
} 
export default notificationService;