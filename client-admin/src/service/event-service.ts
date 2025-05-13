import { createApi } from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import axiosInstance from "axios";
import { createAxiosInstance } from '@/lib/axios';
import { EventStatus } from "@/utils/enums";
import { BaseNextResponse } from "next/dist/server/base-http";

export interface Event {
  title: string;
  description: string;
  image: string;
  type: string;
  status: EventStatus.UPCOMING;
  organizer: string;
  link: string;
  startDate: string;
  endDate: string;
}

export interface EventUpdate {
  title: string;
  description: string;
  image: string;
  type: string;
  status: EventStatus;
  organizer: string;
  startDate: string;
  endDate: string;
}
export interface EventDetail {
  _id: string;
  image: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
  organizer: string;
  userId: string;
  link: string;
  participants: any[]; // Use a more specific type if you know the structure
  createdAt: string;
  updatedAt: string;
  __v: number;
}
const eventService = {
  async get(){
    try{
      const axios = await createAxiosInstance({useToken:true})
      if (!axios) {
        throw new Error("Failed to create axios instance");
      }
      const res = await axios.get("/event")
      return res.data;
    }
    catch(error){
      console.error("Error getting events:", error);
      return null;
    }
  },
  async add(data: Event) {
    try {
      const axios = await createAxiosInstance({ useToken: true })
      if (!axios) {
        throw new Error("Failed to create axios instance");
      }
      const res = await axios.post("/event", data);
      return res.data;
    }
    catch (error) {
      console.error("Error adding event:", error);
      return null;
    }
  },
  async update(data: EventUpdate, id: string) {
    try {
      const axios = await createAxiosInstance({ useToken: true })
      if (!axios) {

        throw new Error("Failed to create axios instance");
      }
      const res = await axios.put(`/event/${id}`, data);
      return res.data;
    }
    catch (error) {
      console.error("Error adding event:", error);
      return null;
    }
  },
  async getById(id: string): Promise<ApiResponse<EventDetail> | null> {
    try {
      const axios = await createAxiosInstance({ useToken: true })
      if (!axios) {
        throw new Error("Failed to create axios instance");
      }
      const res = await axios.get(`/event/${id}`)
      return res.data;
    }
    catch (error) {
      console.error("Error getting event by ID:", error);
      return null;
    }
  },
  
  async delete(id: string) {
    try{
      const axios = await createAxiosInstance({useToken:true})
      if (!axios) {
        throw new Error("Failed to create axios instance");
      }
      const res = await axios.delete(`/event/${id}`)
      return res.data;
    }
    catch(error){
      console.error("Error deleting event:", error);
      return null;
    }
  }
  
};

export default eventService;