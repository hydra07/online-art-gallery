import {z} from "zod";

export const withdrawSchema = z.object({
    bankName: z.string().min(1, { message: "Bank name is required" }),
    bankAccountName: z.string().min(1, { message: "Account name is required" }),
    idBankAccount: z.string().min(1, { message: "Bank account is required" }),
    amount: z.number().min(1, { message: "Amount is required" }).max(100000000, { message: "Amount must be less than 100,000,000" }),
})

export type WithdrawForm = z.infer<typeof withdrawSchema>;
