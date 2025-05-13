'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Clock, Share2, Info, ExternalLink, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import eventService from '@/service/event-service';
import { EventStatus } from '@/utils/enums';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useAuthClient from '@/hooks/useAuth-client';
import { useQueryClient } from '@tanstack/react-query';
import { AuthDialog } from '@/components/ui.custom/auth-dialog';
import { useRouter } from 'next/navigation';

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

export function EventFeed() {
  const router = useRouter(); // Add router
  const { user } = useAuthClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  // Helper function to get status badge color
  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.UPCOMING:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case EventStatus.ONGOING:
        return 'bg-green-500 hover:bg-green-600 text-white';
      case EventStatus.COMPLETED:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const events = await eventService.get();
      return events.map((event: Event) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }));
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check if user has participated in the event
  const isParticipated = (event: Event) => {
    if (!user) return false;
    if (!user.id) return false;
    return event.participants.some(participant =>
      participant.userId === user.id
    );
  };

  // Check if event is completed
  const isEventCompleted = (event: Event) => {
    return event.status === EventStatus.COMPLETED;
  };

  const mutationRegister = useMutation({
    mutationFn: async (eventId: string) => {
      try {
        const result = await eventService.participate(eventId);
        return result;
      } catch (error: any) {
        // Explicitly throw the error with the response data
        console.log("Error in mutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "You have successfully registered for the event",
        className: 'bg-green-500 text-white border-green-600'
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      console.log("onError received:", error);
      
      // Get error message from API response or use default message
      const errorMessage = error?.response?.data?.message || "Failed to register for the event";
      const errorCode = error?.response?.data?.errorCode;
      
      if (errorCode === 'user_banned') {
        toast({
          title: "Account Restricted",
          description: "Your account has been banned. You cannot participate in events.",
          className: 'bg-red-500 text-white border-red-600'
        });
      } else {
        toast({
          title: "Registration failed",
          description: errorMessage,
          className: 'bg-red-500 text-white border-red-600'
        });
      }
    }
  });

  const mutationCancel = useMutation({
    mutationFn: async (eventId: string) => {
      try {
        const result = await eventService.cancelParticipation(eventId);
        return result;
      } catch (error: any) {
        // Explicitly throw the error with the response data
        console.log("Error in cancel mutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Cancellation successful",
        description: "You have successfully cancelled your registration",
        className: 'bg-green-500 text-white border-green-600'

      })
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      console.log("onError received in cancel:", error);
      
      // Get error message from API response or use default message
      const errorMessage = error?.response?.data?.message || "Failed to cancel your registration";
      const errorCode = error?.response?.data?.errorCode;
      
      if (errorCode === 'user_banned') {
        toast({
          title: "Account Restricted",
          description: "Your account has been banned. You cannot perform this action.",
          className: 'bg-red-500 text-white border-red-600'
        });
      } else {
        toast({
          title: "Cancellation failed",
          description: errorMessage,
          className: 'bg-red-500 text-white border-red-600'
        });
      }
    }
  })

  const handleParticipate = (eventId: string) => {
    // If user is not logged in, show auth dialog
    if (!user) {
      setIsOpen(true);
      return;
    }
    
    const event = data?.find((event: Event) => event._id === eventId);
    
    // Don't proceed if event is completed or not found
    if (!event || isEventCompleted(event)) {
      return;
    }
    
    // If user is already participating, cancel their registration
    // Otherwise, register them for the event
    if (isParticipated(event)) {
      cancelParticipate(eventId);
    } else {
      onParticipate(eventId);
    }
  };

  // Function to register for an event
  const onParticipate = (eventId: string) => {
    mutationRegister.mutate(eventId);
  }

  // Function to cancel event registration
  const cancelParticipate = (eventId: string) => {
    mutationCancel.mutate(eventId);
  }

  // Format date and time functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate description to show only first 100 characters
  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Add navigation handler
  const navigateToEventDetail = (eventId: string) => {
    router.push(`/social/event-detail/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 place-items-center max-w-7xl mx-auto px-4">
      <AuthDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      {data?.map((event: Event) => (
        <Card
          key={event._id}
          className="overflow-hidden w-full max-w-[700px] transition-all duration-300 hover:shadow-lg cursor-pointer"
          onClick={() => navigateToEventDetail(event._id)} // Add onClick handler
        >
          <div className="relative aspect-[16/9]">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 700px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl md:text-2xl font-bold">{event.title}</h2>
                <Badge className={getStatusColor(event.status)}>
                  {EventStatus[event.status]}
                </Badge>
              </div>
              <div className="flex items-center text-white/90 text-sm">
                <CalendarDays className="mr-1 h-4 w-4" />
                <span className="font-medium">{formatDate(new Date(event.startDate))}</span>
                {event.type && (
                  <div className="ml-3 flex items-center">
                    <Tag className="mr-1 h-3 w-3" />
                    <span>{event.type}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mb-4 cursor-pointer group relative">
                    <p className="text-muted-foreground text-sm md:text-base inline-flex items-center">
                      {truncateDescription(event.description)}
                      <Info className="inline-block ml-1 h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="start"
                  className="max-w-sm p-4 bg-sky-400 border border-sky-500 shadow-lg text-black rounded-lg transition-all duration-300"
                  sideOffset={5}
                >
                  <p className="text-sm leading-relaxed font-medium sky-gray-400">{event.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-2">Event Schedule</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <div className="mb-1">
                          <span className="font-medium">Start date:</span> {formatDate(new Date(event.startDate))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <div className="mb-1">
                          <span className="font-medium">End date:</span> {formatDate(new Date(event.endDate))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      <span className="font-medium">Start:</span> {formatTime(new Date(event.startDate))}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      <span className="font-medium">End:</span> {formatTime(new Date(event.endDate))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-2">Additional Info</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    <div>
                      <span className="font-medium">Attendees:</span> {event.participants.length}
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    <div>
                      <span className="font-medium">Organizer:</span> {event.organizer}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <div className="mr-2 h-4 w-4 text-primary flex items-center justify-center">
                      <span className="h-3 w-3 rounded-full bg-primary"></span>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <Badge className={getStatusColor(event.status)}>
                        {EventStatus[event.status]}
                      </Badge>
                    </div>
                  </div>
                  
                  {isParticipated(event) && (
                    <div className="flex items-center text-sm mt-2">
                      <ExternalLink className="mr-2 h-4 w-4 text-primary" />
                      <div>
                        <span className="font-medium">Event Link: </span> 
                        {event.link ? (
                          <a 
                            href={event.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Join Event
                          </a>
                        ) : (
                          <span className="text-gray-500 italic">Updating...</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t gap-4">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <p>
                  Want to promote your product/personal brand? Contact OGA{' '}
                  <Link
                    href="/contact"
                    className="text-primary font-medium hover:underline inline-flex items-center"
                  >
                    here
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </Link>
                </p>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 sm:flex-none"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    // Share logic here
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button 
                  size="sm" 
                  className={`flex-1 sm:flex-none ${
                    isEventCompleted(event) ? 'bg-gray-500' : 
                    isParticipated(event) ? 'bg-red-500 hover:bg-red-600' : 
                    'bg-primary'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    handleParticipate(event._id);
                  }}
                  disabled={isEventCompleted(event)}
                >
                  {event.status === EventStatus.COMPLETED 
                    ? 'Event Completed' 
                    : isParticipated(event) 
                      ? 'Cancel Registration' 
                      : 'Register Now'
                  }
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}