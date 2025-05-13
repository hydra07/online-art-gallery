import { z } from "zod";

export const depositSchema = z.object({
    amount: z.number().min(1, { message: "Amount must be greater than 0" }),
    description: z.string().optional(),
    method: z.enum(["bank", "credit_card"], { errorMap: () => ({ message: "Invalid payment method" }) }).optional()
});