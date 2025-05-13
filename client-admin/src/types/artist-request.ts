import { z } from "zod";
import { Pagination } from "./response";

export enum ArtistRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export const artistRequestSchema = z.object({
  _id: z.string(),
  userId: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string().optional()
  }),
  status: z.nativeEnum(ArtistRequestStatus).default(ArtistRequestStatus.PENDING),
  cccd: z.object({
    id: z.string(),
    name: z.string(),
    dob: z.string(),
    sex: z.string(),
    nationality: z.string(),
    home: z.string(),
    address: z.string(),
    doe: z.string(),
    issue_date: z.string(),
    issue_loc: z.string(),
    features: z.string(),
    mrz: z.string(),
    imageFront: z.string(),
    imageBack: z.string(),
  }).optional(),
  rejectionReason: z.string().optional(),
  reviewedBy: z.object({
    _id: z.string(),
    name: z.string()
  }).optional(),
  reviewedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type ArtistRequest = z.infer<typeof artistRequestSchema>;

export type GetArtistRequestsResponse = {
  requests: ArtistRequest[];
  pagination: Pagination;
};

export type ArtistRequestResponse = {
  request: ArtistRequest;
};