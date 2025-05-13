'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from "next-intl";
import { getGalleryTemplates } from '@/service/gallery';
import { Gallery } from '@/types/new-gallery';
import PreviewModal from './preview-modal';
import { LoaderButton } from '@/components/ui.custom/loader-button';

interface TemplateSelectionModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectTemplate?: (templateId: string) => void;
    isCreating?: boolean;
    isPremium?: boolean;
}

export default function TemplateSelectionModal({
    isOpen,
    onOpenChange,
    onSelectTemplate,
    isCreating = false,
    isPremium = false
}: TemplateSelectionModalProps) {
    const router = useRouter();
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<Gallery | null>(null);
    const t = useTranslations("exhibitions");
    
    const { data: templates = [], isLoading } = useQuery({
        queryKey: ['galleryTemplates'],
        queryFn: async () => {
            const response = await getGalleryTemplates();
            return response.data?.galleries || [];
        },
        enabled: isOpen,
    });

    const handleCreateExhibition = async () => {
        if (!selectedTemplate) return;
        
        if (onSelectTemplate) {
            onSelectTemplate(selectedTemplate);
        } else {
            onOpenChange(false);
            router.push(`/creator/artworks`);
        }
    };

    const handlePreviewTemplate = (e: React.MouseEvent, template: Gallery) => {
        e.stopPropagation();
        setPreviewTemplate(template);
    };

    const handleTemplateSelect = (template: Gallery) => {
        if (template.isPremium && !isPremium) {
            // toast({
            //     title: t('premium_required'),
            //     description: t('premium_template_description'),
            //     variant: 'destructive'
            // });
            return;
        }
        setSelectedTemplate(template._id);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{t("choose_template")}</h2>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                        </div>
                    ) : templates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                            <h3 className="text-lg font-medium mb-2">{t("no_templates_available")}</h3>
                            <p className="text-sm text-muted-foreground">
                                Empty
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 -mr-4">
                            <div>
                                {templates.map((template) => (
                                    <div
                                        key={template._id}
                                        className={`flex items-center space-x-4 p-3 rounded-lg transition-all 
                                            ${template.isPremium && !isPremium 
                                                ? 'opacity-50 cursor-not-allowed' 
                                                : 'cursor-pointer group'}
                                            ${selectedTemplate === template._id
                                                ? 'bg-primary/5 ring-2 ring-primary shadow-md scale-[1.02]'
                                                : 'hover:bg-gray-50 hover:shadow-sm'
                                            }`}
                                        onClick={() => handleTemplateSelect(template)}
                                    >
                                        <div className="relative w-20 h-20 flex-shrink-0">
                                            <Image
                                                src={template.previewImage!}
                                                alt={template.name}
                                                fill
                                                sizes="96px"
                                                className={`object-cover rounded-full transition-transform duration-200
                                                ${selectedTemplate === template._id
                                                        ? 'scale-105'
                                                        : 'group-hover:scale-105'
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`text-lg font-semibold transition-colors
                                                    ${selectedTemplate === template._id
                                                        ? 'text-primary'
                                                        : 'group-hover:text-primary'
                                                    }`}
                                                >
                                                    {template.name}
                                                </h3>
                                                {template.isPremium && (
                                                    <Badge variant="secondary" className="gap-1">
                                                        ✨
                                                        {t('premium')}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {template.description}
                                            </p>
                                           
                                        </div>
                                        <div className="flex items-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => handlePreviewTemplate(e, template)}
                                                className={`rounded-full transition-all duration-200
                                                ${selectedTemplate === template._id
                                                        ? 'text-primary hover:text-primary/80 hover:bg-primary/10'
                                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                title={t("preview_gallery")}
                                            >
                                                <Eye className="w-5 h-5 transition-transform duration-200" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            {t("cancel")}
                        </Button>
                        <LoaderButton
                            isLoading ={isCreating}
                            onClick={handleCreateExhibition}
                            disabled={!selectedTemplate || isLoading || isCreating}
                        >                           
                                {t("create")}
                        </LoaderButton>
                    </div>
                </DialogContent>
            </Dialog>

            {previewTemplate && (
                <PreviewModal
                    isOpen={!!previewTemplate}
                    onOpenChange={(open) => !open && setPreviewTemplate(null)}
                    template={previewTemplate}
                />
            )}
        </>
    );
}