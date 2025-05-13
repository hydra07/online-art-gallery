'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { Exhibition } from '@/types/exhibition';
import { useServerAction } from 'zsa-react';
import { updateExhibitionAction } from '../../../actions';
import { LanguageAction } from './language-action';
import { AddLanguageModal } from './add-language-modal';

interface Language {
  code: string;
  name: string;
  isDefault: boolean;  // Make isDefault required
}

export function LanguageSettings({
  exhibition,
}: {
  exhibition: Exhibition;
}) {
  const t = useTranslations('exhibitions');
  const tCommon = useTranslations('common');
  const { toast } = useToast();
  
  const [languages, setLanguages] = useState<Language[]>(
    exhibition.languageOptions?.map(lang => ({
      ...lang,
      isDefault: lang.isDefault ?? false
    })) || [{ code: 'en', name: 'English', isDefault: true }]
  );
  const [isAddLanguageModalOpen, setIsAddLanguageModalOpen] = useState(false);

  const { execute: updateSettings } = useServerAction(updateExhibitionAction, {
    onSuccess: () => {
      toast({
        title: tCommon('success'),
        description: t('language_settings_updated'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: tCommon('error'),
        description: error.err.message || t('language_settings_update_failed'),
        variant: 'destructive',
      });
    },
  });

  const handleSetDefault = (code: string) => {
    const updatedLanguages = languages.map(lang => ({
      ...lang,
      isDefault: lang.code === code
    }));
    setLanguages(updatedLanguages);
    saveLanguages(updatedLanguages);
  };

  const handleRemoveLanguage = (code: string) => {
    const removedLanguage = languages.find(lang => lang.code === code);
    const updatedLanguages = languages.filter(lang => lang.code !== code);
    
    // If we're removing the default language and other languages exist
    if (removedLanguage?.isDefault && updatedLanguages.length > 0) {
      // Set the first remaining language as default
      updatedLanguages[0].isDefault = true;
    }
    
    // Only allow removal if there's at least one language remaining
    if (updatedLanguages.length > 0) {
      setLanguages(updatedLanguages);
      
      // Filter out the content for the removed language
      const updatedContents = exhibition.contents.filter(
        content => content.languageCode !== code
      );
      
      // Save both language options and updated contents
      saveLanguagesAndContents(updatedLanguages, updatedContents);
    } else {
      toast({
        title: tCommon('error'),
        description: t('cannot_remove_last_language'),
        variant: 'destructive',
      });
    }
  };

  const handleAddLanguage = async (code: string, name: string) => {
    const newLanguage: Language = { code, name, isDefault: languages.length === 0 };
    const updatedLanguages = [...languages, newLanguage];
    setLanguages(updatedLanguages);
    await saveLanguages(updatedLanguages);
  };

  const saveLanguages = async (updatedLanguages: Language[]) => {
    await updateSettings({
      id: exhibition._id,
      data: { languageOptions: updatedLanguages }
    });
  };

  // New function to save both languages and contents
  const saveLanguagesAndContents = async (
    updatedLanguages: Language[],
    updatedContents: typeof exhibition.contents
  ) => {
    await updateSettings({
      id: exhibition._id,
      data: { 
        languageOptions: updatedLanguages,
        contents: updatedContents
      }
    });
  };

  return (
    <div className='space-y-4'>
      {/* Languages List */}
      <div className='space-y-4'>
        {languages.map((lang) => (
          <div key={lang.code} className='flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors'>
            <div className='flex items-center gap-4'>
              <span className='text-lg font-medium min-w-[2.5rem]'>
                {lang.code.toUpperCase()}
              </span>
              <span>{t(lang.code)}</span>
              {lang.isDefault && (
                <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium'>
                  {t('default_language')}
                </span>
              )}
            </div>
            <LanguageAction 
              isDefault={!!lang.isDefault}
              onSetDefault={() => handleSetDefault(lang.code)}
              onDelete={() => handleRemoveLanguage(lang.code)}
            />
          </div>
        ))}
      </div>

      {/* Add Language Button */}
      <Button
        className='w-full mt-4'
        variant='outline'
        size='lg'
        onClick={() => setIsAddLanguageModalOpen(true)}
      >
        <Languages className='w-4 h-4 mr-2' />
        {t('add_new_language')}
      </Button>

      {/* Add Language Modal */}
      <AddLanguageModal
        isOpen={isAddLanguageModalOpen}
        onOpenChange={setIsAddLanguageModalOpen}
        onAddLanguage={handleAddLanguage}
        existingLanguageCodes={languages.map(l => l.code)}
      />
    </div>
  );
}