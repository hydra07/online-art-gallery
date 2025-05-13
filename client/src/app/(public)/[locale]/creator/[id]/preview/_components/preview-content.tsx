'use client';
import { ExhibitionInfoHeader } from '../../components/exhibition-info-header';
import { useTranslations } from 'next-intl';
import { Exhibition as ExhibitionType } from '@/types/exhibition';
// import { MemoizedExhibition } from './exhibition-display';
import { InfoButton } from './info-button';
import { ExhibitionDisplay } from './exhibition-display';

export default function PreviewContent({ exhibition }: { exhibition: ExhibitionType }) {
    const t = useTranslations('exhibitions');

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 md:pb-6">
                <ExhibitionInfoHeader
                    title={t('preview')}
                    description={t('preview_description')}
                    faqLinkText={t('read_faq')}
                />
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className='w-full h-[70vh] bg-gray-200 rounded-lg shadow-md overflow-hidden relative'>
                    <ExhibitionDisplay exhibition={exhibition} />
                    <InfoButton />
                </div>
            </div>

             {/* Optional: Add some space below the preview if needed */}
             <div className="h-8 md:h-12"></div>
        </div>
    );
}