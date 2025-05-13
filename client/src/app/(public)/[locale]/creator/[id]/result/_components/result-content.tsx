'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import more specific Card parts
import { Button } from '@/components/ui/button';
import { Users, Heart, Clock, Crown, Lock } from 'lucide-react'; // Added BarChart2, Lock
import { Exhibition } from '@/types/exhibition';
import { formatTime } from '@/lib/utils';
import { ExhibitionInfoHeader } from '../../components/exhibition-info-header';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// This component receives exhibition data from the server
export default function ResultContent({
    exhibition,
    isPremium
}: {
    exhibition: Exhibition,
    isPremium: boolean
}) {
    const t = useTranslations('exhibitions');
    // We use a client component to display the exhibition data
    return (
        <div className='max-w-7xl mx-auto p-6 space-y-10'> {/* Increased spacing slightly */}
            <ExhibitionInfoHeader
                description={t('exhibition_result_description')}
                title={t('exhibition_result_title')}
            />

            {isPremium ? (
                <AnalyticsContent exhibition={exhibition} />
            ) : (
                <PremiumUpsell />
            )}
        </div>
    );
}


function AnalyticsContent({ exhibition }: { exhibition: Exhibition }) {
    const t = useTranslations('exhibitions');
    const totalLikes = exhibition.result?.likes?.reduce((total, like) => total + like.count, 0) || 0;
    const analyticsData = {
        totalVisits: exhibition.result?.visits || 0,
        totalLikes: totalLikes,
        averageTime: exhibition.result?.visits
            ? formatTime(Math.floor((exhibition.result.totalTime || 0) / exhibition.result.visits))
            : formatTime(0),
    };

    // Sort artworks by likes descending for better visual hierarchy
    const sortedLikes = [...(exhibition.result?.likes || [])].sort((a, b) => b.count - a.count);

    return (
        <div className='space-y-8'> {/* Add wrapper div for consistent spacing */}
            {/* Key Metrics */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'> {/* Slightly increased gap */}
                <MetricCard
                    title={t('total_visits')}
                    value={analyticsData.totalVisits.toLocaleString()} // Format number
                    icon={<Users className='w-5 h-5 text-blue-500' />} // Slightly larger icon + color
                />
                <MetricCard
                    title={t('total_likes')}
                    value={analyticsData.totalLikes.toLocaleString()} // Format number
                    icon={<Heart className='w-5 h-5 text-red-500' />} // Slightly larger icon + color
                />
                <MetricCard
                    title={t('average_time')}
                    value={analyticsData.averageTime}
                    icon={<Clock className='w-5 h-5 text-green-500' />} // Slightly larger icon + color
                />
            </div>

            {/* Exhibition-specific Analytics - Artwork Likes */}
            <div>
                <h2 className='text-2xl font-semibold mb-5 flex items-center gap-2'> {/* Use semibold, adjusted margin */}
                    {t('artwork_engagement')}
                </h2>
                {sortedLikes.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'> {/* Adjusted grid + gap */}
                        {sortedLikes.map((like) => {
                            const artwork = exhibition.artworkPositions.find(
                                pos => pos.artwork._id === like.artworkId
                            )?.artwork;

                            return (
                                <ArtworkEngagementCard
                                    key={like.artworkId} // Use artworkId as key
                                    title={artwork?.title || t('untitled_artwork')}
                                    likes={like.count}
                                    // Optional: Add artwork image thumbnail if available
                                    imageUrl={artwork?.lowResUrl}
                                    totalLikes={totalLikes} // Pass total likes for potential percentage calculation
                                />
                            );
                        })}
                    </div>
                ) : (
                    <Card className='border-dashed border-gray-300 bg-gray-50/50 py-8'>
                        <CardContent className="text-center text-gray-500">
                            <Heart className='w-8 h-8 mx-auto mb-3 text-gray-400' />
                            <p>{t('no_engagement_data')}</p> {/* More specific text */}
                            <p className='text-sm mt-1'>{t('no_engagement_hint')}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

// Reusable Metric Card Component
function MetricCard({ title, value, icon, description }: { title: string, value: string | number, icon: React.ReactNode, description?: string }) {
    return (
        <Card className='hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'> {/* Use muted for title */}
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className='text-3xl font-bold'>{value}</div> {/* Increased size */}
                {description && (
                    <p className='text-xs text-muted-foreground pt-1'>{description}</p>
                )}
            </CardContent>
        </Card>
    );
}

// Reusable Artwork Engagement Card
function ArtworkEngagementCard({ title, likes, imageUrl }: { title: string, likes: number, imageUrl?: string, totalLikes: number }) {
    const t = useTranslations('exhibitions');
    return (
        <Card className='overflow-hidden hover:shadow-md transition-shadow duration-200 group'>
            {imageUrl && (
                <div className='aspect-video overflow-hidden'> {/* Standard aspect ratio */}
                    <img src={imageUrl} alt={title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' />
                </div>
            )}
            <CardContent className={`p-4 ${!imageUrl ? 'pt-4' : ''}`}> {/* Adjust padding if no image */}
                <h3 className='font-semibold text-base truncate mb-1' title={title}>{title}</h3> {/* Truncate long titles */}
                <div className='flex items-center justify-between text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1 text-red-600'>
                        <Heart className='w-4 h-4 fill-current' />
                        <span className='font-bold text-lg text-foreground'>{likes.toLocaleString()}</span> {/* Make count stand out */}
                        <span className='text-xs text-muted-foreground'>{t('likes')}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


function PremiumUpsell() {
    const t = useTranslations('exhibitions');
    return (
        <Card className='p-8 text-center bg-gradient-to-br from-purple-50 via-white to-blue-50 border border-purple-100 shadow-sm relative overflow-hidden'> {/* Subtle gradient + border */}
            {/* Decorative elements */}
            <div className='absolute -top-4 -left-4 w-24 h-24 bg-yellow-300/50 rounded-full blur-xl opacity-70'></div>
            <div className='absolute -bottom-6 -right-2 w-20 h-20 bg-blue-300/50 rounded-full blur-xl opacity-70'></div>

            <div className='relative z-10'> {/* Content above decorative elements */}
                <Crown className='w-12 h-12 mx-auto text-yellow-500 mb-4 drop-shadow-md' /> {/* Slightly smaller, shadow */}
                <h3 className='text-2xl font-semibold mb-3 text-gray-800'>
                    {t('unlock_analytics_title')} {/* Use translation keys */}
                </h3>
                <p className='text-muted-foreground mb-6 max-w-md mx-auto text-sm leading-relaxed'> {/* Adjusted text size/leading */}
                    {t('unlock_analytics_desc')}
                </p>
                <Button asChild size="lg" className='bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300 group'>
                    <Link href="/premium">
                        <div className="flex items-center justify-center">
                            <Lock className='w-4 h-4 mr-2 group-hover:scale-110 transition-transform' />
                            <span>{t('upgrade_now_button')}</span>
                        </div>
                    </Link>
                </Button>
            </div>
        </Card>
    );
}

// Remember to add the new translation keys (like 'metric_desc_visits', 'untitled_artwork', 'unlock_analytics_title', etc.) to your localization files.