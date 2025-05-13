'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useServerAction } from "zsa-react";
import { createExhibitionAction } from "../actions";
import TemplateSelectionModal from "./template-selection-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { PlusCircle } from "lucide-react";

export default function CreateExhibitionButton( { isPremium }: { isPremium: boolean }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const t = useTranslations("exhibitions");
    const tCommon = useTranslations("common");

    const { execute, isPending } = useServerAction(createExhibitionAction, {
        onSuccess: (result) => {
            toast({
                variant: "success",
                title: tCommon("success"),
                description: t("exhibition_created_success"),
                className: "bg-green-500 text-white"
            });
            setIsModalOpen(false);
            router.push(`/creator/${result.data.exhibition._id}/artworks`);
            router.refresh();
        },
        onError: (error) => {
            toast({
                title: tCommon("error"),
                description: t("exhibition_creation_failed"),
                variant: "destructive"
            });
            console.error('Error creating exhibition:', error);
        },
    });

    const handleTemplateSelect = (templateId: string) => {
        if (templateId) {
            execute({ templateId });
        }
    };

    return (
        <>
            <Button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2"
                variant="outline"
            >
                <PlusCircle className="h-4 w-4" />
                {t("create_exhibition")}
            </Button>

            <TemplateSelectionModal
                isPremium={isPremium}
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSelectTemplate={handleTemplateSelect}
                isCreating={isPending}
            />
        </>
    );
}