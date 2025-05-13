import { z } from "zod";

export const collectionSchema = z.object({
    _id : z.string(),
    userId : z.string(),    
    title : z.string(),
    description : z.string(),
    artworks : z.array(z.string()).optional(),
});

export const createCollection = z.object({   
    title : z.string().min(10, { message: "Title is required, minimum 10 characters" }).max(50, { message: "Title is too long, maximum 50 characters" }),
    description : z.string().min(20, { message: "Description is required, minimum 20 characters" }),
    artworks : z.array(z.string()).optional(),
});
export type CollectionForm = z.infer<typeof collectionSchema>;
export type CreateCollectionForm = z.infer<typeof createCollection>;

