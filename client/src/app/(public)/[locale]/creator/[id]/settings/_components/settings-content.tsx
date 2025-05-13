'use client';

import { useTranslations } from 'next-intl';
import { ExhibitionInfoHeader } from '../../components/exhibition-info-header';
import { LanguageSettings } from './language-settings';
import { Exhibition } from '@/types/exhibition';


  export function SettingsContent({
    exhibition,
  }: {
    exhibition: Exhibition;
  }) {
    const t = useTranslations('exhibitions');
    
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ExhibitionInfoHeader
          title={t('settings')}
          description={t('settings_description')}
        />
        
        <div className="grid gap-8 mt-8">
            <LanguageSettings 
              exhibition={exhibition}
            />          
          {/* Additional settings sections go here */}
          {/* <SettingsSection title={t('appearance')}>
            <AppearanceSettings exhibition={exhibition} exhibitionId={exhibitionId} />
          </SettingsSection> */}
        </div>
      </div>
    );
  }