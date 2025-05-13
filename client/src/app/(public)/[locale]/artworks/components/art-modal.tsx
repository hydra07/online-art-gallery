import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import Image from '@/components/ui.custom/optimized-image';
import { Eye, Info, RulerIcon, TagIcon, UserIcon, X, CalendarIcon, BookmarkIcon, Flag, ShoppingCart, Download, Grid, Rows, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BiComment } from 'react-icons/bi';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchArtworkById, incrementView } from '@/app/(public)/[locale]/artworks/api';
import { Artwork } from '@/types/marketplace';
import CreateReport from '@/components/ui.custom/report-button';
import { RefType } from '@/utils/enums';
import AddArtworkCollection from '@/components/ui.custom/add-artwork-collection-in-user';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSwipeable } from "react-swipeable";
import { useToast } from "@/hooks/use-toast";
import artworkService, { downloadArtwork } from "@/service/artwork";
import {
  getArtworkWarehouse,
  downloadWarehouseArtwork,
} from "@/service/artwork-warehouse";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import ArtFeed from "./art-feed";
import useAuth from "@/hooks/useAuth-client";
import { AuthDialog } from "@/components/ui.custom/auth-dialog";
import {
  useSelectedArt,
  useSelectedArtId,
  useResetArtModal,
  useIsArtModalClosing,
  useStartClosingArtModal,
} from "@/hooks/useArtModal";
import CommentArtworkDrawer from "./comments-tab";
import { formatDateByLocale } from '@/utils/converters';

// Simplified animation variants
const animations = {
  tabTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  },
};

interface LoadingStateProps {
  message: string;
}

function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="text-white text-lg flex items-center gap-2 bg-black/40 px-6 py-3 rounded-lg">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        {message}
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
}

function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="text-white text-lg bg-red-500/20 p-4 rounded-lg max-w-md text-center">
        {message}
      </div>
    </div>
  );
}

interface ImageSectionProps {
  artwork: Artwork;
  isZoomed: boolean;
  toggleZoom: () => void;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
  t: any;
}

