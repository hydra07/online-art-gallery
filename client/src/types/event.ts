import { z } from "zod";

export const eventSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  status: z.string(),
  organizer: z.string(),
  participants: z.array(z.string()),
  startDate: z.date(),
  endDate: z.date(),
  image: z.string(),
  link: z.string().optional(),
});

export type Event = z.infer<typeof eventSchema>;
