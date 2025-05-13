'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Exhibition, ExhibitionStatus } from '@/types/exhibition';
import { ExhibitionInfoHeader } from '../../components/exhibition-info-header';
import FileUploader from '@/components/ui.custom/file-uploader'; // Ensure this path is correct
import { useToast } from '@/hooks/use-toast';
import { ImageIcon, Music, SaveIcon, XIcon } from 'lucide-react';
import { LoaderButton } from '@/components/ui.custom/loader-button'; // Ensure this path is correct
import { contentSchema, type ContentFormData } from '@/types/exhibition'; // Ensure this path is correct
import { zodResolver } from '@hookform/resolvers/zod';
// Import Controller
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useExhibition } from '../../../context/exhibition-provider';

const canUpdateContent = (status: ExhibitionStatus) => {
    return status !== ExhibitionStatus.PUBLISHED;
};
export function ContentSettings({ exhibition }: { exhibition: Exhibition }) {
    const currentLocale = useLocale();
    const t = useTranslations('exhibitions');
    const tCommon = useTranslations('common');
    const { toast } = useToast();
    const { isUpdating, updateExhibition } = useExhibition();

    // --- React Hook Form Setup ---
    const form = useForm<ContentFormData>({
        resolver: zodResolver(contentSchema),
        defaultValues: {
            contents: exhibition.languageOptions?.map(lang => ({
                languageCode: lang.code,
                name: exhibition.contents?.find(c => c.languageCode === lang.code)?.name || '',
                description: exhibition.contents?.find(c => c.languageCode === lang.code)?.description || ''
            })) || [],
            welcomeImage: exhibition.welcomeImage || '',
            backgroundMedia: exhibition.backgroundMedia || '',
            backgroundAudio: exhibition.backgroundAudio || ''
        },
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: "contents"
    });

    const [showUploaders, setShowUploaders] = useState({
        welcomeImage: !form.getValues('welcomeImage'),
        backgroundMedia: !form.getValues('backgroundMedia'),
        backgroundAudio: !form.getValues('backgroundAudio')
    });

    const handleRemoveFile = (fieldName: 'welcomeImage' | 'backgroundMedia' | 'backgroundAudio') => {
        form.setValue(fieldName, '', { shouldDirty: true });
        setShowUploaders(prev => ({ ...prev, [fieldName]: true }));
    };

    const handleSave = async (data: ContentFormData) => {
        if (!canUpdateContent(exhibition.status)) {
            toast({
                title: tCommon('error'),
                description: t('cannot_update_published_exhibition'),
                variant: 'destructive',
            });
            return;
        }

        const updatedData = {
            contents: data.contents,
            welcomeImage: data.welcomeImage || undefined,
            backgroundMedia: data.backgroundMedia || undefined,
            backgroundAudio: data.backgroundAudio || undefined
        };

        await updateExhibition(updatedData, {
            onSuccess: () => {
                toast({
                    title: tCommon('success'),
                    description: t('content_updated'),
                    variant: 'success',
                });
                // Reset the form with current values to mark as pristine
                form.reset(data);
            },
            onError: (error) => {
                console.error("Server Action Error:", error);
                toast({
                    title: tCommon('error'),
                    description: t('content_update_failed'),
                    variant: 'destructive',
                });
            }
        });
    };

    // Helper to get error message for a specific content field
    const getContentError = (index: number, fieldName: 'name' | 'description') => {
        return form.formState.errors.contents?.[index]?.[fieldName]?.message;
    };

    return (
        <form onSubmit={form.handleSubmit(handleSave)} className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <ExhibitionInfoHeader
                title={t('content')}
                description={t('content_description')}
                faqLinkText={t('read_faq')}
            />

            {/* Language Tabs (identical to Option 1) */}
            <Card className="p-6">
                <Tabs defaultValue={currentLocale} className="w-full">
                    <TabsList className="mb-4">
                        {fields.map((field, index) => {
                            const lang = exhibition.languageOptions?.[index];
                            if (!lang) return null;
                            return (
                                <TabsTrigger
                                    key={field.id}
                                    value={lang.code}
                                    className="flex items-center gap-2"
                                >
                                    {t(lang.code)}
                                    {lang.isDefault && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            {t('default_language')}
                                        </span>
                                    )}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {fields.map((field, index) => {
                        const lang = exhibition.languageOptions?.[index];
                        if (!lang) return null;
                        return (
                            <TabsContent key={field.id} value={lang.code} className="space-y-4">
                                <div>
                                    <Label htmlFor={`name-${lang.code}`}>
                                        {t('exhibition_name')} ({t(lang.code)})
                                    </Label>
                                    <Input
                                        id={`name-${lang.code}`}
                                        {...form.register(`contents.${index}.name`)}
                                        disabled={!canUpdateContent(exhibition.status)}
                                        maxLength={80}
                                        placeholder={t('enter_name_in_lang', { lang: lang.name })}
                                        aria-invalid={!!getContentError(index, 'name')}
                                    />
                                    {getContentError(index, 'name') && (
                                        <p className="text-sm text-destructive mt-1">
                                            {getContentError(index, 'name')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor={`description-${lang.code}`}>
                                        {t('description')} ({t(lang.code)})
                                    </Label>
                                    <Textarea
                                        id={`description-${lang.code}`}
                                        disabled={!canUpdateContent(exhibition.status)}
                                        {...form.register(`contents.${index}.description`)}
                                        rows={4}
                                        placeholder={t('enter_description_in_lang', { lang: lang.name })}
                                        aria-invalid={!!getContentError(index, 'description')}
                                    />
                                    {getContentError(index, 'description') && (
                                        <p className="text-sm text-destructive mt-1">
                                            {getContentError(index, 'description')}
                                        </p>
                                    )}
                                </div>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </Card>

            {/* Media Uploads using Controller */}
            <div className="space-y-6">
                <Controller
                    name="welcomeImage"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Card className="p-6">
                            <Label className="text-lg font-semibold mb-4 block">
                                {t('welcome_image')}
                            </Label>
                            {field.value && !showUploaders.welcomeImage ? (
                                <div className="relative">
                                    <div className="relative w-64 h-48 rounded-lg overflow-hidden">
                                        <Image
                                            src={field.value}
                                            alt={t('welcome_image')}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => handleRemoveFile('welcomeImage')}
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <FileUploader
                                    icon={<ImageIcon className="h-8 w-8 sm:h-12 sm:w-12" />}
                                    multiple={false}
                                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
                                    maxFiles={1}
                                    maxSize={5 * 1024 * 1024}
                                    onFileUpload={(files) => {
                                        field.onChange(files[0]?.url || '');
                                        setShowUploaders(prev => ({ ...prev, welcomeImage: false }));
                                    }}
                                />
                            )}
                            {fieldState.error && (
                                <p className="text-sm text-destructive mt-1">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </Card>
                    )}
                />

                <Controller
                    name="backgroundMedia"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Card className="p-6">
                            <Label className="text-lg font-semibold mb-4 block">
                                {t('background_media')}
                            </Label>
                            {field.value && !showUploaders.backgroundMedia ? (
                                <div className="relative">
                                    {field.value.endsWith('.mp4') || field.value.endsWith('.webm') ? (
                                        <video
                                            src={field.value}
                                            controls
                                            className="w-full rounded-lg"
                                        />
                                    ) : (
                                        <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                                            <Image
                                                src={field.value}
                                                alt={t('background_media')}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => handleRemoveFile('backgroundMedia')}
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <FileUploader
                                    // icon={<VideoIcon className="h-8 w-8 sm:h-12 sm:w-12" />}
                                    multiple={false}
                                    accept={{
                                        'image/*': ['.png', '.jpg', '.jpeg'],
                                        'video/*': ['.mp4', '.webm']
                                    }}
                                    maxFiles={1}
                                    maxSize={10 * 1024 * 1024}
                                    onFileUpload={(files) => {
                                        field.onChange(files[0]?.url || '');
                                        setShowUploaders(prev => ({ ...prev, backgroundMedia: false }));
                                    }}
                                />
                            )}
                            {fieldState.error && (
                                <p className="text-sm text-destructive mt-1">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </Card>
                    )}
                />

                <Controller
                    name="backgroundAudio"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Card className="p-6">
                            <Label className="text-lg font-semibold mb-4 block">
                                {t('background_audio')}
                            </Label>
                            {field.value && !showUploaders.backgroundAudio ? (
                                <div className="relative">
                                    <audio src={field.value} controls className="w-full" />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => handleRemoveFile('backgroundAudio')}
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <FileUploader
                                    icon={<Music className="h-8 w-8 sm:h-12 sm:w-12" />}
                                    multiple={false}
                                    accept={{ 'audio/*': ['.mp3', '.wav'] }}
                                    maxFiles={1}
                                    maxSize={5 * 1024 * 1024}
                                    onFileUpload={(files) => {
                                        field.onChange(files[0]?.url || '');
                                        setShowUploaders(prev => ({ ...prev, backgroundAudio: false }));
                                    }}
                                />
                            )}
                            {fieldState.error && (
                                <p className="text-sm text-destructive mt-1">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </Card>
                    )}
                />
            </div>

            <div className="flex justify-end">
                {/* Save Button (identical to Option 1) */}
                <LoaderButton
                    type="submit"
                    isLoading={isUpdating || form.formState.isSubmitting}
                    disabled={!canUpdateContent(exhibition.status) || !form.formState.isDirty || form.formState.isSubmitting || isUpdating}
                    className="flex items-center gap-2"
                >
                    <SaveIcon className="h-4 w-4" />
                    {isUpdating ? tCommon('saving') : tCommon('save_changes')}
                </LoaderButton>
            </div>
        </form>
    );
}