function ImageSection({
  artwork,
  isZoomed,
  toggleZoom,
  imageLoaded,
  setImageLoaded,
  t,
}: ImageSectionProps) {
  return (
    <div
      className="relative flex-1 flex items-center justify-center w-full lg:w-[60%] h-[45vh] sm:h-[50vh] lg:h-auto bg-black/60 overflow-hidden"
      onClick={toggleZoom}
    >
      {/* Zoom controls - optimized to match art-feed */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1.5">
        <button
          className="p-1.5 rounded-full hover:bg-black/50 active:bg-black/70 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
          aria-label={isZoomed ? t("artwork.zoom_out") : t("artwork.zoom_in")}
          title={isZoomed ? t("artwork.zoom_out") : t("artwork.zoom_in")}
        >
          {isZoomed ? (
            <ZoomOut className="w-4 h-4 text-white" />
          ) : (
            <ZoomIn className="w-4 h-4 text-white" />
          )}
        </button>

        {isZoomed && (
          <button
            className="p-1.5 rounded-full hover:bg-black/50 active:bg-black/70 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
            aria-label={t("artwork.reset_zoom")}
            title={t("artwork.reset_zoom")}
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Image loading indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/70 text-sm">
              {t("artwork.loading_image")}
            </p>
          </div>
        </div>
      )}

      {/* Main image */}
      <div className="w-full h-full flex items-center justify-center p-2 md:p-4">
        <Image
          width={artwork.dimensions?.width || 500}
          height={artwork.dimensions?.height || 500}
          alt={artwork.title || "Artwork"}
          src={artwork.url}
          className={`
            max-w-full max-h-full object-contain rounded
            transition-transform duration-200
            ${isZoomed ? "scale-150" : "scale-100"}
            ${imageLoaded ? "opacity-100" : "opacity-0"}
          `}
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAErgHY/gfP4gAAAABJRU5ErkJggg=="
          onLoadingComplete={() => setImageLoaded(true)}
          draggable={false}
        />
      </div>
    </div>
  );
}

interface DetailTabProps {
  artwork: Artwork;
  userHasPurchased: boolean;
  isArtworkCreator: boolean;
  handleBuy: () => void;
  handleDownload: () => void;
  downloadToken: string | null;
  isProcessing: boolean;
  isMobile: boolean;
  t: any;
  router: ReturnType<typeof useRouter>; // Add missing router parameter
}

function DetailTab({ artwork, userHasPurchased, isArtworkCreator, handleBuy, handleDownload, downloadToken, isProcessing, isMobile, t, router }: DetailTabProps) {
  const getartTypeBadge = (artType: string) => {
    switch (artType?.toLowerCase()) {
      case 'painting': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'digitalart': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const locale = useLocale();


  // Calculate optimal description height based on screen size and content
  const getDescriptionHeight = () => {
    const windowHeight =
      typeof window !== "undefined" ? window.innerHeight : 800;
    const availableHeight = windowHeight - (isMobile ? 400 : 200);
    const maxHeight = Math.max(availableHeight * 0.4, isMobile ? 100 : 150);

    if (isMobile) {
      return windowHeight < 700 ? "80px" : Math.min(maxHeight, 150) + "px";
    } else {
      return windowHeight < 900 ? "150px" : Math.min(maxHeight, 250) + "px";
    }
  };

  return (
    <motion.div
      key="details"
      variants={animations.tabTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 h-full"
    >
      <ScrollArea className="h-full pr-2">
        <div className="space-y-3 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">
              {artwork.title}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {artwork.artType && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getartTypeBadge(
                    artwork.artType
                  )}`}
                >
                  {artwork.artType}
                </span>
              )}
            </div>
          </div>

          {/* Price and Artist on same line */}
          <div className="grid grid-cols-2 gap-2">
            {/* Price */}
            {artwork.price > 0 && (
              <div className="bg-white/10 p-2 rounded-md flex items-center gap-1.5 col-span-1">
                <div className="p-1 rounded-full bg-green-500/20">

                </div>
                <span className="font-medium text-white text-xs">
                  {artwork.price.toLocaleString()} đ
                </span>

                {/* Status badges moved inline with price */}
                {isArtworkCreator && (
                  <Badge
                    variant="outline"
                    className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-1 py-0.5 text-[10px] ml-1"
                  >
                    {t("artwork.yours")}
                  </Badge>
                )}

                {userHasPurchased && (
                  <Badge
                    variant="outline"
                    className="bg-green-500/20 text-green-300 border-green-500/30 px-1 py-0.5 text-[10px] ml-1"
                  >
                    {t("artwork.purchased")}
                  </Badge>
                )}
              </div>
            )}

            {/* Artist */}
            {artwork.artistId && (
              <div className="bg-white/10 p-2 rounded-md flex items-center gap-1.5 col-span-1 overflow-hidden w-fit">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/${artwork.artistId!._id}`);
                  }}
                  className="flex items-center gap-1.5 w-full hover:opacity-80 transition-opacity"
                  title={t('artwork.view_artist_profile')}
                >
                  <Avatar className="h-12 w-12 flex-shrink-0 border border-white/20">
                    <AvatarImage
                      src={artwork.artistId.image}
                      alt={artwork.artistId.name || "Artist"}
                    />
                    <AvatarFallback className="bg-white/10 text-white text-[10px]">
                      {artwork.artistId.name?.charAt(0) || <UserIcon className="h-3 w-3" />}
                    </AvatarFallback>
                  </Avatar>
                  <p className='font-medium text-white text-xs truncate'>
                    {artwork.artistId.name || t('artwork.unknown_artist')}
                  </p>
                </button>
              </div>
            )}
          </div>

          {/* Buy button - optimized styling */}
          {artwork.status?.toLowerCase() === "selling" &&
            !userHasPurchased &&
            !isArtworkCreator && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuy();
                }}
                className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white w-full h-9 text-xs rounded-md flex items-center justify-center transition-colors"
              >
                <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                {t("artwork.buy")}
              </button>

            )}

          {/* Action Buttons - Optimized consistent styling */}
          <div className="grid grid-cols-2 gap-2">
            {!isArtworkCreator && userHasPurchased && (
              <button
                onClick={handleDownload}
                disabled={!downloadToken && isProcessing}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white text-xs h-9 col-span-2 rounded-md flex items-center justify-center transition-colors"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                {t('artwork.download')}
              </button>
            )}

            <AddArtworkCollection
              artworkId={artwork._id}
              triggerButton={
                <button
                  className={`flex items-center px-4 w-fit justify-center bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 text-white text-xs h-9 rounded-md transition-colors ${!isArtworkCreator && userHasPurchased ? "" : "col-span-2"
                    }`}
                >
                  <BookmarkIcon className="mr-1.5 h-3.5 w-3.5" />
                  {t("artwork.save")}
                </button>
              }
              onSuccess={() => {
                /* Optional success handling */
              }}
            />
          </div>

          {/* Description with improved dynamic height */}
          <div className="bg-white/10 border border-white/10 rounded-md p-2">
            <h3 className="text-sm font-medium text-white mb-1">
              {t("artwork.description")}
            </h3>
            <div
              className="overflow-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
              style={{ maxHeight: getDescriptionHeight() }}
            >
              <p className="text-xs text-white/90 leading-relaxed whitespace-pre-line">
                {artwork.description || t("artwork.no_description")}
              </p>
            </div>
          </div>

          {artwork.category && artwork.category.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <TagIcon className="w-3 h-3 text-white/70" />
                <span className="text-xs text-white/70">
                  {t("artwork.categories")}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {artwork.category.map((cat, index) => (
                  <span
                    key={index}
                    className="bg-white/10 text-white px-1.5 py-0.5 rounded text-[10px]"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white/5 rounded-md p-1.5 text-[10px] text-white/60">
            <div className="flex flex-wrap gap-y-1 gap-x-3 justify-between">
              <div className="flex items-center gap-1">
                <RulerIcon className="w-2.5 h-2.5" />
                <span>
                  {artwork.dimensions?.width || 0}×
                  {artwork.dimensions?.height || 0}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-2.5 h-2.5" />
                <span>{artwork.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-2.5 h-2.5" />
                <span>{formatDateByLocale(artwork.createdAt, locale)}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}

interface Comment {
  _id: string;
  content: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

interface PurchaseConfirmationProps {
  artwork: Artwork;
  userBalance: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
  isProcessing: boolean;
  t: any;
  tCommon: any;
  router: ReturnType<typeof useRouter>;
}

function PurchaseConfirmation({
  artwork,
  userBalance,
  isOpen,
  setIsOpen,
  onConfirm,
  isProcessing,
  t,
  tCommon,
  router,
}: PurchaseConfirmationProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-black/95 border border-white/20 text-white max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {t("artwork.purchase_confirmation")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/80">
            <div className="space-y-4 my-4">
              <div className="border border-white/10 rounded-md p-4 bg-white/5">
                <h3 className="font-medium mb-1 line-clamp-1">
                  {artwork.title}
                </h3>
                <p className="text-sm text-white/70 line-clamp-1">
                  {t("artwork.artist")}:{" "}
                  {artwork.artistId?.name || t("artwork.unknown_artist")}
                </p>
                <p className="text-xl font-bold mt-2">
                  {artwork.price?.toLocaleString()}
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span>{t("wallet.current_balance")}:</span>
                  <span className="font-medium">
                    đ{userBalance?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>{t("wallet.after_purchase")}:</span>
                  <span
                    className={`font-medium ${userBalance < artwork.price ? "text-red-400" : ""
                      }`}
                  >
                    đ{(userBalance - artwork.price)?.toLocaleString()}
                  </span>
                </div>

                {userBalance < artwork.price && (
                  <div className="mt-2 flex items-start gap-2 text-red-400 bg-red-400/10 p-2 rounded">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      {t("wallet.insufficient_balance")}
                    </p>
                  </div>
                )}

                {userBalance < artwork.price && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/wallet");
                    }}
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 px-3 rounded flex items-center justify-center gap-2"
                  >

                    {t("wallet.add_funds")}
                  </button>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border-0 flex-1 transition-colors">
            {tCommon("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white flex-1 transition-colors"
            disabled={userBalance < artwork.price || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {t("common.processing")}
              </div>
            ) : (
              t("artwork.confirm_purchase")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface SuccessDialogProps {
  artwork: Artwork;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onDownload: () => void;
  t: any;
  tCommon: any;
}

function SuccessDialog({
  artwork,
  isOpen,
  setIsOpen,
  onDownload,
  t,
  tCommon,
}: SuccessDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-black/95 border border-white/20 text-white max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center flex items-center justify-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            {t("artwork.purchase_success")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/80">
            <div className="text-center my-4 space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <p>{t("artwork.thank_you_purchase", { title: artwork.title })}</p>
              <p className="text-sm">{t("artwork.download_now")}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border-0 order-2 sm:order-1 transition-colors">
            {tCommon("close")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDownload}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white order-1 sm:order-2 transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            {t("artwork.download_image")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Modal() {
  const selectedArt = useSelectedArt();
  const selectedId = useSelectedArtId();
  const resetArtModal = useResetArtModal();
  const isClosing = useIsArtModalClosing();
  const startClosing = useStartClosingArtModal();

  const t = useTranslations();
  const tCommon = useTranslations("common");
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const queryClient = useQueryClient();
  const [showBuyConfirm, setShowBuyConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { user, status } = useAuth();
  const accessToken = user?.accessToken;

  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const [alternativeLayout, setAlternativeLayout] = useState(false);
  const [isLayoutTransitioning, setIsLayoutTransitioning] = useState(false);

  // Thêm ref để theo dõi thời gian xem
  const viewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasIncrementedRef = useRef(false);
  const openTimeRef = useRef<number | null>(null);

  // Thêm mutation để tăng lượt xem
  const viewMutation = useMutation({
    mutationFn: () => incrementView(selectedId as string),
    onSuccess: (response) => {
      // Cập nhật cache với dữ liệu mới, giữ nguyên các thông tin khác
      queryClient.setQueryData(["artworks", selectedId], (oldData: any) => ({
        ...oldData,
        data: {
          ...oldData.data,
          views: response.data.views
        }
      }));
    },
  });

  // Xử lý khi mở modal
  useEffect(() => {
    if (selectedId) {
      // Ghi lại thời điểm mở modal
      openTimeRef.current = Date.now();
      hasIncrementedRef.current = false;
    }
  }, [selectedId]);

  // Xử lý khi đóng modal
  const handleClose = useCallback(() => {
    // Kiểm tra thời gian xem có đủ 3 giây không
    if (openTimeRef.current && !hasIncrementedRef.current) {
      const viewDuration = Date.now() - openTimeRef.current;
      if (viewDuration >= 3000) { // 3 giây
        viewMutation.mutate();
        hasIncrementedRef.current = true;
      }
    }

    // First mark as closing (this triggers CSS transition)
    startClosing();

    // Then actually close after transition completes
    setTimeout(() => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "0";

      resetArtModal();

      const langPrefix = pathname.startsWith("/en") ? "/en" : "";
      const artworksBasePath = `${langPrefix}/artworks`;
      router.replace(artworksBasePath, { scroll: false });
    }, 150); // Match this to CSS transition duration
  // }, [startClosing, resetArtModal, router, pathname, viewMutation]);
  }, [startClosing, resetArtModal, router, pathname]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { data, isLoading, error, refetch: refetchArtworkById } = useQuery({
    queryKey: ["artworks", selectedId],
    queryFn: () =>
      selectedId ? fetchArtworkById(selectedId) : Promise.reject("Invalid ID"),
    enabled: !!selectedId,
  });

  const { data: balanceData } = useQuery({
    queryKey: ["userBalance"],
    queryFn: () => artworkService.getUserBalance(),
    enabled: !!accessToken && !!selectedId,
  });

  const { data: purchaseData } = useQuery({
    queryKey: ["userPurchased", selectedId],
    queryFn: () => artworkService.checkUserPurchased(selectedId as string),
    enabled: !!accessToken && !!selectedId,
  });

  const userBalance = balanceData?.data?.balance || 0;
  const userHasPurchased = purchaseData?.data?.hasPurchased || false;
  const artwork = data?.data as Artwork;

  const isArtworkCreator = useMemo(() => {
    return (
      user && artwork && artwork.artistId && user.id === artwork.artistId._id
    );
  }, [user, artwork]);

  const purchaseMutation = useMutation({
    mutationFn: () => artworkService.purchaseArtwork(selectedId as string),
    onMutate: () => {
      setIsProcessing(true);
    },
    onSuccess: (response) => {
      setIsProcessing(false);

      if (response.data?.success) {
        setDownloadToken(response.data?.downloadUrl || null);
        setShowBuyConfirm(false);
        setShowSuccess(true);
        toast({
          title: t("artwork.purchase_success"),
          description: t("artwork.purchase_success"),
        });

        queryClient.invalidateQueries({ queryKey: ["userBalance"] });
        queryClient.invalidateQueries({
          queryKey: ["userPurchased", selectedId],
        });
        queryClient.invalidateQueries({ queryKey: ["artworks", selectedId] });

        // Reload lại trang
        refetchArtworkById();
      } else {
        if (response.message?.includes("không đủ")) {
          toast({
            title: t("wallet.insufficient_balance"),
            description: t("wallet.insufficient_balance"),
          });
          router.push("/wallet/deposit");
        } else if (response.message?.includes("đã mua")) {
          toast({
            title: t("artwork.already_purchased"),
            description: t("artwork.already_purchased"),
          });
        } else {
          toast({
            title: response.message || t("common.error"),
            description: response.message || t("common.error"),
          });
        }
      }
    },
    onError: () => {
      setIsProcessing(false);
      toast({ title: t("common.error"), description: t("common.error") });
    },
  });

  const handleBuy = useCallback(() => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (userHasPurchased) {
      toast({
        title: t("artwork.already_purchased"),
        description: t("artwork.already_purchased"),
      });
      return;
    }

    setShowBuyConfirm(true);
  }, [user, userHasPurchased, t, toast]);

  const confirmBuy = useCallback(() => {
    if (!artwork) return;

    if (artwork.price > userBalance) {
      toast({
        title: t("wallet.insufficient_balance"),
        description: t("wallet.insufficient_balance"),
      });
      setShowBuyConfirm(false);
      router.push("/wallet/deposit");
      return;
    }

    purchaseMutation.mutate();
  }, [artwork, userBalance, purchaseMutation, t, toast, router]);

  const handleDownload = useCallback(async () => {
    if (!selectedId) return;

    if (!accessToken) {
      setShowAuthDialog(true);
      return;
    }

    try {
      toast({
        title: t("artwork.downloading"),
        description: t("artwork.downloading"),
      });

      let blobData;

      if (downloadToken) {
        blobData = await downloadArtwork(
          accessToken,
          selectedId,
          downloadToken
        );
      } else {
        const warehouseResponse = await getArtworkWarehouse(accessToken);

        if (!warehouseResponse.data?.items?.length) {
          toast({
            title: t("artwork.download_error"),
            description: t("artwork.download_error"),
          });
          return;
        }

        const warehouseItemId = warehouseResponse.data.items[0]._id;
        blobData = await downloadWarehouseArtwork(accessToken, warehouseItemId);
      }

      const url = window.URL.createObjectURL(blobData);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${artwork?.title || "artwork"}.jpg`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        toast({
          title: t("artwork.download_success"),
          description: t("artwork.download_success"),
        });

        queryClient.invalidateQueries({ queryKey: ["artworkWarehouse"] });
      }, 100);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        title: t("artwork.download_error"),
        description: t("artwork.download_error"),
      });
    }
  }, [
    selectedId,
    accessToken,
    downloadToken,
    artwork?.title,
    t,
    toast,
    queryClient,
  ]);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  const toggleLayout = useCallback(() => {
    if (isLayoutTransitioning) return;

    setIsLayoutTransitioning(true);
    setAlternativeLayout((prev) => !prev);

    setTimeout(() => {
      setIsLayoutTransitioning(false);
    }, 200);
  }, [isLayoutTransitioning]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeTab === "details") setActiveTab("comments");
    },
    onSwipedRight: () => {
      if (activeTab === "comments") setActiveTab("details");
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  useEffect(() => {
    if (!selectedId) return;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "0";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedId, handleClose]);

  if (isLoading) {
    return <LoadingState message={t("common.loading")} />;
  }

  if (error) {
    return <ErrorState message={t("common.error")} />;
  }

  if (!artwork || !artwork.dimensions) {
    return <ErrorState message={t("artwork.no_artwork_info")} />;
  }

  return (
    <Fragment>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 bg-black/80 backdrop-blur-sm transition-opacity duration-150 ${isClosing ? "opacity-0" : "opacity-100"
          }`}
        onClick={handleClose}
      >
        <div
          ref={modalRef}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-[1400px] relative rounded-lg sm:rounded-xl overflow-hidden flex flex-col lg:flex-row border border-white/20 bg-black/90 h-[100vh] sm:h-[95vh] md:h-[90vh] transition-transform duration-150 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
        >
          {/* Layout toggle button */}
          <button
            className="absolute top-3 left-3 z-50 p-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/60 active:bg-black/80 text-white focus:outline-none transition-colors"
            onClick={toggleLayout}
            disabled={isLayoutTransitioning}
            // aria-label={
            //   alternativeLayout
            //     ? t("artwork.standard_view")
            //     : t("artwork.immersive_view")
            // }
            // title={
            //   alternativeLayout
            //     ? t("artwork.standard_view")
            //     : t("artwork.immersive_view")
            // }
          >
            {alternativeLayout ? (
              <Rows className="h-4 w-4" />
            ) : (
              <Grid className="h-4 w-4" />
            )}
          </button>

          {/* Control buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-[51]">
            {user && artwork.artistId?._id !== user.id && ( // Add this condition
              <CreateReport
                refId={artwork._id}
                refType={RefType.ARTWORK}
                url={window.location.href}
                triggerElement={
                  <button
                    className="p-2 rounded-full bg-black/50 hover:bg-black/60 active:bg-black/80 transition-colors"
                    aria-label={t("artwork.report_artwork")}
                    title={t("artwork.report_artwork")}
                  >
                    <Flag className="w-4 h-4 text-white" />
                  </button>
                }
              />
            )}

            <button
              className="p-2 rounded-full bg-black/50 hover:bg-black/60 active:bg-black/80 transition-colors"
              onClick={handleClose}
              aria-label={t("common.close")}
              title={t("common.close")}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Layout switching */}
          {alternativeLayout ? (
            <div className="w-full h-full relative">
              <ArtFeed
                data={artwork}
                index={0}
                isActive={true}
                isInModal={true}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col lg:flex-row">
              <ImageSection
                artwork={artwork}
                isZoomed={isZoomed}
                toggleZoom={toggleZoom}
                imageLoaded={imageLoaded}
                setImageLoaded={setImageLoaded}
                t={t}
              />

              <div
                className="flex-1 flex flex-col lg:w-[40%] border-t lg:border-t-0 lg:border-l border-white/10 bg-black/90"
                {...swipeHandlers}
              >
                <div className="flex-1 flex flex-col h-full">
                  {/* Tab navigation - optimized buttons */}
                  <div className="relative px-3 sm:px-4 pt-3 sm:pt-4 mb-1">
                    <div className="flex justify-start gap-2 border-b border-white/20">
                      <button
                        onClick={() => setActiveTab("details")}
                        className={`px-3 py-2 text-sm relative ${activeTab === "details"
                          ? "text-white border-b-2 border-white"
                          : "text-white/60 hover:text-white/80"
                          }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Info className="w-4 h-4" />
                          {t("artwork.info")}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveTab("comments")}
                        className={`px-3 py-2 text-sm relative ${activeTab === "comments"
                          ? "text-white border-b-2 border-white"
                          : "text-white/60 hover:text-white/80"
                          }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <BiComment className="w-4 h-4" />

                          {t("artwork.comments")}
                          {((artwork as any)?.commentsCount || 0) > 0 && (
                            <span className="inline-flex items-center justify-center ml-1 bg-white/20 text-xs rounded-full w-5 h-5">
                              {(artwork as any).commentsCount}
                            </span>
                          )}
                        </span>
                      </button>
                    </div>

                    <div className="text-xs text-white/50 mt-1 text-center sm:hidden">
                      {t("artwork.swipe_to_change_tabs")}
                    </div>
                  </div>

                  {/* Tab content */}
                  <div className="flex-1 px-3 sm:px-4 pb-3 sm:pb-4 overflow-hidden"          >
                    {activeTab === "details" ? (
                      <DetailTab
                        artwork={artwork}
                        userHasPurchased={userHasPurchased}
                        isArtworkCreator={!!isArtworkCreator}
                        handleBuy={handleBuy}
                        handleDownload={handleDownload}
                        downloadToken={downloadToken}
                        isProcessing={isProcessing}
                        isMobile={isMobile}
                        t={t}
                        router={router}
                      />
                    ) : (
                      <CommentArtworkDrawer
                        contentId={artwork._id}
                        contentType={"artwork"}
                        authorId={artwork.artistId?._id ?? ""}
                        isSignedIn={!!user}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <PurchaseConfirmation
        artwork={artwork}
        userBalance={userBalance}
        isOpen={showBuyConfirm}
        setIsOpen={setShowBuyConfirm}
        onConfirm={confirmBuy}
        isProcessing={isProcessing}
        t={t}
        tCommon={tCommon}
        router={router}
      />

      <SuccessDialog
        artwork={artwork}
        isOpen={showSuccess}
        setIsOpen={setShowSuccess}
        onDownload={handleDownload}
        t={t}
        tCommon={tCommon}
      />

      <AuthDialog isOpen={showAuthDialog} setIsOpen={setShowAuthDialog} />
    </Fragment>
  );
}

export default Modal;

