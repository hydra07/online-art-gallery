'use server';

import { authenticatedAction, unauthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { purchaseExhibitionTicket, toggleArtworkLike, updateExhibitionAnalytics } from "@/service/exhibition";
import { checkLimitStatus, rateLimitByKey} from "@/lib/limiter";
import { RateLimitError } from "@/lib/errors";
import { headers } from "next/headers";
import { checkPremium } from "@/utils/premium";
import { getSession } from "@/lib/session";


const MAX_DAILY_VIEWS = 5;
const RESET_WINDOW = 1 * 60 * 1000;


export const purchaseTicketAction = authenticatedAction
  .createServerAction()
  .input(z.object({
    exhibitionId: z.string()
  }))
  .handler(async ({ input, ctx }) => {
    const { exhibitionId } = input;

    const result = await purchaseExhibitionTicket(
      ctx.user.accessToken,
      exhibitionId
    );

    revalidatePath(`/exhibitions/${exhibitionId}`);
    return result.data;
  });

export const likeArtworkAction = authenticatedAction
  .createServerAction()
  .input(z.object({
    exhibitionId: z.string(),
    artworkId: z.string()
  }))
  .handler(async ({ input, ctx }) => {
    const { exhibitionId, artworkId } = input;

    const result = await toggleArtworkLike(
      ctx.user.accessToken,
      exhibitionId,
      artworkId
    );

    return result.data;
  });


export const updateExhibitionAnalyticsAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({
    exhibitionId: z.string(),
    timeSpent: z.number() // Time spent in seconds
  }))
  .handler(async ({ input }) => {
    const { exhibitionId, timeSpent } = input;
    const result = await updateExhibitionAnalytics(exhibitionId,
      timeSpent
    );

    revalidatePath(`/discover`);
    return result.data;
  });

export const checkExhibitionAccessAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({
    exhibitionId: z.string()
  }))
  .handler(async ({ input }) => {
    try {
      const { exhibitionId } = input;
      // Lấy session thủ công, vì chúng ta đang sử dụng unauthenticatedAction
      const session = await getSession();
      
      // Kiểm tra premium nếu đã đăng nhập
      if (session?.user?.accessToken) {
        try {
          const premiumStatus = await checkPremium(session.user.accessToken);
          if (premiumStatus.isPremium) {
            return { data: { canAccess: true, isPremium: true, message: "premium_access" }};
          }
        } catch (error) {
          console.error('Error checking premium status:', error);
        }
      }
      
      // Tạo key cho rate limit (không bao gồm exhibitionId - tạo key chung cho tất cả phòng tranh)
      const limitKey = session?.user?.id 
        ? `exhibition-view-${session.user.id}` // Chỉ dùng user ID, không thêm exhibition ID
        : `exhibition-view-ip-${headers().get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'}`;

      // Kiểm tra status trước để hiển thị thông tin số lượt xem còn lại
      const status = checkLimitStatus({ key: limitKey, limit: MAX_DAILY_VIEWS });

      // Áp dụng rate limit
      try {
        await rateLimitByKey({
          key: limitKey,
          limit: MAX_DAILY_VIEWS,
          window: RESET_WINDOW
        });
        return { 
          data: { 
            canAccess: true, 
            isPremium: false, 
            message: "access_granted",
            remaining: MAX_DAILY_VIEWS - status.count -1, // Trừ đi 1 vì vừa tăng counter
            total: MAX_DAILY_VIEWS
          }
        };
      } catch (error) {
        if (error instanceof RateLimitError) {
          return { data: { canAccess: false, isPremium: false, message: "limit_exceeded", remaining: 0, total: MAX_DAILY_VIEWS }};
        }
        throw error;
      }
    } catch (error) {
      console.error('Exhibition access check error:', error);
      return { data: { canAccess: true, isPremium: false, message: "error_fallback" }};
    }
  });

