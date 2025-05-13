'use client';
import { artworkService } from '@/app/(public)/[locale]/artists/queries';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { vietnamCurrency } from '@/utils/converters';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { BookmarkIcon, CheckCircle2, Clock, Edit2, Eye, FilterX, Search, ShieldAlert, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import EditArtworkForm from '../components/artist-update';
import ConfirmationDialog from '../components/confirmation-dialog';
import { ITEMS_PER_PAGE, ARTWORK_STATUS } from '../constant';
import { Artwork } from '../interface';
import AddArtworkCollection from '@/components/ui.custom/add-artwork-collection-in-artist';
import { useTranslations } from 'next-intl';
import React from 'react';
// Simplified animation variants
const tabAnimationVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const skeletonVariant = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            staggerChildren: 0.05
        }
    }
};

const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

// Improved ArtworkCard Component with better text contrast, button effects and skeleton loading
// eslint-disable-next-line react/display-name
const ArtworkCard = React.memo(({
    artwork,
    isMobile,
    onEdit,
    onDelete,
    t
}: {
    artwork: Artwork,
    isMobile: boolean,
    onEdit: (artwork: Artwork) => void,
    onDelete: (id: string) => void,
    t: ReturnType<typeof useTranslations>
}) => {
    const imageUrl = artwork.url || '/placeholder.svg';
    const statusOption = ARTWORK_STATUS(t).find((opt) => opt.value === artwork.status);
    const statusColor = statusOption ? statusOption.color : 'bg-gray-500';

    const moderationStatus = artwork.moderationStatus || 'pending';
    const moderationInfo = {
        value: moderationStatus,
        label: t(`moderation_status.${moderationStatus}`),
        icon: moderationStatus === 'pending' ? Clock :
            moderationStatus === 'rejected' ? ShieldAlert :
                moderationStatus === 'approved' ? CheckCircle2 : Eye,
        color: moderationStatus === 'pending' ? 'bg-amber-500' :
            moderationStatus === 'rejected' ? 'bg-red-500' :
                moderationStatus === 'approved' ? 'bg-emerald-500' : 'bg-slate-500',
        textColor: moderationStatus === 'pending' ? 'text-amber-500' :
            moderationStatus === 'rejected' ? 'text-red-500' :
                moderationStatus === 'approved' ? 'text-emerald-500' : 'text-slate-500',
        bgColor: moderationStatus === 'pending' ? 'bg-amber-100' :
            moderationStatus === 'rejected' ? 'bg-red-100' :
                moderationStatus === 'approved' ? 'bg-emerald-100' : 'bg-slate-100'
    };
    const ModIcon = moderationInfo.icon;

    return (
        <motion.div
            className="group relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <Card className={`overflow-hidden rounded-lg border ${moderationStatus === 'pending' ? 'border-amber-300' :
                moderationStatus === 'rejected' ? 'border-red-300' :
                    'border-emerald-300'
                } dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 artwork-card-hover`}>
                <div className={`relative ${isMobile ? 'aspect-[4/5]' : 'aspect-[2/3]'}`}>
                    {/* Main image */}
                    <Image
                        src={imageUrl}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
                    />

                    {/* Status badge - top right */}
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor} text-white shadow-md backdrop-blur-sm`}>
                        {artwork.status}
                    </div>

                    {/* Moderation status badge - top left */}
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${moderationInfo.bgColor} ${moderationInfo.textColor} shadow-md flex items-center gap-1 backdrop-blur-sm`}>
                        <ModIcon className="h-3 w-3" />
                        <span>{moderationInfo.label}</span>
                    </div>

                    {/* Bottom info bar with title and metadata */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-8 pb-3 px-3">
                        <h3 className="text-sm font-semibold text-white line-clamp-1 mb-1">
                            {artwork.title}
                        </h3>

                        <div className="flex justify-between items-center">
                            {/* Categories on the left */}
                            {artwork.category && artwork.category.length > 0 && (
                                <div className="flex flex-wrap gap-1 max-w-[65%]">
                                    <span className="px-1.5 py-0.5 bg-black/40 text-[10px] text-white rounded-md backdrop-blur-sm">
                                        {artwork.category[0]}
                                    </span>
                                    {artwork.category.length > 1 && (
                                        <span className="px-1.5 py-0.5 bg-black/40 text-[10px] text-white rounded-md backdrop-blur-sm">
                                            +{artwork.category.length - 1}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Dimensions on the right */}
                            {artwork.dimensions && (
                                <div className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-black/40 text-white shadow-sm backdrop-blur-sm ml-auto">
                                    {artwork.dimensions.width} × {artwork.dimensions.height}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Improved hover overlay with detailed info and actions */}
                    <div
                        className="absolute inset-0 p-4 flex flex-col opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
                        style={{
                            background: "linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 40, 40, 0.8))",
                            backdropFilter: "blur(4px)",
                            WebkitBackdropFilter: "blur(4px)",
                        }}
                    >
                        <div className="space-y-3 flex-1">
                            <h3 className="text-sm md:text-base font-semibold text-white drop-shadow-md">
                                {artwork.title}
                            </h3>

                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium px-2 py-0.5 bg-teal-500/40 rounded-full text-white shadow-sm backdrop-blur-sm inline-block">
                                    {vietnamCurrency(artwork.price)}
                                </p>

                                {artwork.views > 0 && (
                                    <p className="text-xs px-2 py-0.5 bg-slate-500/40 rounded-full text-white shadow-sm backdrop-blur-sm flex items-center gap-1">
                                        <Eye className="h-3 w-3 text-white" />
                                        {artwork.views.toLocaleString()}
                                    </p>
                                )}
                            </div>

                            <p className="text-xs text-white line-clamp-3 bg-black/30 p-2 rounded-md backdrop-blur-sm shadow-sm">
                                {artwork.description}
                            </p>

                            {/* Dimensions info */}
                            {artwork.dimensions && (
                                <div className="text-xs text-white px-2 py-1 bg-slate-600/40 rounded-md backdrop-blur-sm shadow-sm inline-block">
                                    <span className="font-semibold text-white">{t('dimensions')}:</span> {artwork.dimensions.width} × {artwork.dimensions.height} px
                                </div>
                            )}

                            {/* Categories */}
                            {artwork.category && artwork.category.length > 0 && (
                                <div className="space-y-1">
                                    <div className="text-xs text-white font-semibold">{t('categories')}:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {artwork.category.map((cat, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-indigo-400/40 text-[10px] text-white rounded-full backdrop-blur-sm shadow-sm">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action buttons with improved contrast and effects */}
                        <div className="mt-auto space-y-2 border-t border-white/20 pt-3">
                            {artwork.moderationStatus === 'approved' && (
                                <AddArtworkCollection
                                    artworkId={artwork._id}
                                    triggerButton={
                                        <Button
                                            size="sm"
                                            className="w-full bg-cyan-600 hover:bg-cyan-500 hover:scale-[1.02] active:scale-[0.98] text-white text-xs flex items-center justify-center gap-1 shadow-md transition-all font-medium"
                                        >
                                            <BookmarkIcon className="h-3 w-3" /> {t('save_collection')}
                                        </Button>
                                    }
                                />
                            )}

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="flex-1 bg-amber-600 hover:bg-amber-500 hover:scale-[1.02] active:scale-[0.98] text-white text-xs flex items-center justify-center gap-1 shadow-md transition-all font-medium"
                                    onClick={() => onEdit(artwork)}
                                >
                                    <Edit2 className="h-3 w-3" /> {t('edit')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="flex-1 bg-rose-600 hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] text-white text-xs flex items-center justify-center gap-1 shadow-md transition-all font-medium"
                                    onClick={() => onDelete(artwork._id)}
                                >
                                    <Trash2 className="h-3 w-3" /> {t('delete')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
});

// Skeleton component for loading state
const ArtworkSkeleton = ({ isMobile }: { isMobile: boolean }) => (
    <motion.div
        variants={itemVariant}
        className="overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
            duration: 0.5,
            ease: "easeInOut"
        }}
    >
        <Card className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className={`relative ${isMobile ? 'aspect-[4/5]' : 'aspect-[2/3]'}`}>
                <Skeleton className="w-full h-full rounded-lg absolute inset-0">
                    <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer"
                        style={{
                            backgroundSize: '400% 100%',
                            animation: 'shimmer 1.8s ease-in-out infinite'
                        }}
                    />
                </Skeleton>

                {/* Status badge skeleton - top right */}
                <Skeleton className="absolute top-2 right-2 h-4 w-16 rounded-full shadow-sm" />

                {/* Moderation status badge skeleton - top left */}
                <Skeleton className="absolute top-2 left-2 h-5 w-20 rounded-full shadow-sm" />

                {/* Bottom content skeleton with gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-gray-200/80 to-transparent dark:from-gray-700/80 pt-8">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <div className="flex justify-between">
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                </div>
            </div>
        </Card>
    </motion.div>
);

// Empty state component
const EmptyState = ({
    currentModeration,
    debouncedSearch,
    statusFilter,
    resetFilters,
    t
}: {
    currentModeration: any,
    debouncedSearch: string,
    statusFilter: string,
    resetFilters: () => void,
    t: ReturnType<typeof useTranslations>
}) => {
    const Icon = currentModeration.icon;

    return (
        <div className="text-center py-8 border rounded-lg bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-teal-900/30 dark:to-emerald-900/10 space-y-3">
            <div className="flex justify-center">
                <div className={`p-4 rounded-full ${currentModeration.bgColor}`}>
                    <Icon className={`h-8 w-8 ${currentModeration.textColor}`} />
                </div>
            </div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-200">
                {t('empty_state', { moderationStatus: currentModeration.value !== 'all' ? currentModeration.label : '' })}
            </p>
            <p className="text-xs text-teal-600 dark:text-teal-400">
                {debouncedSearch || statusFilter !== 'all' ? t('change_filters') : t('add_first_artwork')}
            </p>
            {(debouncedSearch || statusFilter !== 'all') && (
                <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="text-sm text-teal-700 dark:text-teal-200 border-teal-200 dark:border-teal-600 hover:bg-teal-100 dark:hover:bg-teal-700/50"
                >
                    {t('clear_filters')}
                </Button>
            )}
        </div>
    );
};

// Main component
export default function ManageArtworks() {
    const t = useTranslations('artwork_management');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
    const [currentPage, setCurrentPage] = useState(Number(searchParams?.get('page')) || 1);
    const [statusFilter, setStatusFilter] = useState(searchParams?.get('status') || 'all');
    const [moderationStatusFilter, setModerationStatusFilter] = useState(
        searchParams?.get('moderationStatus') || 'all'
    );
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteArtworkId, setDeleteArtworkId] = useState<string | null>(null);
    const searchTimeoutRef = useRef<number | null>(null);

    // Define moderation status options with icons and colors
    const MODERATION_STATUS_OPTIONS = useMemo(() => [
        {
            value: 'all',
            label: t('moderation_status.all'),
            icon: Eye,
            color: 'bg-slate-500',
            textColor: 'text-slate-500',
            bgColor: 'bg-slate-100'
        },
        {
            value: 'pending',
            label: t('moderation_status.pending'),
            icon: Clock,
            color: 'bg-amber-500',
            textColor: 'text-amber-500',
            bgColor: 'bg-amber-100'
        },
        {
            value: 'rejected',
            label: t('moderation_status.rejected'),
            icon: ShieldAlert,
            color: 'bg-red-500',
            textColor: 'text-red-500',
            bgColor: 'bg-red-100'
        },
        {
            value: 'approved',
            label: t('moderation_status.approved'),
            icon: CheckCircle2,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-500',
            bgColor: 'bg-emerald-100'
        },
    ], [t]);

    // Handle mobile detection
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update URL with filters
    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString());
        if (searchTerm) params.set('search', searchTerm); else params.delete('search');
        if (currentPage > 1) params.set('page', currentPage.toString()); else params.delete('page');
        if (statusFilter !== 'all') params.set('status', statusFilter); else params.delete('status');
        if (moderationStatusFilter !== 'all') params.set('moderationStatus', moderationStatusFilter); else params.delete('moderationStatus');
        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }, [currentPage, searchTerm, statusFilter, moderationStatusFilter, pathname, router, searchParams]);

    // Handle search with debounce
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setSearchTerm(value);
            if (currentPage !== 1) setCurrentPage(1);
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = window.setTimeout(() => setDebouncedSearch(value), 400);
        },
        [currentPage]
    );

    // Query options based on filters
    const queryOptions = useMemo(
        () => ({
            title: debouncedSearch,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            moderationStatus: moderationStatusFilter !== 'all' ? moderationStatusFilter : undefined,
        }),
        [debouncedSearch, statusFilter, moderationStatusFilter]
    );

    // Fetch artworks data
    const { data, error, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['artworks', currentPage, debouncedSearch, statusFilter, moderationStatusFilter],
        queryFn: () => artworkService.getArtist(queryOptions, currentPage),
        placeholderData: (previousData: any) => previousData,
    });

    // Delete artwork mutation
    const deleteArtworkMutation = useMutation({
        mutationFn: (id: string) => artworkService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['artworks', currentPage, debouncedSearch, statusFilter, moderationStatusFilter]
            });
            refetch();
            setDeleteConfirmOpen(false);
            setDeleteArtworkId(null);
        },
        onError: (error) => console.error('Deletion failed:', error),
    });

    // Process data
    const artworks: Artwork[] = data?.data.artworks || [];
    const totalCount = data?.data.total || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Current moderation option
    const currentModerationOption = MODERATION_STATUS_OPTIONS.find(
        opt => opt.value === moderationStatusFilter
    ) || MODERATION_STATUS_OPTIONS[0];

    // Calculate counts by moderation status for badges
    const moderationCounts = useMemo(() => {
        const counts = {
            all: totalCount,
            pending: 0,
            rejected: 0,
            approved: 0
        };

        if (data?.data?.artworks) {
            data.data.artworks.forEach((artwork: Artwork) => {
                if (artwork.moderationStatus) {
                    counts[artwork.moderationStatus as keyof typeof counts] =
                        (counts[artwork.moderationStatus as keyof typeof counts] || 0) + 1;
                }
            });
        }

        return counts;
    }, [data?.data?.artworks, totalCount]);

    // Filter reset handler
    const resetFilters = useCallback(() => {
        setSearchTerm('');
        setDebouncedSearch('');
        setStatusFilter('all');
        setModerationStatusFilter('all');
        setCurrentPage(1);
    }, []);

    // Filter change handlers
    const handleStatusChange = useCallback((value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    }, []);

    const handleModerationStatusChange = useCallback((value: string) => {
        setModerationStatusFilter(value);
        setCurrentPage(1);
    }, []);

    // Handle artwork edit/delete
    const handleEditArtwork = useCallback((artwork: Artwork) => {
        setSelectedArtwork(artwork);
        setEditModalOpen(true);
    }, []);

    const handleDeleteArtwork = useCallback((id: string) => {
        setDeleteArtworkId(id);
        setDeleteConfirmOpen(true);
    }, []);

    // Pagination rendering
    const renderPaginationItems = useCallback(() => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className="text-xs md:text-sm text-teal-700 dark:text-teal-200"
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            ));
        }

        const items = [];
        // First page
        items.push(
            <PaginationItem key={1}>
                <PaginationLink
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(1);
                    }}
                    isActive={currentPage === 1}
                    className="text-xs md:text-sm text-teal-700 dark:text-teal-200"
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        // Ellipsis for pages before current
        if (currentPage > 3) {
            items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
        }

        // Pages around current
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        for (let i = startPage; i <= endPage; i++) {
            if (i <= 1 || i >= totalPages) continue;
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i);
                        }}
                        isActive={currentPage === i}
                        className="text-xs md:text-sm text-teal-700 dark:text-teal-200"
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Ellipsis for pages after current
        if (currentPage < totalPages - 2) {
            items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
        }

        // Last page
        if (totalPages > 1) {
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(totalPages);
                        }}
                        isActive={currentPage === totalPages}
                        className="text-xs md:text-sm text-teal-700 dark:text-teal-200"
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    }, [currentPage, totalPages]);

    return (
        <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                    {t('title')}
                </h1>
                <p className="text-xs md:text-sm text-teal-600 dark:text-cyan-400">
                    {t('total_artworks', { count: totalCount })}
                </p>
            </div>

            <div>
                {/* Filter tabs with improved animations */}
                <div className="w-full overflow-x-auto no-scrollbar mb-4">
                    <div className="flex gap-1 p-1 bg-teal-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm relative">
                        {/* Active tab indicator - animated */}
                        <motion.div
                            className="absolute h-[calc(100%-8px)] rounded-md bg-white dark:bg-gray-700 shadow-sm"
                            initial={false}
                            layout
                            animate={{
                                left: `calc(${MODERATION_STATUS_OPTIONS.findIndex(opt => opt.value === moderationStatusFilter) * (100 / MODERATION_STATUS_OPTIONS.length)}%)`,
                                width: `calc(${100 / MODERATION_STATUS_OPTIONS.length}% - 2px)`
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 28,
                                mass: 0.8
                            }}
                            style={{ top: "4px" }}
                        />

                        {MODERATION_STATUS_OPTIONS.map((option) => (
                            <motion.button
                                key={option.value}
                                onClick={() => handleModerationStatusChange(option.value)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center justify-center gap-1.5 py-2 px-3 text-sm rounded-md transition-all duration-200 flex-1 min-w-[90px] z-10 ${moderationStatusFilter === option.value
                                    ? `${option.textColor} font-medium`
                                    : 'text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                <option.icon className={`h-3.5 w-3.5 ${moderationStatusFilter === option.value ? option.textColor : ''}`} />
                                <span className="hidden sm:inline whitespace-nowrap">{option.label}</span>
                                {(option.value === 'all' || moderationStatusFilter === option.value) && (
                                    <Badge
                                        className={`${option.bgColor} ${option.textColor} border-0 px-1.5 py-0 ml-1 transition-all`}
                                    >
                                        {option.value === 'all'
                                            ? totalCount
                                            : moderationCounts[option.value as keyof typeof moderationCounts] || 0}
                                    </Badge>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Search and filters */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 mb-4">
                    {/* Search box */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal-500 dark:text-teal-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-8 rounded-lg border-gray-200 dark:border-gray-700 shadow-sm text-sm focus:ring-2 focus:ring-teal-500 h-9 bg-gray-50 dark:bg-gray-700/30 text-gray-700 dark:text-gray-200"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setDebouncedSearch('');
                                    if (currentPage !== 1) setCurrentPage(1);
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-600 dark:hover:text-teal-300 p-1 rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Status filter */}
                    <Select value={statusFilter} onValueChange={handleStatusChange}>
                        <SelectTrigger
                            className="w-full max-w-[140px] rounded-lg border-gray-200 dark:border-gray-700 shadow-sm text-sm h-9 bg-gray-50 dark:bg-gray-700/30 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-teal-500">
                            <SelectValue placeholder={t('status')} />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                            {ARTWORK_STATUS(t).map((option) => (
                                <SelectItem key={option.value} value={option.value}
                                    className="text-sm text-gray-700 dark:text-gray-200">
                                    <span className={`inline-block w-2 h-2 rounded-full ${option.color} mr-2`}></span>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Reset filters button */}
                    {(debouncedSearch || statusFilter !== 'all') && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={resetFilters}
                            className="h-9 w-9 rounded-lg border-teal-200 dark:border-teal-600 text-teal-500 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-700/50"
                        >
                            <FilterX className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Mobile Pagination */}
                {totalPages > 0 && isMobile && (
                    <div className="mb-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                                        }}
                                        className={currentPage === 1 ? 'pointer-events-none opacity-50 text-teal-500 dark:text-teal-400' : 'text-teal-500 dark:text-teal-400'}
                                    />
                                </PaginationItem>
                                {renderPaginationItems()}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                        }}
                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50 text-teal-500 dark:text-teal-400' : 'text-teal-500 dark:text-teal-400'}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        // Loading state with improved staggered item loading
                        <motion.div
                            key="loading"
                            variants={skeletonVariant}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
                        >
                            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariant}
                                    custom={index}
                                >
                                    <ArtworkSkeleton isMobile={isMobile} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : error ? (
                        // Error state
                        <div className="text-center py-8 border rounded-lg bg-red-50/50 dark:bg-red-900/10 space-y-3">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                <X className="h-8 w-8 text-red-500" />
                            </div>
                            <p className="text-sm text-red-500 dark:text-red-400 font-medium">
                                {t('error_loading')}
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => refetch()}
                                className="text-sm text-red-700 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                                {t('retry')}
                            </Button>
                        </div>
                    ) : artworks.length === 0 ? (
                        // Empty state
                        <EmptyState
                            currentModeration={currentModerationOption}
                            debouncedSearch={debouncedSearch}
                            statusFilter={statusFilter}
                            resetFilters={resetFilters}
                            t={t}
                        />
                    ) : (
                        // Content state with staggered appearance of items
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Remove full page loading overlay and replace with individual loading states */}
                            <div className="relative">
                                {/* Artwork grid with optimized individual loading */}
                                <motion.div
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
                                    variants={skeletonVariant}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {artworks.map((artwork, index) => (
                                        <motion.div
                                            key={artwork._id}
                                            variants={itemVariant}
                                            custom={index}
                                            initial="hidden"
                                            animate="visible"
                                            exit={{ opacity: 0, y: 10 }}
                                        >
                                            <ArtworkCard
                                                artwork={artwork}
                                                isMobile={isMobile}
                                                onEdit={handleEditArtwork}
                                                onDelete={handleDeleteArtwork}
                                                t={t}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Desktop Pagination */}
                            {totalPages > 0 && !isMobile && (
                                <div className="mt-6">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                                                    }}
                                                    className={currentPage === 1 ? 'pointer-events-none opacity-50 text-teal-500 dark:text-teal-400' : 'text-teal-500 dark:text-teal-400'}
                                                />
                                            </PaginationItem>
                                            {renderPaginationItems()}
                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                                    }}
                                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50 text-teal-500 dark:text-teal-400' : 'text-teal-500 dark:text-teal-400'}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && selectedArtwork && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditModalOpen(false)}
                            className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 shadow-md z-20 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </Button>
                        <EditArtworkForm artwork={selectedArtwork} onClose={() => setEditModalOpen(false)} />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={isDeleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={() => {
                    if (deleteArtworkId) deleteArtworkMutation.mutate(deleteArtworkId);
                }}
                message={t('delete_confirmation')}
            />
        </div>
    );
}

