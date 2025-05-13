import { createApi, createAxiosInstance } from '@/lib/axios';
import { EventStatus } from "@/utils/enums";

export interface Event {
    title: string;
    description: string;
    image: string;
    type: string;
    status: EventStatus;
    link?: string;
    organizer: string;
    startDate: string;
    endDate: string;
  }
  
const eventService = {
    async get(){
        try{
            // const axios = await createAxiosInstance({useToken:false})
            // if(!axios){
            //     throw new Error("Failed to create axios instance");
            // }
            // const res = await axios.get("/event")
            // return res.data.data;
            const res = await createApi().get("/event")
            return res.data.data;
        }
        catch(error){
            console.error("Error getting events:", error);
            return null;
        }
    },

    async participate(eventId: string): Promise<any>{
        try{
            const axios = await createAxiosInstance({useToken:true})
            if(!axios){
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.post(`/event/${eventId}/participate`)
            return res.data.data;
        }
        catch(error){
            console.error("Error participating in event:", error);
            throw error;
        }
    },
    async cancelParticipation(eventId: string): Promise<any>{
        try{
            const axios = await createAxiosInstance({useToken:true})
            if(!axios){
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.delete(`/event/${eventId}/participate`)
            return res.data.data;
        }
        catch(error){
            console.error("Error canceling participation in event:", error);
            throw error;
        }
    },
    
    async getUpcomingEvents(){
        try{
            const axios = await createAxiosInstance({useToken:false})
            if(!axios){
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.get("/event/upcoming")
            return res.data.data;
        }
        catch(error){
            console.error("Error getting upcoming events:", error);
            return null;
        }
    },

    async getEventById(eventId: string){
        try{
            const axios = await createAxiosInstance({useToken:false})
            if(!axios){
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.get(`/event/${eventId}`)
            return res.data.data;
        }
        catch(error){
            console.error("Error getting event by ID:", error);
            return null;
        }
    },

    async getEventParticipated(){
        try{
            const axios = await createAxiosInstance({useToken:true})
            if(!axios){
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.get("/event/has-participated")
            return res.data.data;
        }
        catch(error){
            console.error("Error getting participated events:", error);
            return null;
        }
    }

}

export default eventService;
