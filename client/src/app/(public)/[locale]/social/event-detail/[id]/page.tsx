'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import eventService from "@/service/event-service";
import { EventStatus } from "@/utils/enums";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  ExternalLink, 
  ArrowLeft,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const eventData = await eventService.getEventById(eventId);
      return eventData ? {
        ...eventData,
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
      } : null;
    },
    enabled: !!eventId,
  });

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would call a service to update bookmark status in the backend
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Check out this event: ${event?.title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.href);
      // You would normally show a toast notification here
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (error || !event) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <p className="mt-4 text-muted-foreground">
          The event you are looking for might have been removed or is no longer available.
        </p>
        <Link href="/social" className="mt-6 inline-block">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
              Back
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate if the event is upcoming, ongoing, or past
  const now = new Date();
  const isUpcoming = event.startDate > now;
  const isOngoing = event.startDate <= now && event.endDate >= now;
  const isPast = event.endDate < now;

  // Get event status label and color
  const getStatusDetails = () => {
    if (isPast) {
      return { label: "Completed", bgColor: "bg-gray-100", textColor: "text-gray-800" };
    } else if (isOngoing) {
      return { label: "Ongoing", bgColor: "bg-green-100", textColor: "text-green-800" };
    } else {
      return { label: "Upcoming", bgColor: "bg-blue-100", textColor: "text-blue-800" };
    }
  };
  

  const statusDetails = getStatusDetails();

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Back button */}
      <div className="container mx-auto pt-4 px-4">
        <Link href="/events">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Event header with hero image */}
          <div className="relative rounded-xl overflow-hidden shadow-xl mb-6 bg-gray-900">
            <div className="aspect-[16/9] relative">
              <Image 
                src={event.image}
                alt={event.title}
                fill
                className="object-cover opacity-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              <Badge className={`${statusDetails.bgColor} ${statusDetails.textColor} font-medium`}>
                {statusDetails.label}
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-none">
                  {event.type}
                </Badge>
                <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {formatDate(event.startDate)}
                </Badge>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-sm">
                {event.title}
              </h1>

              <div className="flex items-center gap-2 text-white/90 text-sm mt-4">
                <Users className="h-4 w-4" />
                <span>{event.participants.length} participants</span>
              </div>
            </div>
          </div>

          {/* Event details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Main content */}
            <div className="md:col-span-2 space-y-6">
              {/* Description card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">About This Event</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
              </div>

              {/* Organizer info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Organized by</h2>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {event.organizer.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{event.organizer}</p>
                    <p className="text-sm text-gray-500">Event Organizer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action buttons */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-medium text-gray-900 mb-4">Event Details</h3>
                
                <div className="space-y-4">
                  {/* Date and time */}
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-sm text-gray-600">{formatDate(event.startDate)}</p>
                      <p className="text-sm text-gray-600">
                        {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Status info */}
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-50 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Event Status</p>
                      <p className="text-sm text-gray-600">{event.status}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {event.link ? (
                    <a href={event.link} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Link to join
                      </Button>
                    </a>
                  ) : (
                    <Button disabled className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Link is updating
                    </Button>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Participants</h3>
                  <span className="text-sm text-gray-500">{event.participants.length} people</span>
                </div>
                
                {event.participants.length > 0 ? (
                  <div className="flex -space-x-2 overflow-hidden">
                    <TooltipProvider>
                      {/* Show first 5 participants */}
                      {[...Array(Math.min(5, event.participants.length))].map((_, index) => (
                        <Tooltip key={index}>
                          <TooltipTrigger>
                            <Avatar className="border-2 border-white">
                              <AvatarFallback className="bg-gray-200 text-gray-800">
                                {String.fromCharCode(65 + index)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Participant {index + 1}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      
                      {/* If more than 5 participants */}
                      {event.participants.length > 5 && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Avatar className="bg-gray-200 border-2 border-white">
                              <AvatarFallback className="text-gray-800">
                                +{event.participants.length - 5}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>And {event.participants.length - 5} more</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TooltipProvider>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No participants yet. Be the first to join!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto pt-4 px-4">
        <Button variant="ghost" size="sm" className="gap-2 mb-4" disabled>
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="relative rounded-xl overflow-hidden shadow-xl mb-6 bg-gray-800">
            <div className="aspect-[16/9] bg-gray-800" />
            <div className="absolute top-4 right-4">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Skeleton className="h-6 w-24 rounded-full mb-3" />
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main content skeletons */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <Skeleton className="h-8 w-40 mb-4" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar skeletons */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-28 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
                
                <Skeleton className="h-10 w-full mb-3" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-10 rounded-md" />
                  <Skeleton className="h-10 rounded-md" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-full border-2 border-white" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}