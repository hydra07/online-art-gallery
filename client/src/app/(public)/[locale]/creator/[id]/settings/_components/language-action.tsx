'use client';

import { MoreHorizontal, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCustomTranslations } from '@/i18n/translate';

interface LanguageActionProps {
  isDefault: boolean;
  onSetDefault: () => void;
  onDelete: () => void;
}

export function LanguageAction({ isDefault, onSetDefault, onDelete }: LanguageActionProps) {
  const t = useCustomTranslations('exhibitions');
  const tCommon = useCustomTranslations();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-background/80"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Language options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {!isDefault && (
          <DropdownMenuItem onClick={onSetDefault}>
            <Check className="w-4 h-4 mr-2" />
            {t('set_as_default')}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-destructive" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          {tCommon('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}