'use client';

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, RefreshCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";

export interface LinkNameFormValues {
  linkName: string;
}

interface LinkNameManagerProps {
  form: UseFormReturn<LinkNameFormValues>;
  baseUrl: string;
  isPublished: boolean;
  onSave: (linkName: string) => Promise<void>;
  isLoading: boolean;
  originalLinkName: string;
  disabled?: boolean;
}

export default function LinkNameManager({
  form,
  baseUrl,
  isPublished,
  onSave,
  isLoading,
  originalLinkName,
  disabled = false
}: LinkNameManagerProps) {
  const t = useTranslations('exhibitions');
  const [isDirty, setIsDirty] = useState(false);

  const linkName = form.watch('linkName');
  const linkError = form.formState.errors.linkName?.message;

  useEffect(() => {
    setIsDirty(form.formState.isDirty);
  }, [form.formState.isDirty]);

  const handleLinkNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    form.setValue('linkName', formattedValue, {
      shouldValidate: true,
      shouldDirty: true
    });
    setIsDirty(true);
  };

  const handleReset = () => {
    form.setValue('linkName', originalLinkName || '', {
      shouldValidate: true,
      shouldDirty: false
    });
    setIsDirty(false);
  };

  const handleSave = async () => {
    if (!linkName || linkError) return;
    await onSave(linkName);
    setIsDirty(false);
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <Label htmlFor="linkName" className="text-lg font-semibold">
          {t('link_name')}
        </Label>
        <p className="text-sm text-gray-500 mb-2">
          {t('link_name_description')}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-500 whitespace-nowrap">{baseUrl}</span>
        <Input
          id="linkName"
          {...form.register('linkName')}
          onChange={handleLinkNameChange}
          placeholder={t('enter_link_name')}
          className={linkError ? 'border-destructive' : ''}
          disabled={disabled || isLoading}
        />
      </div>

      {linkError && (
        <p className="text-sm text-destructive mt-1">{linkError}</p>
      )}

      {/* Save and Reset buttons */}
      {isPublished && (
        <div className="flex gap-2 mt-4 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isLoading || !isDirty}
            className="gap-1"
          >
            <RefreshCcw className="w-4 h-4" />
            {t('reset')}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={disabled || isLoading || !isDirty || !!linkError || !linkName}
            className="gap-1"
          >
            <Save className="w-4 h-4" />
            {isLoading ? t('saving') : t('save_changes')}
          </Button>
        </div>
      )}
    </Card>
  );
}