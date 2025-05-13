'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Check, Trash2 } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  isDefault?: boolean;
}

export function LanguageItem({
  language,
  onSetDefault,
  onRemove,
  canRemove
}: {
  language: Language;
  onSetDefault: (code: string) => void;
  onRemove: (code: string) => void;
  canRemove: boolean;
}) {
  const t = useTranslations('exhibitions');
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-card">
      <div className="flex items-center gap-2">
        <div className="w-10 h-6 flex items-center justify-center rounded border">
          {language.code}
        </div>
        <span>{t(language.code)}</span>
        {language.isDefault && (
          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5">
            <Check className="w-3 h-3 mr-1" />
            {t('default')}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {!language.isDefault && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onSetDefault(language.code)}
          >
            {t('set_as_default')}
          </Button>
        )}
        {canRemove && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive"
            onClick={() => onRemove(language.code)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}