import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Clock, Info, Tag, Activity } from 'lucide-react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import eventService, { Event } from '@/service/event-service';
import { Badge } from '@/components/ui/badge';
import { EventStatus } from '@/utils/enums';
import { useState } from 'react';

// Extended interface for event data
interface EventWithDetails extends Event {
  id?: string;
  location?: string;
  attendees?: number;
}

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

export function UpcomingEvents() {
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  
  const { 
    data: events = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: eventService.getUpcomingEvents,
  });

  const handleParticipate = async (eventId: string) => {
    if (!eventId) return;
    
    try {
      await eventService.participate(eventId);
      alert("Registration successful!");
    } catch (error) {
      console.error("Unable to register for event:", error);
      alert("Registration failed!");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleDescription = (eventId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  return (
    <div className='space-y-4 sticky top-4'>
      <Card className='border-none shadow-md'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xl font-semibold'>
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {isLoading ? (
            <p className='text-center text-muted-foreground py-6'>Loading events...</p>
          ) : error || !events?.length ? (
            <p className='text-center text-muted-foreground py-6'>
              {error ? "Error loading events" : "No upcoming events"}
            </p>
          ) : (
            events.map((event: EventWithDetails) => {
              // Generate a unique ID for each event
              const eventId = event.id || `event-${event.title}`;
              const isExpanded = expandedDescriptions[eventId] || false;
              
              // Parse dates
              const startDate = new Date(event.startDate);
              const endDate = new Date(event.endDate);
              
              // Format time range
              const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const timeRange = `${startTime} - ${endTime}`;
              
              return (
                <div key={eventId} className='group'>
                  <div className='relative w-full h-40 mb-3 rounded-lg overflow-hidden'>
                    <Image
                      src={event.image || 'https://placehold.co/600x400?text=No+Image'}
                      alt={event.title}
                      fill
                      className='object-cover transition-transform group-hover:scale-105'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent' />
                    <div className='absolute bottom-2 left-2 right-2'>
                      <div className='flex justify-between items-center'>
                        <p className='text-white font-medium text-lg'>
                          {event.title}
                        </p>
                        <Badge className={getStatusColor(event.status)}>
                          {EventStatus[event.status]}
                        </Badge>
                      </div>
                      <p className='text-white/80 text-sm flex items-center gap-1'>
                        <Tag className='h-3 w-3' />
                        {event.type || "Event"}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-2 px-1'>
                    {/* Event description with toggle */}
                    <div className='text-sm text-muted-foreground mb-3'>
                      <div className='flex items-start gap-2'>
                        <Info className='h-4 w-4 mt-0.5 flex-shrink-0' />
                        <div>
                          <p className={isExpanded ? '' : 'line-clamp-2'}>
                            {event.description || "No description"}
                          </p>
                          {event.description && event.description.length > 100 && (
                            <button 
                              onClick={() => toggleDescription(eventId)}
                              className='text-xs text-blue-500 mt-1 hover:underline'
                            >
                              {isExpanded ? 'Collapse' : 'See more'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Date */}
                    <div className='flex items-center text-sm text-muted-foreground'>
                      <CalendarDays className='mr-2 h-4 w-4 flex-shrink-0' />
                      <span className='font-medium'>
                        {formatDate(startDate)}
                      </span>
                    </div>
                    
                    {/* Time */}
                    <div className='flex items-center text-sm text-muted-foreground'>
                      <Clock className='mr-2 h-4 w-4 flex-shrink-0' />
                      <span>{timeRange}</span>
                    </div>
                    
                    {/* Location (if available) */}
                    {event.location && (
                      <div className='flex items-center text-sm text-muted-foreground'>
                        <MapPin className='mr-2 h-4 w-4 flex-shrink-0' />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    {/* Organizer */}
                    <div className='flex items-center text-sm text-muted-foreground'>
                      <Users className='mr-2 h-4 w-4 flex-shrink-0' />
                      <span>{event.organizer || "Organization"}</span>
                    </div>
                    
                    {/* Attendees count if available */}
                    {event.attendees !== undefined && (
                      <div className='flex items-center text-sm text-muted-foreground'>
                        <Activity className='mr-2 h-4 w-4 flex-shrink-0' />
                        <span>{event.attendees} participants</span>
                      </div>
                    )}

                    {/* Registration button with status-aware display */}
                    <Button
                      variant='outline'
                      className='w-full mt-3 bg-primary/5 hover:bg-primary/10'
                      size='sm'
                      onClick={() => eventId && handleParticipate(eventId)}
                      disabled={event.status === EventStatus.COMPLETED}
                    >
                      {event.status === EventStatus.COMPLETED ? 'Completed' : 
                       event.status === EventStatus.ONGOING ? 'Join now' : 'Register'}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}