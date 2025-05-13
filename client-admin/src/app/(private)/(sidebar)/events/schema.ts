import { z } from "zod";
import { EventStatus } from "@/utils/enums";
import { link } from "fs";
export const eventSchema = z.object({
  image: z.string().url().nonempty(),
  title: z.string().min(5).max(100).nonempty(),
  description: z.string().min(10).max(1000).nonempty(),
  type: z.string().min(5).max(100).nonempty(),
  status: z.nativeEnum(EventStatus),
  organizer: z.string().nonempty(),
  startDate: z.string().nonempty(),
  endDate: z.string().nonempty(),
  link: z.string().url().optional().or(z.literal(''))
});

export type EventForm = z.infer<typeof eventSchema>;
