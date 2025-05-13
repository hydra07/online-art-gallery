'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, EventForm } from '../../schema';
import eventService from '@/service/event-service';
import FileUploader from '@/components/ui.custom/file-uploader';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { EventStatus } from '@/utils/enums';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Calendar, Clock, Link as LinkIcon, Users, Tag, Info, InfoIcon, ArrowLeft, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface UpdateEventPageProps {
  params: {
    id: string;
  };
}

export default function UpdateEventPage({ params }: UpdateEventPageProps) {
  const [isChangingImage, setIsChangingImage] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['event', params.id],
    queryFn: () => eventService.getById(params.id),
  });
  const event = data?.data;
  
  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      type: '',
      status: event?.status,
      organizer: '',
      startDate: '',
      endDate: '',
      link: '',
    },
  });

  useEffect(() => {
    if (event) {      
      // Set form values
      form.reset({
        title: event.title || '',
        description: event.description || '',
        image: event.image || '',
        type: event.type || '',
        status: event.status,
        organizer: event.organizer || '',
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
        link: event.link || '',
      });
      // Force update the status field specifically
      form.setValue('status', event.status);
    }
  }, [event, form]);

  const mutation = useMutation({
    mutationFn: (data: EventForm) => {
      return eventService.update(data, params.id);
    },
    onSuccess: () => {
      toast({
        title: 'Event Updated',
        description: 'Your event has been updated successfully!',
        className: 'bg-green-500 text-white border-green-600',
        duration: 2000,
      });
      router.push('/events/manage');
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Something went wrong while updating the event',
        className: 'bg-red-500 text-white border-red-600',
        duration: 3000,
      });
    },
  });

  const onSubmit = (data: EventForm) => {
    const submitData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : '',
      endDate: data.endDate ? new Date(data.endDate).toISOString() : '',
    };
    
    mutation.mutate(submitData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-t-primary border-primary/30 rounded-full animate-spin"></div>
        <p className="mt-6 text-muted-foreground text-lg">Loading event data...</p>
      </div>
    );
  }
  
  if (error || !event) return notFound();

  const getStatusColor = (status: string) => {
    switch(status) {
      case EventStatus.UPCOMING: return 'bg-blue-100 text-blue-800 border-blue-200';
      case EventStatus.ONGOING: return 'bg-green-100 text-green-800 border-green-200';
      case EventStatus.COMPLETED: return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusVariant = (status: string) => {
    switch(status) {
      case EventStatus.UPCOMING: return 'blue';
      case EventStatus.ONGOING: return 'success';
      case EventStatus.COMPLETED: return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold leading-tight">Edit Event</h1>
              <p className="text-sm text-muted-foreground">ID: {params.id}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(form.getValues('status')) as any} className="px-3 py-1.5">
            {form.getValues('status')}
          </Badge>
        </div>
      </div>

      <div className="container mx-auto py-8 max-w-5xl px-4">
        <Tabs defaultValue="basic" className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border sticky top-[73px] z-[5] py-1 px-1">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="basic" className="text-sm py-3">
                <Info className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Basic Information</span>
                <span className="sm:hidden">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="text-sm py-3">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Event Details</span>
                <span className="sm:hidden">Details</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="text-sm py-3">
                <LinkIcon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Media & Links</span>
                <span className="sm:hidden">Media</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <TabsContent value="basic" className="space-y-6 focus:outline-none">
                <Card className="shadow-md border-slate-200">
                  <CardHeader className="bg-slate-50 border-b rounded-t-lg">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      Event Information
                    </CardTitle>
                    <CardDescription>Enter the basic details of your event</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Event Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter event title" 
                              {...field} 
                              className="h-12 text-base" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Type */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => {
                        const [isCustomType, setIsCustomType] = useState(false);
                        
                        const eventTypes = [
                          "thematic exhibitions", 
                          "solo exhibitions", 
                          "group exhibitions", 
                          "artist talks", 
                          "workshop", 
                          "memorial Exhibitions", 
                          "honorary exhibitions"
                        ];
                        
                        // Check if the current type is one of the predefined options
                        const isPredefinedType = eventTypes.includes(field.value.toLowerCase());
                        
                        // Initialize custom type mode if the value exists but isn't in predefined list
                        useEffect(() => {
                          if (field.value && !isPredefinedType) {
                            setIsCustomType(true);
                          }
                        }, [field.value, isPredefinedType]);
                        
                        // Toggle between custom and predefined modes
                        const toggleCustomMode = () => {
                          if (isCustomType) {
                            field.onChange('');
                            setIsCustomType(false);
                          } else {
                            setIsCustomType(true);
                          }
                        };
                        
                        // Capitalize first letter of each word
                        const formatTypeName = (type: string) => {
                          return type
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');
                        };
                        
                        return (
                          <FormItem className="mb-2">
                            <FormLabel className="text-base font-medium">Event Type</FormLabel>
                            <FormControl>
                              <div className="space-y-3">
                                {!isCustomType && (
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {eventTypes.map((type) => (
                                      <div 
                                        key={type}
                                        onClick={() => field.onChange(type)}
                                        className={`
                                          flex items-center p-2 rounded-md border transition-all cursor-pointer text-xs
                                          ${field.value === type ? 
                                            'bg-primary/10 border-primary/30 ring-1 ring-primary/20 shadow-sm' : 
                                            'bg-white hover:bg-gray-50 border-gray-200'}
                                        `}
                                      >
                                        <div className={`
                                          w-3 h-3 rounded-full border flex items-center justify-center
                                          ${field.value === type ? 'border-primary' : 'border-gray-300'}
                                        `}>
                                          {field.value === type && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                          )}
                                        </div>
                                        <span className="ml-1.5">{formatTypeName(type)}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <button
                                      type="button"
                                      onClick={toggleCustomMode}
                                      className={`
                                        px-2 py-1 text-xs rounded border transition-colors flex items-center gap-1.5
                                        ${isCustomType ? 'bg-primary/10 text-primary border-primary/30' : 'bg-gray-100 border-gray-200'}
                                      `}
                                    >
                                      {isCustomType ? (
                                        <>
                                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                                          Using custom type
                                        </>
                                      ) : (
                                        <>
                                          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                          Use custom type
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                                
                                {isCustomType && (
                                  <div className="relative mt-2">
                                    <InfoIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input 
                                      placeholder="Enter custom event type" 
                                      className="h-9 pl-9 text-sm"
                                      value={field.value} 
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Enter a specific type not listed in the predefined options
                                    </p>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide a detailed description of your event"
                              className="min-h-[180px] resize-y text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Status & Organizer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => {
                          return (
                            <FormItem className="mb-0">
                              <FormLabel className="text-base font-medium">Event Status</FormLabel>
                              <FormControl>
                                <div className="flex flex-wrap gap-2">
                                  {Object.values(EventStatus).map((validStatus) => {
                                    let statusColor = '';
                                    let statusIcon = null;
                                    
                                    if (validStatus === EventStatus.UPCOMING) {
                                      statusColor = 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100';
                                      statusIcon = <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>;
                                    } else if (validStatus === EventStatus.ONGOING) {
                                      statusColor = 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100';
                                      statusIcon = <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>;
                                    } else {
                                      statusColor = 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
                                      statusIcon = <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>;
                                    }
                                    
                                    return (
                                      <button
                                        key={validStatus}
                                        type="button"
                                        onClick={() => field.onChange(validStatus)}
                                        className={`px-3 py-1.5 rounded-md border transition-all text-xs ${
                                          field.value === validStatus 
                                            ? 'bg-primary text-white border-primary font-medium shadow-sm' 
                                            : `${statusColor}`
                                        }`}
                                      >
                                        <span className="flex items-center gap-1.5">
                                          {statusIcon}
                                          {validStatus}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="organizer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Organizer</FormLabel>
                            <div className="flex items-center space-x-2">
                              <Users className="w-5 h-5 text-muted-foreground" />
                              <FormControl>
                                <Input placeholder="Organization or person name" {...field} className="h-12 text-base" />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 focus:outline-none">
                <Card className="shadow-md border-slate-200">
                  <CardHeader className="bg-slate-50 border-b rounded-t-lg">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Date & Time
                    </CardTitle>
                    <CardDescription>Set when your event starts and ends</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => {
                          // Get today's date formatted for datetime-local input
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const minDate = today.toISOString().slice(0, 16);
                          
                          // Check if start date is valid (>= today)
                          const isStartDateValid = field.value ? new Date(field.value) >= today : true;
                          
                          return (
                            <FormItem>
                              <FormLabel className="text-base font-medium">Start Date & Time</FormLabel>
                              <div className="relative">
                                <div className="absolute left-3 top-3.5 text-muted-foreground">
                                  <Calendar className={`w-5 h-5 ${!isStartDateValid ? 'text-red-400' : ''}`} />
                                </div>
                                <FormControl>
                                  <Input
                                    type="datetime-local"
                                    min={minDate}
                                    className={`h-12 pl-10 text-base ${!isStartDateValid ? 'border-red-300 focus-visible:ring-red-400' : ''}`}
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      
                                      // If end date is earlier than new start date, update end date
                                      const endDateValue = form.getValues('endDate');
                                      if (endDateValue && e.target.value && new Date(endDateValue) < new Date(e.target.value)) {
                                        form.setValue('endDate', e.target.value);
                                      }
                                    }}
                                  />
                                </FormControl>
                                {!isStartDateValid && (
                                  <p className="text-xs text-red-500 mt-1">Start date must be today or later</p>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => {
                          const startDate = form.getValues('startDate') || '';
                          
                          // Check if end date is valid (>= start date)
                          const isEndDateValid = field.value && startDate ? 
                            new Date(field.value) >= new Date(startDate) : true;
                          
                          return (
                            <FormItem>
                              <FormLabel className="text-base font-medium">End Date & Time</FormLabel>
                              <div className="relative">
                                <div className="absolute left-3 top-3.5 text-muted-foreground">
                                  <Clock className={`w-5 h-5 ${!isEndDateValid ? 'text-red-400' : ''}`} />
                                </div>
                                <FormControl>
                                  <Input
                                    type="datetime-local"
                                    min={startDate}
                                    className={`h-12 pl-10 text-base ${!isEndDateValid ? 'border-red-300 focus-visible:ring-red-400' : ''}`}
                                    {...field}
                                  />
                                </FormControl>
                                {!isEndDateValid && (
                                  <p className="text-xs text-red-500 mt-1">End date must be after start date</p>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    {/* Info box with additional explanation */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
                      <div className="flex items-start gap-3">
                        <InfoIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-700">Setting the right time matters</h4>
                          <p className="text-sm text-blue-600 mt-1">
                            Events will automatically change status based on these dates. Make sure to set accurate start and end times.
                            <span className="block mt-1.5 text-xs">
                              • Start date must be today or a future date<br />
                              • End date must be after the start date
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="space-y-6 focus:outline-none">
                <Card className="shadow-md border-slate-200">
                  <CardHeader className="bg-slate-50 border-b rounded-t-lg">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-primary" />
                      Media & Links
                    </CardTitle>
                    <CardDescription>Add visual elements and related links</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 pt-6">
                    {/* Image Upload */}
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium mb-2 block">Event Image</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {!isChangingImage && field.value ? (
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                  <div className="border rounded-lg overflow-hidden bg-slate-50 h-60 w-full lg:w-96 relative">
                                    <Image
                                      src={field.value}
                                      alt="Event cover image"
                                      fill
                                      sizes="(max-width: 640px) 100vw, 384px"
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-3">
                                    <h4 className="font-medium">Current Cover Image</h4>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => setIsChangingImage(true)}
                                      className="sm:w-auto"
                                    >
                                      Change Image
                                    </Button>
                                    <div className="bg-slate-50 border rounded p-3 mt-2">
                                      <p className="text-sm text-muted-foreground">
                                        <span className="font-medium block text-slate-700">Image Tips:</span>
                                        • Use high quality images (1200×600 pixels minimum)<br />
                                        • Keep file size under 5MB<br />
                                        • Use images that represent your event clearly
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50">
                                  <FileUploader
                                    accept={{ 'image/*': [] }}
                                    maxFiles={1}
                                    maxSize={5 * 1024 * 1024}
                                    onFileUpload={(files) => {
                                      const file = files[0];
                                      field.onChange(file.url);
                                      setIsChangingImage(false);
                                    }}
                                  />
                                  <p className="text-xs text-muted-foreground mt-3">
                                    Recommended size: 1200×600 pixels, max 5MB
                                  </p>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-6" />

                    {/* External Link */}
                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">External Link</FormLabel>
                          <div className="relative">
                            <div className="absolute left-3 top-3.5 text-muted-foreground">
                              <LinkIcon className="w-5 h-5" />
                            </div>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/event" 
                                type="url" 
                                className="h-12 pl-10 text-base"
                                {...field} 
                              />
                            </FormControl>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Optional: Add a link to the event page on an external website
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end gap-4 pt-4 border-t bg-slate-50">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="min-w-[100px]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="min-w-[140px]"
                    >
                      {mutation.isPending ? 
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          Updating...
                        </span> : 
                        <span className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Save Changes
                        </span>
                      }
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* This is to add space at the bottom so content isn't hidden behind fixed buttons */}
              <div className="h-20"></div>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  );
}