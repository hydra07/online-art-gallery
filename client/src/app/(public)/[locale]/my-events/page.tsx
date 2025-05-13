"use client";

import { useQuery } from "@tanstack/react-query";
import eventService from "@/service/event-service";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { EventStatus } from "@/utils/enums";
export interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  type: string;
  status: EventStatus;
  organizer: string;
  startDate: string;
  endDate: string;
  participants: {
    userId: string
  }[];
  link: string;
}

export default function MyEvents() {
  const { data: participatedEvents, isLoading, error } = useQuery({
    queryKey: ["participatedEvents"],
    queryFn: eventService.getEventParticipated,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <h2 className="text-xl font-bold">Error loading events</h2>
        <p>{(error as Error).message || "Please try again later"}</p>
      </div>
    );
  }

  if (!participatedEvents || participatedEvents.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold">No events found</h2>
        <p>You haven't participated in any events yet.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">Ongoing</span>;
      case 'UPCOMING':
        return <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">Upcoming</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">Completed</span>;
      
      default:
        return <span className="px-2 py-1 bg-gray-300 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Participated Events</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {participatedEvents.map((event:Event) => (
          <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="flex flex-col md:flex-row">
              {/* Image section */}
              <div className="md:w-1/4 h-48 md:h-auto relative">
                {event.image ? (
                  <Image 
                    src={event.image} 
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              
              {/* Content section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
                  {getStatusBadge(event.status)}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span className="text-sm">
                      {format(new Date(event.startDate), 'dd MMM yyyy')} - {format(new Date(event.endDate), 'dd MMM yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-2" />
                    <span className="text-sm">Organized by: {event.organizer}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    <span className="text-sm">Type: {event.type}</span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Link 
                    href={`/social/event-detail/${event._id}`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}