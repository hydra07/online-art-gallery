// 'use server';
// import eventService from "@/service/event-service";
// import { adminOnlyAction, authenticatedAction } from "@/lib/safe-action"
// import { string, z } from "zod";
// import { revalidatePath } from "next/cache";
// import { validateImage } from "@/lib/utils";
// import { InvalidFileError } from '@/lib/errors';
// //import { createEvent, deleteEvent, updateEvent } from "@/service/event-service";
// import { eventSchema } from "@/types/event";
// import { uploadToCloudinary } from "@/lib/cloudinary";

// export const createEventAction = authenticatedAction
//     .createServerAction()
//     .input(
//         z.object({
//             title: z.string().min(1, { message: 'Title is required' }),
//             description: z.string().min(1, { message: 'Description is required' }),
//             image: z.instanceof(FormData),
//             type: z.string().min(1, { message: 'Type is required' }),
//             status: z.string().min(1, { message: 'Status is required' }),
//             organizer: z.string().min(1, { message: 'Organizer is required' }),
//             startDate: z.date(),
//             endDate: z.date(),
//         })
//     )
//     .handler(async ({ input, ctx }) => {
//         const image = input.image.get('file') as File;
//         if(!image || !(image instanceof File)) throw new InvalidFileError();
//         validateImage(image);
//         const {secure_url} = await uploadToCloudinary(image, {
//             folder: 'events',
//         });
//         const event = await eventService.createEvent({
//             accessToken: ctx.user.accessToken,
//             eventData: {
//                 title: input.title,
//                 description: input.description,
//                 image: secure_url,
//                 type: input.type,
//                 status: input.status,
//                 organizer: input.organizer,
//                 startDate: input.startDate.toISOString(),
//                 endDate: input.endDate.toISOString(),
//             }
//         })
//         revalidatePath('/event');
//         return { event };
//     });

// export const updateEventAction = authenticatedAction
//     .createServerAction()
//     .input(
//         z.object({
//             id: z.string(),
//             title: z.string().optional(),
//             description: z.string().optional(),
//             image: z.instanceof(FormData).optional(),
//             type: z.string().optional(),
//             status: z.string().optional(),
//             organizer: z.string().optional(),
//             startDate: z.string().optional(),
//             endDate: z.string().optional(),
//         })
//     )
//     .handler(async ({ input, ctx }) => {
//         const updateData: {
//             _id: string,
//             title?: string,
//             description?: string,
//             image?: string,
//             type?: string,
//             status?: string,
//             organizer?: string,
//             startDate?: string,
//             endDate?: string,
//         } = {
//             _id: input.id,
//         }
//         if(input.title) updateData.title = input.title;
//         if(input.description) updateData.description = input.description;
//         if(input.image) {
//             const image = input.image.get('file') as File;
//             if(!image || !(image instanceof File)) throw new InvalidFileError();
//             validateImage(image);
//             const {secure_url} = await uploadToCloudinary(image, {
//                 folder: 'events',
//             });
//             updateData.image = secure_url;
//         };
//         if(input.type) updateData.type = input.type;
//         if(input.status) updateData.status = input.status;
//         if(input.organizer) updateData.organizer = input.organizer;
//         if(input.startDate) updateData.startDate = input.startDate;
//         if(input.endDate) updateData.endDate = input.endDate;
//         const eventUpdated = await eventService.updateEvent({
//             accessToken: ctx.user.accessToken,
//             updateData,
//         })
//         revalidatePath(`/event/${eventUpdated._id}`);
//         return { id: eventUpdated._id };
//     })


// export const deleteEventAction = authenticatedAction
//     .createServerAction()
//     .input(z.object({
//         eventId: z.string(),
//     }))
//     .handler(async ({ input: {eventId}, ctx:{} }) => {
//        await eventService.deleteEvent(eventId);
//        revalidatePath('/event');
//        return { message: 'Event deleted successfully' };
//     })




// // export default eventService = {
    
// // }