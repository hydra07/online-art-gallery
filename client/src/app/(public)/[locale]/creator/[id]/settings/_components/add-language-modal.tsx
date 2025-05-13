'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { LoaderButton } from '@/components/ui.custom/loader-button';

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Vietnamese' },
  // { code: 'fr', name: 'French' },
  // { code: 'ja', name: 'Japanese' },
  // { code: 'ko', name: 'Korean' },
  // { code: 'zh', name: 'Chinese' },
  // { code: 'es', name: 'Spanish' },
  // { code: 'de', name: 'German' },
] as const;

interface AddLanguageModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLanguage: (code: string, name: string) => Promise<void>;
  existingLanguageCodes: string[];
}

export function AddLanguageModal({
  isOpen,
  onOpenChange,
  onAddLanguage,
  existingLanguageCodes
}: AddLanguageModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('exhibitions');
  const tCommon = useTranslations('common');

  // Filter out languages that are already added
  const availableOptions = availableLanguages.filter(
    lang => !existingLanguageCodes.includes(lang.code)
  );

  const handleSubmit = async () => {
    if (!selectedLanguage) return;

    try {
      setIsSubmitting(true);
      const selectedOption = availableLanguages.find(lang => lang.code === selectedLanguage);
      if (selectedOption) {
        await onAddLanguage(selectedOption.code, selectedOption.name);
        setSelectedLanguage('');
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('add_new_language')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label></Label> {/* Update label with translation */}
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
              disabled={isSubmitting || availableOptions.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('choose_a_language')} />
              </SelectTrigger>
              <SelectContent>
                {availableOptions.length > 0 ? (
                  availableOptions.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name} ({lang.code.toUpperCase()})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    {t('no_more_languages_available')}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            {tCommon('cancel')}
          </Button>
          <LoaderButton
            isLoading={isSubmitting}
            onClick={handleSubmit}
            disabled={!selectedLanguage || isSubmitting}
          >
            {t('add_language')}
          </LoaderButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}