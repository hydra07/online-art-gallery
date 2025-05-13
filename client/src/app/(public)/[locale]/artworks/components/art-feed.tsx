'use client';

import { Artwork } from '@/types/marketplace.d';
import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import * as ReactDOM from 'react-dom';
// import Image from 'next/image';
import Image from '@/components/ui.custom/optimized-image';
import { useWindowSize } from '@react-hook/window-size';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomDoubleTap } from '@/hooks/useDoubleTab';
import { Calendar, Info, Ruler, ShoppingCart, X, Eye, Download, BookmarkIcon, MessageSquare, Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

interface ArtFeedProps {
  data: Artwork;
  index: number;
  isActive?: boolean;
  isInModal?: boolean;
}

const ArtFeed: React.FC<ArtFeedProps> = ({ data, isActive = false, isInModal = false }) => {
  const t = useTranslations();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [windowWidth, windowHeight] = useWindowSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [startImagePosition, setStartImagePosition] = useState({ x: 0, y: 0 });
  const isMobile = windowWidth < 768;
  const [activeTab, setActiveTab] = useState('info');
  const [isLiked, setIsLiked] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [heartEffect, setHeartEffect] = useState(false);
  const [heartPosition, setHeartPosition] = useState<{ x: number; y: number } | null>(null);
  const [miniHearts, setMiniHearts] = useState<{ x: number, y: number, angle: number, scale: number }[]>([]);
  const [heartAnimationActive, setHeartAnimationActive] = useState(false);

  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const isArtworkCreator = useMemo(() => 
    session && data.artistId && session.user.id === data.artistId._id,
  [session, data.artistId]);

  const calculateContainerSize = useCallback(() => {
    const availableWidth = windowWidth * (isInfoOpen && !isMobile ? 0.75 : 1);
    const availableHeight = isInModal ? windowHeight : windowHeight;

    if (!data.dimensions.width || !data.dimensions.height) {
      return { w: availableWidth, h: availableHeight };
    }

    const imgRatio = data.dimensions.width / data.dimensions.height;
    const screenRatio = availableWidth / availableHeight;

    if (imgRatio > screenRatio) {
      return { w: availableWidth, h: availableWidth / imgRatio };
    } else {
      return { w: availableHeight * imgRatio, h: availableHeight };
    }
  }, [windowWidth, windowHeight, data.dimensions.width, data.dimensions.height, isInfoOpen, isMobile, isInModal]);

  const { w, h } = useMemo(() => calculateContainerSize(), [calculateContainerSize]);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (scale === 1) return;
    
    e.preventDefault();
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }
    
    setIsDragging(true);
    setStartDragPosition({ x: clientX, y: clientY });
    setStartImagePosition({ ...position });
  }, [scale, position]);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    let clientX: number;
    let clientY: number;
    
    if (e.type === 'touchmove' && 'touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.type === 'mousemove' && 'clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }
    
    const dx = clientX - startDragPosition.x;
    const dy = clientY - startDragPosition.y;
    
    const maxOffset = (scale - 1) * 100;
    const newX = Math.max(-maxOffset, Math.min(maxOffset, startImagePosition.x + dx));
    const newY = Math.max(-maxOffset, Math.min(maxOffset, startImagePosition.y + dy));
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, startDragPosition, startImagePosition, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (scale > 1) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [scale, handleMouseMove, handleMouseUp]);

  const { bind } = useCustomDoubleTap((event: React.MouseEvent | React.TouchEvent) => {
    if (scale > 1) return;

    let clientX: number | undefined;
    let clientY: number | undefined;

    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    if (clientX !== undefined && clientY !== undefined && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const newMiniHearts = Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const distance = 35 + Math.random() * 10;
        
        return {
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          angle: i * 45, 
          scale: 0.5 + Math.random() * 0.4
        };
      });
      
      ReactDOM.flushSync(() => {
        setIsLiked(true);
        setHeartAnimating(true);
        setHeartPosition({ x, y });
        setMiniHearts(newMiniHearts);
        setHeartAnimationActive(true);
      });
      
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
      
      const ANIMATION_DURATION = 450;
      animationTimerRef.current = setTimeout(() => {
        setHeartAnimationActive(false);
        setHeartPosition(null);
        setMiniHearts([]);
        setHeartAnimating(false);
        animationTimerRef.current = null;
      }, ANIMATION_DURATION);
    }
  });

  const toggleLike = useCallback(() => {
    setHeartAnimating(true);
    
    setIsLiked(prev => {
      const newState = !prev;
      if (newState) setHeartEffect(true);
      return newState;
    });
    
    setTimeout(() => setHeartAnimating(false), 400);
    if (!isLiked) setTimeout(() => setHeartEffect(false), 800);
  }, [isLiked]);

  const handleDownload = useCallback(() => {
    toast({
      title: t('artwork.download_not_available'),
      description: t('artwork.please_use_standard_view'),
      variant: "destructive",
    });
  }, [t, toast]);

  const handleBuy = useCallback(() => {
    toast({
      title: t('artwork.purchase_not_available'),
      description: t('artwork.please_use_standard_view'),
      variant: "destructive",
    });
  }, [t, toast]);

  const handleCollection = useCallback(() => {
    toast({
      title: t('artwork.collection_not_available'),
      description: t('artwork.please_use_standard_view'),
      variant: "destructive",
    });
  }, [t, toast]);

  const toggleInfoPanel = useCallback(() => {
    setIsInfoOpen(prev => !prev);
  }, []);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  }, []);
  
  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.25, 0.25));
  }, []);
  
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || (e.key === '=' && e.ctrlKey)) {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' && e.ctrlKey) {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0' && e.ctrlKey) {
        e.preventDefault();
        resetZoom();
      } else if (e.key === 'Escape' && scale > 1) {
        e.preventDefault();
        resetZoom();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetZoom, scale]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      setScale(prevScale => {
        const newScale = Math.max(0.25, Math.min(3, prevScale + delta));
        return newScale;
      });
    }
  }, []);

  const preventContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  const getDescriptionHeight = useMemo(() => {
    const availableHeight = windowHeight - (isMobile ? 400 : 200);
    const maxHeight = Math.max(availableHeight * 0.4, isMobile ? 100 : 150);
    
    if (isMobile) {
      return windowHeight < 700 ? '80px' : Math.min(maxHeight, 150) + 'px';
    } else {
      return windowHeight < 900 ? '150px' : Math.min(maxHeight, 250) + 'px';
    }
  }, [windowHeight, isMobile]);

  const containerClasses = useMemo(() => 
    `relative flex items-center justify-center w-full h-full ${isDragging ? 'cursor-grabbing' : (scale !== 1 ? 'cursor-grab' : 'cursor-default')}`,
  [isDragging, scale]);
  
  const imageStyles = useMemo(() => ({
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
  }), [scale, position.x, position.y, isDragging]);

  const AnimatedHeartsContainer = () => {
    if (!heartAnimationActive) return null;
    
    return (
      <div className="pointer-events-none absolute inset-0 z-20">
        {heartPosition && (
          <div
            className="absolute flex items-center justify-center w-28 h-28"
            style={{
              top: heartPosition.y - 56,
              left: heartPosition.x - 56,
            }}
          >
            <Heart 
              className="w-full h-full text-red-500 fill-current animate-pop-heart" 
              strokeWidth={1.5}
              style={{filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))'}}
            />
          </div>
        )}

        {miniHearts.map((heart, index) => (
          <div
            key={index}
            className="absolute w-6 h-6"
            style={{
              top: heart.y - 12,
              left: heart.x - 12,
              transform: `scale(${heart.scale})`,
              animation: `float-mini-heart-${index % 4 + 1} 450ms ease-out forwards`,
            }}
          >
            <Heart 
              className="w-full h-full text-red-500 fill-current" 
              strokeWidth={1.5}
              style={{
                transformOrigin: 'center',
                transform: `rotate(${heart.angle}deg)`
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-black/95" 
      onWheel={handleWheel} 
      onContextMenu={preventContextMenu}
    >      
      <div
        className="relative flex items-center justify-center w-full h-full select-none"
        style={{ 
          width: isInfoOpen && !isMobile ? '75%' : '100%',
          transition: 'width 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <div 
          ref={containerRef} 
          className={`${containerClasses} select-none`}
          {...bind}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onContextMenu={preventContextMenu}
        >
          <Image
            src={data.url}
            alt={data.title}
            width={w}
            height={h}
            style={{
              ...imageStyles,
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
            quality={90}
            priority
            onLoad={handleImageLoad}
            onError={handleImageError}
            draggable={false}
            unselectable="on"
          />
        </div>

        {(isLoading || hasError) && (
          <div className="absolute inset-0">
            <Skeleton className="w-full h-full bg-gray-300/50 dark:bg-gray-600/50" />
          </div>
        )}

        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
          <button
            className={`group relative p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40' 
                : 'bg-black/50 hover:bg-black/70 active:bg-black/90'
            }`}
            onClick={toggleLike}
            aria-label={isLiked ? t('artwork.remove_from_favorites') : t('artwork.add_to_favorites')}
            title={isLiked ? t('artwork.remove_from_favorites') : t('artwork.add_to_favorites')}
          >
            <Heart 
              className={`w-5 h-5 transition-all ${
                isLiked 
                  ? 'text-red-500 fill-current drop-shadow-glow' 
                  : 'text-white group-hover:text-pink-200 group-hover:scale-110'
              } ${heartAnimating ? 'animate-heartbeat' : ''}`} 
              strokeWidth={isLiked ? 2.5 : 2}
            />
            
            {heartAnimating && isLiked && (
              <span className="absolute inset-0 rounded-full animate-ping-once opacity-70" style={{
                backgroundColor: 'rgba(239, 68, 68, 0.25)',
              }}></span>
            )}
          </button>
          
          {heartEffect && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Heart 
                className="w-20 h-20 text-red-500 fill-current animate-float-heart absolute" 
                strokeWidth={1.5}
              />
            </div>
          )}
          
          <button
            className="p-3 rounded-full bg-black/50 hover:bg-black/70 active:bg-black/90 transition-colors backdrop-blur-sm"
            onClick={toggleInfoPanel}
            aria-label={t('artwork.toggle_details')}
            title={t('artwork.toggle_details')}
          >
            <Info className="w-5 h-5 text-white" />
          </button>
        </div>

        <AnimatedHeartsContainer />
        
        {scale > 1 && (
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs py-1 px-3 rounded-full backdrop-blur-sm transition-opacity duration-300 opacity-70">
            {t('artwork.drag_to_pan')}
          </div>
        )}
      </div>

      <div
        className="flex-col z-40 bg-black/95 backdrop-blur-sm shadow-xl p-3"
        style={{
          position: isInModal ? 'absolute' : 'fixed',
          right: 0,
          width: isMobile ? '100%' : '25%',
          height: isMobile ? '55%' : '100%',
          top: isMobile ? 'auto' : 0,
          bottom: 0,
          borderTopLeftRadius: isMobile ? '12px' : 0,
          borderLeft: !isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
          transform: isInfoOpen ? 'translateX(0)' : (isMobile ? 'translateY(100%)' : 'translateX(100%)'),
          opacity: isInfoOpen ? 1 : 0,
          visibility: isInfoOpen ? 'visible' : 'hidden',
          transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1), visibility 0s' + (isInfoOpen ? '' : ' 0.2s'),
          display: 'flex'
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-white line-clamp-2">{data.title}</h2>
          <button
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
            onClick={toggleInfoPanel}
            aria-label={t('artwork.close_details')}
            title={t('artwork.close_details')}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {data.status && (
            <Badge variant="outline" className={`px-2 py-0.5 text-xs ${
              data.status.toLowerCase() === 'available'
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : data.status.toLowerCase() === 'selling'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {data.status}
            </Badge>
          )}

          <Badge variant="outline" className="px-2 py-0.5 text-xs bg-white/10 border-white/30 text-white">
            <Eye className="w-3 h-3 mr-1" />
            {data.views || 0}
          </Badge>

          {data.price > 0 && (
            <Badge variant="outline" className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 border-green-500/30">
              {data.price.toLocaleString()}
            </Badge>
          )}
        </div>

        <div className="mb-2 border-b border-white/20">
          <div className="flex">
            {['info', 'comments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm relative ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {tab === 'info' ? 
                  <span className="flex items-center gap-1">
                    <Info className="w-3 h-3" /> {t(`artwork.${tab}`)}
                  </span> : 
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> {t(`artwork.${tab}`)}
                  </span>
                }
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'info' ? (
            <ScrollArea className="h-full pr-2">
              <div className="space-y-3">
                {data.artistId && (
                  <div className="flex items-center gap-2 bg-white/10 p-2 rounded-md">
                    <Avatar className="h-6 w-6 border border-white/20">
                      <AvatarImage
                        src={data.artistId.image}
                        alt={data.artistId.name || t('artwork.unknown_artist')}
                      />
                      <AvatarFallback className="bg-white/10 text-white text-xs">
                        {data.artistId.name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">
                        {data.artistId.name || t('artwork.unknown_artist')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {data.status?.toLowerCase() === 'selling' && !isArtworkCreator && (
                    <button
                      onClick={handleBuy}
                      className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs h-9 px-2 rounded-md flex items-center justify-center transition-colors"
                    >
                      <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                      {t('artwork.buy')}
                    </button>
                  )}

                  <button
                    onClick={handleDownload}
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs h-9 px-2 rounded-md flex items-center justify-center transition-colors"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    {t('artwork.download')}
                  </button>

                  <button
                    onClick={handleCollection}
                    className={`bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 text-white text-xs h-9 px-2 rounded-md flex items-center justify-center transition-colors ${
                      data.status?.toLowerCase() !== 'selling' || isArtworkCreator ? 'col-span-2' : ''
                    }`}
                  >
                    <BookmarkIcon className="mr-1.5 h-3.5 w-3.5" />
                    {t('artwork.save')}
                  </button>
                </div>

                {data.description && (
                  <div>
                    <p className="text-xs font-medium text-white/70 mb-1">{t('artwork.description')}</p>
                    <div 
                      className="bg-white/5 border border-white/10 rounded-md p-2 overflow-y-auto" 
                      style={{ maxHeight: getDescriptionHeight }}
                    >
                      <p className="text-xs text-white/90 whitespace-pre-line leading-relaxed">
                        {data.description}
                      </p>
                    </div>
                  </div>
                )}

                {data.category && data.category.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-white/70 mb-1">{t('artwork.categories')}</p>
                    <div className="flex flex-wrap gap-1">
                      {data.category.map((cat, idx) => (
                        <span
                          key={idx}
                          className="bg-white/10 text-white px-1.5 py-0.5 rounded text-[10px]"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white/5 rounded-md p-1.5 text-[10px] text-white/60">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Ruler className="w-2.5 h-2.5" />
                      {data.dimensions.width}×{data.dimensions.height}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(data.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <ScrollArea className="h-full pr-2">
              <div className="flex flex-col items-center justify-center py-10 text-white/50">
                <p className="text-sm">{t('artwork.no_comments')}</p>
                <p className="text-xs mt-1">{t('artwork.comments_standard_view')}</p>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtFeed;