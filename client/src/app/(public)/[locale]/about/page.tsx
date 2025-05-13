import { ChevronsRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FeaturedGalleryPreview } from './components/featured-gallery-preview';
import Footer from '@/components/footer';
import { getFeaturedExhibitions } from '@/service/home';
import { ExhibitionSection } from '../home/@exhibition/components/exhibition-section';
import { getTranslations } from 'next-intl/server';
import { PublicExhibition } from '@/types/exhibition';

export default async function AboutPage({ params }: { params: { locale: string } }) {
    const t = await getTranslations({ locale: params.locale, namespace: 'about' });
    
    let featuredExhibitions : PublicExhibition[] = [];
    
    try {
        // Fetch featured exhibitions
        const featuredExhibitionsResponse = await getFeaturedExhibitions(10);
        featuredExhibitions = featuredExhibitionsResponse.data?.exhibitions || [];
    } catch (error) {
        // Log server-side error without exposing to client
        console.error('Error fetching featured exhibitions:', error);
        // Return empty array for exhibitions to avoid rendering errors
        featuredExhibitions = [];
    }
    
    return (
        <div className='min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]'>
            <main className='flex-1 w-full'>
                <div className="relative w-full min-h-[90vh] flex items-center">
                    {/* Video Background */}
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="https://res.cloudinary.com/djvlldzih/video/upload/v1738983008/gallery/hero_video.mp4" type="video/mp4" />
                    </video>

                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Hero Content */}
                    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-white">
                        <h1 className="text-4xl md:text-8xl font-bold mb-4">
                            {t('hero.title.line1')}<br />
                            {t('hero.title.line2')}<br />

                            <span className="text-3xl md:text-4xl font-light">
                                {t('hero.subtitle')}
                            </span>
                        </h1>

                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                            {/* Artists Section */}
                            <div className="space-y-3">
                                <h2 className="text-2xl font-semibold">{t('hero.artists.title')}</h2>
                                <p className="text-lg">
                                    {t('hero.artists.description')}
                                </p>
                            </div>

                            {/* Art Lovers Section */}
                            <div className="space-y-3">
                                <h2 className="text-2xl font-semibold">{t('hero.artLovers.title')}</h2>
                                <p className="text-lg">
                                    {t('hero.artLovers.description')}
                                </p>
                            </div>
                        </div>
                        <div className="mt-16 flex gap-x-40">
                            <Link
                                href={`/${params.locale}/artworks`}
                                className="group relative bg-blue-600 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 hover:bg-blue-700 hover:-translate-y-1"
                            >
                                <span className="relative z-10 font-medium flex items-center gap-2">
                                    {t('hero.buttons.openExhibition')}
                                    <ChevronsRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />
                            </Link>

                            <Link
                                href={`/${params.locale}/creator`}
                                className="group relative bg-pink-600 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 hover:bg-pink-700 hover:-translate-y-1"
                            >
                                <span className="relative z-10 font-medium flex items-center gap-2">
                                    {t('hero.buttons.discoverExhibitions')}
                                    <ChevronsRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* New Discover Section */}
                <div className="relative w-full min-h-[50vh] flex items-center">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src="https://res.cloudinary.com/djvlldzih/image/upload/v1738986967/gallery/discover_image.jpg"
                            alt={t('discover.image.alt')}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-24">
                        <div className="max-w-xl space-y-12">
                            <h2 className="text-3xl md:text-6xl font-bold text-gray-400 space-y-3">
                                <span className="block">{t('discover.title.line1')}</span>
                                <span className="block">{t('discover.title.line2')}</span>
                                <span className="block">{t('discover.title.line3')}</span>
                            </h2>
                            <Link
                                href={`/${params.locale}/creator`}
                                className="group relative inline-block bg-pink-600 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 hover:bg-pink-600 hover:text-white hover:-translate-y-1"
                            >
                                <span className="relative z-10 font-medium flex items-center gap-2">
                                    {t('discover.button')}
                                    <ChevronsRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Exhibition Sections */}
                <div className="w-full bg-white py-24">
                    {/* Featured Exhibition */}
                    <section className="mb-24">
                        <div className="max-w-6xl mx-auto px-4">
                            {/* Text Content */}
                            <div className="max-w-2xl mx-auto text-center mb-16">
                                <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
                                    {t('featured.title.line1')}<br />
                                    {t('featured.title.line2')}
                                </h2>
                                <p className="text-xl text-gray-600 mb-8">
                                    {t('featured.description')}
                                </p>
                            </div>

                            {/* Monitor Frame with 3D Gallery */}
                            <FeaturedGalleryPreview />
                        </div>
                    </section>

                    {/* Featured Exhibitions */}
                    <ExhibitionSection
                        title={'title_featured'}
                        exhibitions={featuredExhibitions}
                    />
                </div>
                
                {/* Vision & Mission Section */}
                <div className="relative w-full min-h-[90vh] flex items-center">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src="https://res.cloudinary.com/djvlldzih/image/upload/v1739205495/gallery/vision_thumbnail.png"
                            alt={t('vision.image.alt')}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-24">
                        <div className="grid md:grid-cols-2 gap-12 md:gap-24">
                            {/* Vision */}
                            <div>
                                <p className="text-1xl md:text-2xl lg:text-3xl text-white font-bold leading-tight">
                                    {t('vision.statement')}
                                </p>
                            </div>
                            {/* Mission */}
                            <div>
                                <p className="text-1xl md:text-2xl lg:text-3xl text-white font-bold leading-tight">
                                    {t('mission.statement')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}