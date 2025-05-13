'use client';
import { useState, useMemo } from 'react';
import Exhibition from '../components/exhibition';
import { Button } from '@/components/ui/button';
import { ArrowRight, Share2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Exhibition as ExhibitionType } from '@/types/exhibition';
import { PurchaseTicketButton } from './components/purchase-ticket-button';
import { useLocale, useTranslations } from 'next-intl';
import { formatDateByLocale } from '@/utils/converters';
import { useExhibitionAccess } from '@/hooks/use-exhibition-access';
import { getLocalizedContent } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useServerAction } from "zsa-react";
import { purchaseTicketAction, checkExhibitionAccessAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/ui.custom/auth-dialog";
import { useExhibitionAnalytics } from '@/hooks/use-exhibition-analytics';

export default function ExhibitionContent({ exhibitionData }: { exhibitionData: ExhibitionType }) {
  const [isStarted, setIsStarted] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [remainingViews, setRemainingViews] = useState<number | null>(null);
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const locale = useLocale();
  const t = useTranslations('exhibitions');
  const tError = useTranslations('error');
  const tCommon = useTranslations('common');
  const { toast } = useToast();

  // Sử dụng hook kiểm tra quyền truy cập vé
  const { canAccess, isLoading: accessLoading } = useExhibitionAccess(exhibitionData);

  // Theo dõi phân tích cho exhibition
  useExhibitionAnalytics(exhibitionData._id, isStarted);

  // Lấy dữ liệu phiên
  const { data: session, status: sessionStatus } = useSession();
  const localizedContent = useMemo(() =>
    getLocalizedContent(exhibitionData, locale),
    [exhibitionData, locale]
  );

  // Check limit server action
  const { execute: checkViewLimit, isPending: isCheckingLimit } = useServerAction(
    checkExhibitionAccessAction,
    {
      onSuccess: (response) => {
        const data = response.data.data;
        if (data.canAccess) {
          // If user can access (either premium or has remaining views)
          setIsStarted(true);
          setRemainingViews(data.remaining ?? null);
          setTotalViews(data.total ?? null);
          setIsPremium(data.isPremium);
        } else {
          // If user has exceeded their view limit
          setRemainingViews(0);
          setTotalViews(data.total ?? null);
          toast({
            title: t('limit_reached_title'),
            description: t('limit_reached_description'),
            variant: 'destructive',
          });
        }
      },
      onError: (error) => {
        console.error("Exhibition access check error:", error);
        toast({
          title: tError('error'),
          description: t('view_limit_check_failed'),
          variant: 'destructive',
        });
      }
    }
  );

  // Tính toán isLoading một lần và tránh re-render
  const isLoading = useMemo(() =>
    accessLoading || sessionStatus === 'loading' || isCheckingLimit,
    [accessLoading, sessionStatus, isCheckingLimit]
  );

  // Action mua vé
  const { execute: purchaseTicket, isPending } = useServerAction(purchaseTicketAction, {
    onSuccess: () => {
      toast({
        title: tCommon('success'),
        description: t('ticket_purchased_success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: tError('error'),
        description: t(error.err.message) || t('ticket_purchase_failed'),
        variant: 'destructive',
      });
    },
  });

  const handlePurchase = () => {
    // Nếu chưa đăng nhập, hiển thị dialog đăng nhập
    if (!session?.user && sessionStatus !== 'loading') {
      setShowAuthDialog(true);
      return;
    }

    // Nếu đã đăng nhập, mua vé
    if (session?.user) {
      purchaseTicket({ exhibitionId: exhibitionData._id });
    }
  };

  // Xử lý khi bắt đầu xem exhibition
  const handleStartExhibition = () => {
    // Check view limit directly when user clicks to enter
    checkViewLimit({ exhibitionId: exhibitionData._id });
  };

  const renderActionButton = () => {
    if (isLoading) {
      return (
        <Button
          disabled
          className="w-full bg-black rounded-3xl text-white hover:bg-gray-800 py-6"
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </Button>
      );
    }

    // Nếu đã có vé 
    if (canAccess) {
      // Nếu đã kiểm tra và không có quyền truy cập do vượt quá giới hạn
      if (remainingViews === 0) {
        return (
          <div className="space-y-3">
            <div className="rounded-lg bg-red-50 p-3 border border-red-100">
              <p className="text-sm text-red-500 font-medium text-center">
                {t('limit_reached_title')}
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                {t('limit_reached_description')}
              </p>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl text-white py-6 hover:from-purple-700 hover:to-indigo-800 shadow-md border border-purple-300"
              onClick={() => window.location.href = '/premium'}
            >
              <span className="flex items-center justify-center">
                {t('upgrade_to_premium')}
              </span>
            </Button>
          </div>
        );
      }
      
      // Otherwise show the enter exhibition button
      return (
        <Button
          onClick={handleStartExhibition}
          className="w-full bg-black rounded-3xl text-white hover:bg-gray-800 py-6"
          disabled={isCheckingLimit}
        >
          {isCheckingLimit ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('checking_access')}
            </>
          ) : (
            <>
              {t('enter_exhibition')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      );
    }

    // Nếu chưa có vé
    return (
      <PurchaseTicketButton
        requiresPayment={exhibitionData.ticket?.requiresPayment}
        price={exhibitionData.ticket?.price || 0}
        className="w-full bg-black rounded-3xl text-white hover:bg-gray-800 py-6"
        onPurchaseClick={handlePurchase}
        isLoading={isPending}
      />
    );
  };

  if (!isStarted) {
    return (
      <>
        <div className='relative h-screen w-full'>
          <div className='absolute inset-0'>
            {exhibitionData.backgroundMedia && (
              exhibitionData.backgroundMedia.endsWith('.mp4') ? (
                <video
                  src={exhibitionData.backgroundMedia}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src={exhibitionData.backgroundMedia}
                  alt='Gallery Background'
                  fill
                  className='object-cover'
                  priority
                />
              )
            )}
          </div>

          <div className='relative h-full flex items-center justify-center'>
            <div className='max-w-sm w-full mx-4 bg-white p-8 rounded-3xl shadow'>
              <div className='space-y-8'>
                <div className='relative aspect-video w-full rounded-3xl overflow-hidden'>
                  {exhibitionData.welcomeImage && (
                    <Image
                      src={exhibitionData.welcomeImage}
                      alt={localizedContent?.name || t('untitled_exhibition')}
                      fill
                      className='object-cover'
                    />
                  )}
                </div>
                <div className='space-y-6'>
                  <div className='flex justify-between gap-4 text-sm text-gray-600'>
                    <div className='flex items-center gap-1'>
                      <Share2 className='w-4 h-4' />
                    </div>
                    <div className='flex items-center gap-1'>
                      <span>{formatDateByLocale(exhibitionData.startDate, locale)}</span>
                    </div>
                  </div>

                  <div className='h-px bg-gray-200' />

                  <h1 className='text-2xl font-bold text-gray-900'>
                    {localizedContent?.name || t('untitled_exhibition')}
                  </h1>

                  <p className='text-sm text-gray-600'>
                    {localizedContent?.description}
                  </p>

                  {renderActionButton()}
                  
                  {/* Display remaining views if applicable */}
                  {canAccess && remainingViews !== null && totalViews !== null && !isPremium && remainingViews > 0 && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {t('remaining_views', { count: remainingViews, total: totalViews })}
                    </p>
                  )}
                  
                  {/* Display premium badge if applicable */}
                  {canAccess && isPremium && (
                    <div className="text-xs flex items-center justify-center gap-1 text-purple-700 mt-2">
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                        {t('premium_access')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <AuthDialog
          isOpen={showAuthDialog}
          setIsOpen={setShowAuthDialog}
        />
      </>
    );
  }

  return (
    <div>
      <Exhibition exhibition={exhibitionData} session={session} />
    </div>
  );
}