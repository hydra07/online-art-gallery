'use server';
import { z } from 'zod';
import { authenticatedAction } from '@/lib/safe-action';
import { rateLimitByKey } from '@/lib/limiter';
import { createPayment, verifyPayment } from '@/service/payment.service';

export const createPaymentAction = authenticatedAction
    .createServerAction()
    .input(z.object({
        amount: z.number()
    }))
    .handler(async ({ input, ctx }) => {
        const { user } = ctx;
        const { amount } = input;
        const { paymentUrl } = await createPayment(user.accessToken, amount);
        return { paymentUrl };
    })

export const verifyPaymentAction = authenticatedAction
    .createServerAction()
    .input(z.object({
        paymentId: z.string()
    }))
    .handler(async ({ input, ctx }) => {
        const { paymentId } = input;
        const { paymentUrl } = await verifyPayment(ctx.user.accessToken,paymentId);
        return { paymentUrl };
    })
