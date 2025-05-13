'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { getArtworkWarehouse, downloadWarehouseArtwork } from '@/service/artwork-warehouse';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { 
    Download, 
    Image as ImageIcon, 
    ExternalLink, 
    ChevronRight, 
    ChevronLeft, 
    Calendar, 
    Clock, 
    Package, 
    Layers, 
    Grid,
    History,
    CheckCircle2,
    Info,
    Star,
    Eye,
    DollarSign
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';

const ITEMS_PER_PAGE = 9;

// Define the PaginationProps interface
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// Updated interface to match backend API response
interface WarehouseItem {
    _id: string;
    purchasedAt: string;
    downloadCount: number;
    viewCount?: number;
    artworkId: {
        _id: string;
        title?: string;
        url?: string;
        price?: string | number | object;
        dimensions?: string | { width?: number; height?: number };
        artistId?: {
            name?: string;
        };
    };
    userId?: {
        name?: string;
    };
}

export default function WarehouseClient() {
    const { data: session } = useSession();
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState('all');
    const { toast } = useToast();

    // Sử dụng hook useTranslations để lấy chuỗi dịch
    const t = useTranslations('warehouse');
    const locale = useLocale();

    // Lấy danh sách tranh trong kho
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['artworkWarehouse', page, activeTab],
        queryFn: () => getArtworkWarehouse(
            session?.user.accessToken as string,
            {
                page,
                limit: ITEMS_PER_PAGE,
                filter: activeTab !== 'all' ? activeTab : undefined
            }
        ),
        enabled: !!session?.user.accessToken
    });

    // Explicitly cast the warehouseItems to our interface
    const warehouseItems = (data?.data?.items || []) as WarehouseItem[];
    const totalItems = data?.data?.total || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Enhance the download function with better toast management
    const handleDownload = async (warehouseItemId: string, title: string) => {
        try {
            // Create an initial toast notification
            const { id: toastId } = toast({
                title: t('artwork.downloading'),
                description: (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        <span>{t('artwork.downloading_description', { title: title || t('artwork.untitled') })}</span>
                    </div>
                ),
                duration: 30000, // Long duration since we'll dismiss it manually
            });

            const blob = await downloadWarehouseArtwork(
                session?.user.accessToken as string,
                warehouseItemId
            );

            // Tạo URL từ blob và tải file
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title || 'artwork'}.jpg`;
            document.body.appendChild(link);
            link.click();

            // Dọn dẹp
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
                
                // Update the toast using the correct approach
                toast({
                    title: t('artwork.download_success'),
                    description: (
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>{t('artwork.download_success_description', { title: title || t('artwork.untitled') })}</span>
                        </div>
                    ),
                    duration: 3000,
                });
                
                refetch(); // Cập nhật lại dữ liệu để cập nhật downloadCount
            }, 100);
        } catch (error) {
            console.error(error);
            toast({
                title: t('artwork.download_error'),
                description: (
                    <div className="flex items-center gap-2 text-red-500">
                        <Info className="h-4 w-4" />
                        <span>{t('artwork.download_error_description')}</span>
                    </div>
                ),
                variant: "destructive",
            });
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const formatDate = (dateString: string) => {
        return format(
            new Date(dateString),
            'dd/MM/yyyy HH:mm',
            { locale: locale === 'vi' ? vi : enUS }
        );
    };

    // Optimized loading skeletons with reduced animations
    const renderSkeletons = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 shadow-md dark:shadow-black/10">
                    {/* Main image skeleton - only one animated element per card */}
                    <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 relative">
                        <div className="absolute top-3 right-3 w-24 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>
                    <CardHeader className="pb-2 space-y-2">
                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    </CardHeader>
                    <CardContent className="pb-2 space-y-2">
                        <div className="flex items-center">
                            <div className="h-4 w-4 mr-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                        <div className="flex items-center">
                            <div className="h-4 w-4 mr-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2 gap-2">
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );

    // Render danh sách tranh with optimized loading
    const renderWarehouseItems = () => {
        if (isLoading) {
            return renderSkeletons();
        }

        if (error || !warehouseItems.length) {
            return (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-6 bg-gray-50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/30 mx-auto max-w-2xl"
                >
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 p-6 rounded-full shadow-inner">
                        <Package className="h-16 w-16 text-blue-500 dark:text-blue-300" />
                    </div>
                    <div className="space-y-3 max-w-md">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 flex items-center justify-center gap-2">
                            <Info className="h-5 w-5 text-blue-500" />
                            {t('empty.title')}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
                            {t('empty.description')}
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="mt-4 px-8 py-6 h-auto font-medium text-base bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                        onClick={() => router.push('/artworks')}
                    >
                        <Layers className="mr-2 h-5 w-5" />
                        {t('empty.explore')}
                    </Button>
                </motion.div>
            );
        }

        return (
            <AnimatePresence mode="wait">
                <motion.div 
                    key="artwork-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {warehouseItems.map((item: WarehouseItem, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card className="overflow-hidden h-full flex flex-col bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-300">
                                    <div className="relative w-full aspect-[4/3] overflow-hidden group">
                                        {item.artworkId?.url ? (
                                            <>
                                                <Image
                                                    src={item.artworkId.url}
                                                    alt={item.artworkId.title || t('artwork.untitled')}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <Badge className="bg-black/70 text-white dark:bg-white/20 backdrop-blur-sm">
                                                        <Eye className="h-3 w-3 mr-1.5 text-blue-300" />
                                                        {/* Safely access viewCount with specific type check */}
                                                        {'viewCount' in item && typeof item.viewCount === 'number' ? item.viewCount : 0}
                                                    </Badge>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black">
                                                <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-400" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-blue-600/90 dark:bg-blue-700/90 text-white font-medium backdrop-blur-sm shadow-sm">
                                                {typeof item.downloadCount === 'number' && item.downloadCount > 0
                                                    ? (
                                                        <> 
                                                            <CheckCircle2 className="h-3 w-3 mr-1.5 text-green-300" />
                                                            {t('artwork.download_count', { count: item.downloadCount })}
                                                        </>
                                                    ) 
                                                    : (
                                                        <>
                                                            <Clock className="h-3 w-3 mr-1.5 text-amber-200" />
                                                            {t('artwork.not_downloaded')}
                                                        </>
                                                    )}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="pb-1 pt-4">
                                        <CardTitle className="text-gray-900 dark:text-gray-50 truncate text-lg font-semibold group flex items-center">
                                            <Star className="h-4 w-4 mr-1.5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                                            {item.artworkId?.title || t('artwork.untitled')}
                                        </CardTitle>
                                        <CardDescription className="text-gray-700 dark:text-gray-200 font-medium">
                                            {t('artwork.artist')}: {(item.artworkId?.artistId?.name || item.userId?.name || t('artwork.unknown_artist'))}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2 flex-grow space-y-2.5">
                                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                                            <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0 text-blue-500 dark:text-blue-300" />
                                            <span className="leading-tight">{t('artwork.purchased_on')}: <span className="font-medium">{formatDate(item.purchasedAt)}</span></span>
                                        </div>
                                        
                                        {item.artworkId?.price && (
                                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                                                <DollarSign className="h-4 w-4 mr-1.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                                                <span className="leading-tight">
                                                    {t('artwork.price')}: <span className="font-medium">{
                                                        typeof item.artworkId.price === 'object' 
                                                            ? JSON.stringify(item.artworkId.price) 
                                                            : item.artworkId.price
                                                    }</span>
                                                </span>
                                            </div>
                                        )}
                                        
                                        {item.artworkId?.dimensions && (
                                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                                                <Layers className="h-4 w-4 mr-1.5 flex-shrink-0 text-purple-500 dark:text-purple-300" />
                                                <span className="leading-tight">
                                                    {t('artwork.dimensions')}: <span className="font-medium">{
                                                        typeof item.artworkId.dimensions === 'object'
                                                            ? `${item.artworkId.dimensions.width || 0}x${item.artworkId.dimensions.height || 0}`
                                                            : item.artworkId.dimensions
                                                    }</span>
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="pt-4 gap-3 border-t border-gray-200 dark:border-gray-700/30 mt-auto">
                                        <Button
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium shadow-md hover:shadow-lg"
                                            onClick={() => handleDownload(item._id, item.artworkId?.title || t('artwork.untitled'))}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            {t('artwork.download')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                                            onClick={() => router.push(`/artworks?id=${item.artworkId._id}`)}
                                            title={t('artwork.view_details')}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-12">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    <div className="max-w-3xl space-y-3 mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 tracking-tight flex items-center">
                            <Package className="mr-3 h-8 w-8 text-blue-500 dark:text-blue-400" />
                            {t('title')}
                        </h1>
                        <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
                            {t('description')}
                        </p>
                    </div>

                    <Tabs 
                        defaultValue="all" 
                        onValueChange={(value) => {
                            setActiveTab(value);
                            // Reset to page 1 when changing tabs
                            setPage(1);
                        }} 
                        className="w-full"
                    >
                        <div className="border-b border-gray-200 dark:border-gray-700/50 mb-8 sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm py-2">
                            <TabsList className="bg-gray-50 dark:bg-gray-800/80 h-12 p-1 rounded-t-lg border-b-0 border border-gray-200 dark:border-gray-700/50 w-full sm:w-auto overflow-x-auto flex-nowrap">
                                <TabsTrigger 
                                    value="all" 
                                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-700/90 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-200 rounded-md font-medium min-w-[100px] flex-shrink-0"
                                >
                                    <Grid className="mr-2 h-4 w-4" />
                                    {t('tabs.all')}
                                    {!isLoading && <span className="ml-1.5 text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">{totalItems}</span>}
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="recent" 
                                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-700/90 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-200 rounded-md font-medium min-w-[100px] flex-shrink-0"
                                >
                                    <History className="mr-2 h-4 w-4" />
                                    {t('tabs.recent')}
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="downloaded" 
                                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-700/90 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-200 rounded-md font-medium min-w-[100px] flex-shrink-0"
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    {t('tabs.downloaded')}
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="all" className="space-y-8 mt-0 focus-visible:outline-none focus-visible:ring-0">
                            {renderWarehouseItems()}
                        </TabsContent>

                        <TabsContent value="recent" className="space-y-8 mt-0 focus-visible:outline-none focus-visible:ring-0">
                            {renderWarehouseItems()}
                        </TabsContent>

                        <TabsContent value="downloaded" className="space-y-8 mt-0 focus-visible:outline-none focus-visible:ring-0">
                            {renderWarehouseItems()}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    );
}

// Make sure PaginationProps is defined before use
function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Tạo mảng các trang để hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Hiển thị tất cả trang nếu tổng số trang ít hơn maxPagesToShow
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Hiển thị một phần với "..." khi có nhiều trang
            if (currentPage <= 3) {
                // Khi ở gần trang đầu
                for (let i = 1; i <= 3; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Khi ở gần trang cuối
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // Ở giữa
                pageNumbers.push(1);
                pageNumbers.push('...');
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    return (
        <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-sm dark:shadow-black/10">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-9 w-9 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500"
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center">
                {getPageNumbers().map((pageNumber, index) => (
                    pageNumber === '...' ? (
                        <div key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">...</div>
                    ) : (
                        <Button
                            key={`page-${pageNumber}`}
                            variant={currentPage === pageNumber ? "default" : "ghost"}
                            onClick={() => onPageChange(Number(pageNumber))}
                            className={`h-9 w-9 rounded-md font-medium ${
                                currentPage === pageNumber 
                                    ? "bg-blue-600 dark:bg-blue-700 text-white border-0" 
                                    : "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            {pageNumber}
                        </Button>
                    )
                ))}
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-9 w-9 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500"
            >
                <ChevronRight className="h-5 w-5" />
            </Button>
        </div>
    );
}