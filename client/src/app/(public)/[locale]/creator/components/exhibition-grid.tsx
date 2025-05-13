import { getUserExhibitions } from '@/service/exhibition';
import { getCurrentUser } from '@/lib/session';
import { Exhibition } from '@/types/exhibition';
import { getTranslations } from 'next-intl/server';
import ExhibitionCard from './exhibition-card';

export default async function ExhibitionGrid({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'exhibitions' });

  const user = await getCurrentUser();
  if (!user) {
    return <div>{t('please_login')}</div>;
  }

  let exhibitions: Exhibition[] = [];
    const exhibitionsResponse = await getUserExhibitions(user.accessToken, {
      page: 0,
      limit: 0, //lay het
    });
    exhibitions = exhibitionsResponse.data?.exhibitions ?? [];

  if (exhibitions.length === 0) {
    return <div>{t('no_exhibitions_found')}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exhibitions.map((exhibition) => (
        <ExhibitionCard
          key={exhibition._id}
          exhibition={exhibition}
          locale={locale}
        />
      ))}
    </div>
  );
}