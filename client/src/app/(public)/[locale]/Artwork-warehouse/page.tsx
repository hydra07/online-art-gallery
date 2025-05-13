import { Metadata } from 'next';
import WarehouseClient from './components/warehouse-client';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale: params.locale, namespace: 'warehouse' });

    return {
        title: `${t('title')} | Online Art Gallery`,
        description: t('description'),
    };
}

export default function ArtworkWarehousePage() {
    return <WarehouseClient />;
}