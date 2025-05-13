import { z } from "zod";
import { Pagination } from "./response";

export enum ProviderType {
  CREDENTIALS = 'credentials',
  GOOGLE = 'google'
}

export enum Role {
  USER = 'USER',
  ARTIST = 'ARTIST',
  ADMIN = 'ADMIN'
}

export const artistSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
  artistProfile: z.object({
    bio: z.string().optional(),
    genre: z.array(z.string()).optional(),
    experience: z.string().optional(),
    socialLinks: z.object({
      instagram: z.string().url().optional().nullable(),
      twitter: z.string().url().optional().nullable(),
      website: z.string().url().optional().nullable(),
    }).optional(),
    isFeatured: z.boolean().optional().default(false),
  }).optional(),
  following: z.array(z.string()),
  followers: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Artist = z.infer<typeof artistSchema>;

export type GetArtistsResponse = {
  artists: Artist[];
  pagination: Pagination;
};

export type ArtistResponse = {
  artist: Artist;
};

export const updateArtistSchema = z.object({
  _id: z.string(),
  isFeatured: z.boolean(),
});