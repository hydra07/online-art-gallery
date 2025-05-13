import { createAxiosInstance } from "@/lib/axios";
import { NotificationCreatePayload, NotificationResponse } from "@/types/notification";

class NotificationService {
  async getAdminNotifications(skip = 0, take = 10): Promise<NotificationResponse> {
    try {
      const axios = await createAxiosInstance({ useToken: true });
      if (!axios) {
        throw new Error("Failed to create axios instance");
      }
      const response = await axios.get(`/notification/admin?skip=${skip}&take=${take}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  async createNotification(payload: NotificationCreatePayload) {
    try {
      const axios = await createAxiosInstance({ useToken: true });
      if (!axios) {
        throw new Error("Failed to create axios instance");
      }
      const response = await axios.post("/notification/admin", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  async deleteNotification(id: string) {
    try {
      const axios = await createAxiosInstance({ useToken: true });
      if (!axios) {
        throw new Error("Failed to create axios instance");
      }
      const response = await axios.delete(`/notification/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}

export default new NotificationService();
