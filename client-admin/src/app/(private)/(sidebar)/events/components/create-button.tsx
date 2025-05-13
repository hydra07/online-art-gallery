'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, EventForm } from '../schema'; // Adjust path as needed
import eventService from '@/service/event-service'; // Adjust path as needed
import FileUploader from '@/components/ui.custom/file-uploader';
import { useRouter } from 'next/navigation';
import { EventStatus } from '@/utils/enums';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, InfoIcon, LinkIcon, ImageIcon, Users2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const { toast } = useToast();

  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      type: '',
      status: EventStatus.UPCOMING,
      organizer: '',
      startDate: '',
      endDate: '',
      link: '',
    },
  });

  const mutation = useMutation({
    mutationFn: eventService.add,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Event created successfully!',
        className: 'bg-green-500 text-white border-green-600',
        duration: 2000,
      });
      form.reset();
      router.push('/events/manage');
      router.refresh();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create event. Please try again.',
        className: 'bg-red-500 text-white border-red-600',
        duration: 3000,
      });
      console.error('Error creating event:', error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: EventForm) => {
    setIsSubmitting(true);
    mutation.mutate({
      ...data,
      link: data.link || '', // Ensure link is always a string
      status: EventStatus.UPCOMING,
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 pb-16">
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-2xl font-semibold text-slate-800">Create New Event</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="media">Media & Links</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Event Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter an eye-catching title" 
                              className="h-12" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>This will be displayed prominently on your event page.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => {
                          const [isCustomType, setIsCustomType] = useState(false);
                          
                          // Handle either dropdown selection or custom input
                          const handleTypeChange = (value: string) => {
                            if (value === 'custom') {
                              setIsCustomType(true);
                              // Don't update field value yet, wait for custom input
                            } else {
                              field.onChange(value);
                              setIsCustomType(false);
                            }
                          };
                          
                          return (
                            <FormItem>
                              <FormLabel className="text-base font-medium">Event Type</FormLabel>
                              <FormControl>
                                {isCustomType ? (
                                  <div className="relative">
                                    <Input 
                                      placeholder="Enter custom event type" 
                                      className="h-12 pl-10"
                                      value={field.value} 
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <InfoIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <Button 
                                      type="button"
                                      variant="ghost" 
                                      size="sm" 
                                      className="absolute right-2 top-3 h-6"
                                      onClick={() => setIsCustomType(false)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <Select 
                                    value={field.value} 
                                    onValueChange={handleTypeChange}
                                  >
                                    <SelectTrigger className="h-12 pl-10">
                                      <SelectValue placeholder="Select event type" />
                                    </SelectTrigger>
                                    <InfoIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <SelectContent>
                                      <SelectItem value="thematic exhibitions">Thematic Exhibitions</SelectItem>
                                      <SelectItem value="solo exhibitions">Solo Exhibitions</SelectItem>
                                      <SelectItem value="group exhibitions">Group Exhibitions</SelectItem>
                                      <SelectItem value="artist talks">Artist Talks</SelectItem>
                                      <SelectItem value="workshop">Workshop</SelectItem>
                                      <SelectItem value="memorial Exhibitions">Memorial Exhibitions</SelectItem>
                                      <SelectItem value="honorary exhibitions">Honorary Exhibitions</SelectItem>
                                      <SelectItem value="custom">Enter Custom Type...</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
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
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="Who's organizing this event?" 
                                  className="h-12 pl-10" 
                                  {...field} 
                                />
                                <Users2Icon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide details about your event. What can attendees expect?"
                              className="min-h-[180px] resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="datetime-local" 
                                    min={minDate}
                                    className={`h-12 pl-10 ${!isStartDateValid ? 'border-red-300 focus-visible:ring-red-400' : ''}`} 
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
                                  <CalendarIcon className={`absolute left-3 top-3.5 h-5 w-5 ${!isStartDateValid ? 'text-red-400' : 'text-slate-400'}`} />
                                  {!isStartDateValid && (
                                    <p className="text-xs text-red-500 mt-1">Start date must be today or later</p>
                                  )}
                                </div>
                              </FormControl>
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
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="datetime-local" 
                                    min={startDate}
                                    className={`h-12 pl-10 ${!isEndDateValid ? 'border-red-300 focus-visible:ring-red-400' : ''}`} 
                                    {...field} 
                                  />
                                  <CalendarIcon className={`absolute left-3 top-3.5 h-5 w-5 ${!isEndDateValid ? 'text-red-400' : 'text-slate-400'}`} />
                                  {!isEndDateValid && (
                                    <p className="text-xs text-red-500 mt-1">End date must be after start date</p>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-base font-medium">Event Status</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className="h-4 w-4 text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Set the current status of your event</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={EventStatus.UPCOMING}>Upcoming</SelectItem>
                                <SelectItem value={EventStatus.ONGOING}>Ongoing</SelectItem>
                                <SelectItem value={EventStatus.COMPLETED}>Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Event Image</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormControl>
                              <div className="border-2 border-dashed rounded-lg p-4 border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
                                <FileUploader
                                  accept={{ 'image/*': [] }}
                                  maxFiles={1}
                                  multiple={false}
                                  maxSize={5 * 1024 * 1024}
                                  onFileUpload={(files) => {
                                    const file = files[0];
                                    setImagePreview(file.url);
                                    field.onChange(file.url);
                                  }}
                                />
                              </div>
                            </FormControl>
                            
                            <div className={cn(
                              "aspect-video rounded-lg overflow-hidden border flex items-center justify-center bg-slate-100", 
                              !imagePreview && "border-dashed"
                            )}>
                              {imagePreview ? (
                                <img 
                                  src={imagePreview} 
                                  alt="Event preview" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center text-slate-400 p-4">
                                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                  <p>Image preview will appear here</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <FormDescription>Upload an image that represents your event (max 5MB)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-base font-medium">Event Link</FormLabel>
                            <span className="text-sm text-slate-500 font-normal">(Optional)</span>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="https://example.com/event" 
                                className="h-12 pl-10" 
                                {...field} 
                              />
                              <LinkIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                            </div>
                          </FormControl>
                          <FormDescription>Add a link to your event page or registration form (optional)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <CardFooter className="flex justify-between mt-8 pt-6 px-0 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/events/manage')}
                  className="w-full md:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending || isSubmitting}
                  className="w-full md:w-auto ml-4"
                >
                  {mutation.isPending || isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}