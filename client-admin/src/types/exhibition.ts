import { z } from "zod";
import { Pagination } from "./response";
import { Gallery } from "./gallery";


export interface ExhibitionArtwork {
  _id: string;
  title: string;
  description: string;
  category: string[];
  dimensions: {
    width: number;
    height: number;
  };
  url: string;
  status: string;
  views: number;
  price: number;
  artistId: string;
}

export interface ArtworkPosition {
  artwork: ExhibitionArtwork;
  positionIndex: number;
}


export interface LanguageOption {
  name: string;
  code: string;
  isDefault: boolean;
}

// Result interface for exhibition analytics
export interface ExhibitionResult {
  visits: number;
  likes: { count: number; artworkId: string }[];
  totalTime: number;
}

export interface Ticket {
  requiresPayment: boolean;
  price: number;
  registeredUsers: string[];
  // currency: string;
}



export interface Exhibition {
  _id: string;
  startDate: string;
  endDate: string;
  welcomeImage: string;
  backgroundMedia: string;
  backgroundAudio: string;
  contents: {
    languageCode: string;
    name: string;
    description: string;
  }[];
  gallery: Gallery;
  author: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  languageOptions: LanguageOption[];
  isFeatured: boolean;
  status: ExhibitionStatus;
  result: ExhibitionResult;
  linkName: string;
  discovery: boolean;  
  artworkPositions: ArtworkPosition[];
  ticket: Ticket;
}


export enum ExhibitionStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  PRIVATE = 'PRIVATE',
  REJECTED = 'REJECTED'
}

// Schema definitions for nested objects
const languageOptionSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2).max(2),
  isDefault: z.boolean()
});


const ticketSchema = z.object({
  requiresPayment: z.boolean().default(false),
  price: z.number().default(0),
  registeredUsers: z.array(z.string()).default([]),
  // currency: z.string().optional(),
});


const resultSchema = z.object({
  visits: z.number().optional().default(0),
  likes: z.array(
    z.object({
      count: z.number(),
      artworkId: z.string()
    })
  ).optional().default([]),
  totalTime: z.number().optional().default(0)
});

const artworkPositionSchema = z.object({
  artwork: z.string(),
  positionIndex: z.number()
});

export const createEmptyExhibitionSchema = z.object({
  gallery: z.string(),
  name: z.string().min(2).max(50).optional()
});


// Update schema - all fields optional
export const updateExhibitionSchema = z.object({
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  welcomeImage: z.string().url().optional(),
  backgroundMedia: z.string().url().optional(),
  backgroundAudio: z.string().url().optional(),
  contents: z.array(z.object({
    languageCode: z.string().min(2).max(2),
    name: z.string().max(100),
    description: z.string(),
  })).optional(),
  gallery: z.string().optional(),
  languageOptions: z.array(languageOptionSchema).optional(),
  isFeatured: z.boolean().optional(),
  status: z.nativeEnum(ExhibitionStatus).optional(),
  result: resultSchema.optional(),
  linkName: z.string().optional(),
  discovery: z.boolean().optional(),
  artworkPositions: z.array(artworkPositionSchema).optional(),
  ticket: ticketSchema.optional(),
});


export const contentSchema = z.object({
  contents: z.array(z.object({
    languageCode: z.string().min(2).max(2),
    name: z.string().max(100),
    description: z.string(),
  })).optional(),
  welcomeImage: z.string().optional(),
  backgroundMedia: z.string().optional(),
  backgroundAudio: z.string().optional(),
});

export type ContentFormData = z.infer<typeof contentSchema>;


export type GetExhibitionsResponse = {
  exhibitions: Exhibition[];
  pagination: Pagination;
};


export type ExhibitionRequestResponse = {
  exhibition: Exhibition;
}

export type CreateEmptyExhibitionDto = z.infer<typeof createEmptyExhibitionSchema>;
export type UpdateExhibitionDto = z.infer<typeof updateExhibitionSchema>;