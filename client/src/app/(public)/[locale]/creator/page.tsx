import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import ExhibitionGrid from './components/exhibition-grid';
import CreateExhibitionButton from './components/create-exhibition-button';
import LoadingExhibitions from './components/exhibition-loading';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import NotArtistDisplay from './components/not-artist-display';
// import { checkIsArtistPremium } from '@/service/user';
import { checkPremium } from '@/utils/premium';

export default async function CreatorPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'exhibitions' });

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/sign-in`);
  }

  if (!user.role.includes('artist')) {
    return <NotArtistDisplay />;
  }

  const premiumStatus = await checkPremium(user.accessToken);
  const {isPremium} = premiumStatus;


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('my_exhibitions')}</h1>
        <CreateExhibitionButton isPremium={isPremium} />
      </div>

      <Suspense fallback={<LoadingExhibitions />}>
        <ExhibitionGrid locale={params.locale} />
      </Suspense>
    </div>
  );
}



