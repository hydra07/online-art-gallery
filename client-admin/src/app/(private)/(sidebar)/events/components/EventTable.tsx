// 'use client';
// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import eventService from '@/service/event-service';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   MoreHorizontal,
//   Trash,
//   Clock,      // Icon cho upcoming
//   CheckCircle, // Icon cho completed
//   PlayCircle,  // Icon cho ongoing
// } from "lucide-react";
// import { motion, AnimatePresence } from 'framer-motion';
// import CreateEventButton from './create-button';
// import { cn } from "@/lib/utils";
// import EditEventButton from './edit-button';

// interface EventTableProps {
//   accessToken: string;
// }

// const EventTable = ({ accessToken }: EventTableProps) => {
//   const { data, isLoading, isFetching } = useQuery({
//     queryKey: ['events'],
//     queryFn: () => eventService.getEvents(accessToken),
//     placeholderData: (previousData) => previousData,
//     staleTime: 5 * 60 * 1000,
//   });

//   const events = data?.data || [];

//   const getStatusBadge = (status: string) => {
//     const statusStyles: Record<string, { className: string; icon: React.ComponentType<any> }> = {
//       ongoing: {
//         className: 'bg-green-600 text-white hover:bg-green-700',
//         icon: PlayCircle
//       },
//       upcoming: {
//         className: 'bg-yellow-500 text-white hover:bg-yellow-600',
//         icon: Clock
//       },
//       completed: {
//         className: 'bg-blue-600 text-white hover:bg-blue-700',
//         icon: CheckCircle
//       },
//       default: {
//         className: 'bg-gray-500 text-white hover:bg-gray-600',
//         icon: Clock // Icon mặc định
//       },
//     };

//     const { className, icon: Icon } = statusStyles[status.toLowerCase()] || statusStyles.default;

//     return (
//       <Badge
//         className={cn(
//           "whitespace-nowrap transition-all duration-200 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1",
//           className,
//           "hover:scale-105 hover:shadow-sm"
//         )}
//       >
//         <Icon className="h-4 w-4" />
//         {status}
//       </Badge>
//     );
//   };

//   if (isLoading) {
//     return (
//       <Card className="w-full h-screen shadow-lg rounded-none overflow-hidden">
//         <CardHeader className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
//           <div className="flex justify-between items-center">
//             <Skeleton className="h-9 w-52 rounded-md" />
//             <Skeleton className="h-12 w-36 rounded-lg" />
//           </div>
//           <Skeleton className="h-5 w-3/4 mt-2 rounded-md" />
//         </CardHeader>
//         <CardContent className="px-6 py-4">
//           <div className="space-y-3">
//             {Array.from({ length: 5 }).map((_, index) => (
//               <Skeleton key={index} className="h-16 w-full rounded-lg" />
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="w-full h-screen shadow-lg rounded-none overflow-hidden flex flex-col">
//       <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 shrink-0">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//           className="space-y-2"
//         >
//           <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
//             Event Management
//           </CardTitle>
//           <CardDescription className="text-base text-gray-600">
//             View and manage all your events in one place
//           </CardDescription>
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//         >
//           <CreateEventButton />
//         </motion.div>
//       </CardHeader>
//       <CardContent className="p-0 flex-1 overflow-auto">
//         <div className="h-full">
//           <Table className="h-full">
//             <TableHeader>
//               <TableRow className="bg-gray-100 hover:bg-gray-100 border-b border-gray-200">
//                 <TableHead className="text-sm md:text-base font-semibold px-6 py-4 w-[80px] text-gray-700">
//                   No.
//                 </TableHead>
//                 <TableHead className="text-sm md:text-base font-semibold px-6 py-4 w-[220px] text-gray-700">
//                   Title
//                 </TableHead>
//                 <TableHead className="text-sm md:text-base font-semibold px-6 py-4 hidden sm:table-cell w-[100px] text-gray-700">
//                   Image
//                 </TableHead>
//                 <TableHead className="text-sm md:text-base font-semibold px-6 py-4 hidden md:table-cell w-[280px] text-gray-700">
//                   Description
//                 </TableHead>
//                 <TableHead className="text-sm md:text-base font-semibold px-6 py-4 hidden lg:table-cell w-[160px] text-gray-700">
//                   Organizer
//                 </TableHead>
//                 <TableHead className="text-sm md:text-base font-semibold px-6 py-4 w-[140px] text-gray-700">
//                   Status
//                 </TableHead>
//                 <TableHead className="text-sm md:text-base font-semibold px-6 py-4 hidden md:table-cell w-[140px] text-gray-700">
//                   Start Date
//                 </TableHead>
//                 <TableHead className="text-sm md:text-base font-semibold px-6 py-4 w-[100px] text-right text-gray-700">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               <AnimatePresence>
//                 {events.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={8} className="text-center py-12 text-gray-500 text-lg">
//                       No events found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   events.map((event: any, index: number) => (
//                     <motion.tr
//                       key={event._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       transition={{ duration: 0.3 }}
//                       className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
//                     >
//                       <TableCell className="font-medium text-base px-6 py-4">
//                         {index + 1}
//                       </TableCell>
//                       <TableCell className="font-medium text-base px-6 py-4 truncate">
//                         {event.title}
//                       </TableCell>
//                       <TableCell className="px-6 py-4 hidden sm:table-cell">
//                         {event.image ? (
//                           <motion.img
//                             src={event.image}
//                             alt={event.title}
//                             className="h-12 w-12 rounded-lg object-cover shadow-sm"
//                             loading="lazy"
//                             whileHover={{ scale: 1.1 }}
//                             transition={{ duration: 0.2 }}
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).src = "/api/placeholder/48/48";
//                             }}
//                           />
//                         ) : (
//                           <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm shadow-sm">
//                             N/A
//                           </div>
//                         )}
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell px-6 py-4 text-base truncate">
//                         {event.description || 'N/A'}
//                       </TableCell>
//                       <TableCell className="hidden lg:table-cell px-6 py-4 text-base truncate">
//                         {event.organizer || 'N/A'}
//                       </TableCell>
//                       <TableCell className="px-6 py-4">
//                         {getStatusBadge(event.status || 'N/A')}
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell px-6 py-4 text-base">
//                         {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'}
//                       </TableCell>
//                       <TableCell className="px-6 py-4 text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-10 w-10 p-0 hover:bg-gray-200 rounded-full transition-colors duration-200"
//                             >
//                               <MoreHorizontal className="h-5 w-5 text-gray-600" />
//                               <span className="sr-only">Open menu</span>
//                             </Button>
//                           </DropdownMenuTrigger>

//                           <DropdownMenuContent align="end" className="w-44 bg-white shadow-md rounded-lg p-1">
//                             <DropdownMenuItem asChild>
//                               <EditEventButton
//                                 event={{
//                                   _id: event._id,
//                                   title: event.title,
//                                   image: event.image,
//                                   description: event.description || '',
//                                   type: event.type || '',
//                                   status: event.status || '',
//                                   organizer: event.organizer || '',
//                                   startDate: event.startDate,
//                                   endDate: event.endDate,
//                                 }}
//                               />
//                             </DropdownMenuItem>
//                             <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md text-base cursor-pointer transition-colors duration-200">
//                               <Trash className="mr-2 h-5 w-5" />
//                               Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </motion.tr>
//                   ))
//                 )}
//               </AnimatePresence>
//             </TableBody>
//           </Table>
//         </div>
//         {isFetching && !isLoading && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="text-center py-3 text-base text-gray-500 bg-gray-50"
//           >
//             Updating data...
//           </motion.div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default EventTable;