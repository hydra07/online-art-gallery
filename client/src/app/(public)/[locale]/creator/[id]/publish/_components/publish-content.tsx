'use client';

import { Exhibition, ExhibitionStatus } from "@/types/exhibition";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Rocket, EyeOff, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExhibitionInfoHeader } from "../../components/exhibition-info-header";
import ExhibitionPublishStatus from "./exhibition-publish-status";
import { LoaderButton } from "@/components/ui.custom/loader-button";
import { useExhibition } from "../../../context/exhibition-provider";
import ExhibitionDateManager, { DateFormValues } from "./exhibition-date-manager";
import LinkNameManager from "./exhibition-linkname-manager";
import DiscoveryManager from "./exhibition-discovery-manager";
import TicketManager, { TicketData } from "./ticket-manager";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define operation types for tracking specific loading states
type UpdateOperation = 'linkName' | 'publish' | 'unpublish' | 'discovery' | 'dates' | 'ticket' | 'cancelPending';

// Link name form schema
const linkNameSchema = z.object({
  linkName: z.string()
    .min(3, { message: 'Link name must be at least 3 characters long' })
    .max(30, { message: 'Link name must be less than 30 characters' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Link name can only contain lowercase letters, numbers, and hyphens'
    })
});

// Date form schema
const dateFormSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// Form values for link name
type LinkFormValues = z.infer<typeof linkNameSchema>;

const canUpdateExhibition = (status: ExhibitionStatus) => {
  return status !== ExhibitionStatus.PUBLISHED;
};
export default function PublishContent({ exhibition }: { exhibition: Exhibition }) {
  const t = useTranslations('exhibitions');
  const tCommon = useTranslations('common');
  const { toast } = useToast();
  const { updateExhibition, isUpdating } = useExhibition();
  const [isPublished, setIsPublished] = useState(exhibition.status === ExhibitionStatus.PUBLISHED);
  const [isPending, setIsPending] = useState(exhibition.status === ExhibitionStatus.PENDING);
  // Track operation-specific loading states
  const [currentOperation, setCurrentOperation] = useState<UpdateOperation | null>(null);
  const [isDiscoverable, setIsDiscoverable] = useState(exhibition.discovery || false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const baseUrl = 'oag-vault.vercel.app/exhibitions/';

  // Initialize the forms with exhibition data
  const linkNameForm = useForm<LinkFormValues>({
    resolver: zodResolver(linkNameSchema),
    defaultValues: {
      linkName: exhibition.linkName || '',
    }
  });

  // Initialize date form
  const dateForm = useForm<DateFormValues>({
    resolver: zodResolver(dateFormSchema),
    defaultValues: {
      startDate: exhibition.startDate ? new Date(exhibition.startDate) : undefined,
      endDate: exhibition.endDate ? new Date(exhibition.endDate) : undefined
    }
  });

  // Helper to check if a specific operation is in progress
  const isOperationLoading = (operation: UpdateOperation) => isUpdating && currentOperation === operation;

  // Validate exhibition before publishing
  const validateExhibition = (): string[] => {
    const errors: string[] = [];

    // Check for artwork positions
    if (exhibition.artworkPositions.length === 0) {
      errors.push(t('validation_no_artworks'));
    }

    // Check for link name
    if (!linkNameForm.watch('linkName')) {
      errors.push(t('validation_no_linkname'));
    }

    // Check dates (if end date is before start date)
    const startDate = dateForm.watch('startDate');
    const endDate = dateForm.watch('endDate');

    if (startDate && endDate && endDate < startDate) {
      errors.push(t('validation_invalid_dates'));
    }

    return errors;
  };

  // Handle link name update
  const handleLinkNameSave = async (linkName: string) => {
    if (!canUpdateExhibition(exhibition.status)) {
      toast({
        title: tCommon('error'),
        description: t('cannot_update_published_exhibition'),
        variant: 'destructive',
      });
      return;
    }
    setCurrentOperation('linkName');
    await updateExhibition(
      { linkName },
      {
        onSuccess: () => {
          toast({
            variant: 'success',
            title: tCommon('success'),
            description: t('link_name_updated'),
            className: "bg-green-500 text-white"
          });
          linkNameForm.reset({ linkName });
          setCurrentOperation(null);
        },
        onError: (error) => {
          console.log('Error updating link name:', error);
          toast({
            title: tCommon('error'),
            description: t(error.err?.message || 'link_name_update_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  // Handle date updates
  const handleSaveDates = async (dates: DateFormValues) => {
    if (!canUpdateExhibition(exhibition.status)) {
      toast({
        title: tCommon('error'),
        description: t('cannot_update_published_exhibition'),
        variant: 'destructive',
      });
      return;
    }
    setCurrentOperation('dates');
    await updateExhibition(
      {
        startDate: dates.startDate,
        endDate: dates.endDate
      },
      {
        onSuccess: () => {
          toast({
            title: tCommon('success'),
            description: t('dates_updated'),
            variant: 'success',
          });
          setCurrentOperation(null);
        },
        onError: () => {
          toast({
            title: tCommon('error'),
            description: t('dates_update_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  // Handle discovery toggle with immediate update
  const handleDiscoveryToggle = async (checked: boolean) => {
    setCurrentOperation('discovery');
    setIsDiscoverable(checked); // Update local state optimistically

    await updateExhibition(
      { discovery: checked },
      {
        onSuccess: () => {
          toast({
            title: tCommon('success'),
            description: t('discovery_updated'),
            variant: 'success',
          });
          setCurrentOperation(null);
        },
        onError: () => {
          // Revert the UI state on failure
          setIsDiscoverable(!checked);
          toast({
            title: tCommon('error'),
            description: t('discovery_update_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  // Handle cancelling a pending publication request
  const handleCancelPending = async () => {
    if (isUpdating && currentOperation) return;

    setCurrentOperation('cancelPending');
    await updateExhibition(
      { status: ExhibitionStatus.DRAFT },
      {
        onSuccess: () => {
          setIsPublished(false);
          setIsPending(false);
          toast({
            title: tCommon('success'),
            description: t('exhibition_pending_cancelled'),
            variant: 'success',
          });
          setCurrentOperation(null);
        },
        onError: (error) => {
          toast({
            title: tCommon('error'),
            description: t(error.err?.message || 'cancel_pending_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  // Handle unpublish
  const handleUnpublish = async () => {
    if (isUpdating && currentOperation) return;

    if (exhibition.artworkPositions.length === 0) {
      toast({
        title: tCommon('error'),
        description: t('unpublish_no_artworks'),
        variant: 'destructive',
      });
      return;
    }

    setCurrentOperation('unpublish');
    await updateExhibition(
      { status: ExhibitionStatus.DRAFT },
      {
        onSuccess: () => {
          setIsPublished(false);
          setIsPending(false);
          toast({
            title: tCommon('success'),
            description: t('exhibition_unpublished'),
            variant: 'success',
          });
          setCurrentOperation(null);
        },
        onError: (error) => {
          toast({
            title: tCommon('error'),
            description: t(error.err?.message || 'unpublish_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  // Submit handler for publishing the exhibition
  const handlePublish = async () => {
    const linkName = linkNameForm.getValues('linkName');
    const startDate = dateForm.getValues('startDate');
    const endDate = dateForm.getValues('endDate');

    // Validate before submitting
    const errors = validateExhibition();
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast({
        title: tCommon('error'),
        description: t('validation_errors'),
        variant: 'destructive',
      });
      return;
    }

    setValidationErrors([]);
    setCurrentOperation('publish');
    await updateExhibition(
      {
        linkName,
        status: ExhibitionStatus.PENDING,
        startDate,
        endDate
      },
      {
        onSuccess: () => {
          setIsPending(true);
          toast({
            title: tCommon('success'),
            description: t('exhibition_pending'),
            variant: 'success',
          });
          setCurrentOperation(null);
        },
        onError: (error) => {
          toast({
            title: tCommon('error'),
            description: t(error.err?.message || 'exhibition_pending_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  const [ticket, setTicket] = useState<TicketData>({
    requiresPayment: exhibition.ticket?.requiresPayment || false,
    price: exhibition.ticket?.price || 0,
    registeredUsers: exhibition.ticket?.registeredUsers || []
  });

  const handleTicketUpdate = async (updatedTicket: TicketData) => {
    setCurrentOperation('ticket');
    await updateExhibition(
      { ticket: updatedTicket },
      {
        onSuccess: () => {
          setTicket(updatedTicket);
          toast({
            title: tCommon('success'),
            description: t('ticket_settings_updated'),
            variant: 'success',
          });
          setCurrentOperation(null);
        },
        onError: () => {
          toast({
            title: tCommon('error'),
            description: t('ticket_settings_update_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 space-y-8'>
      <ExhibitionInfoHeader
        description={t('exhibition_publish_description')}
        title={t('exhibition_publish_title')}
      />

      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-4 mt-2">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {/* Link Name Section */}
        <LinkNameManager
          form={linkNameForm}
          baseUrl={baseUrl}
          isPublished={isPublished || isPending}
          onSave={handleLinkNameSave}
          isLoading={isOperationLoading('linkName')}
          originalLinkName={exhibition.linkName || ''}
          disabled={!canUpdateExhibition(exhibition.status)}
        />

        {/* Exhibition Dates Section */}
        <ExhibitionDateManager
          form={dateForm}
          exhibition={exhibition}
          onSaveDates={handleSaveDates}
          isLoading={isOperationLoading('dates')}
          disabled={!canUpdateExhibition(exhibition.status)}
        />

        {/* Ticket Section */}
        <TicketManager
          ticket={ticket}
          onSave={handleTicketUpdate}
          isLoading={isOperationLoading('ticket')}
        />

        {/* Discoverability Section */}
        <DiscoveryManager
          isDiscoverable={isDiscoverable}
          isPublished={isPublished}
          onToggle={handleDiscoveryToggle}
          isLoading={isOperationLoading('discovery')}
        />

        {/* Publication Status */}
        <ExhibitionPublishStatus
          status={exhibition.status}
          linkName={linkNameForm.watch('linkName')}
          baseUrl={baseUrl}
          ticket={ticket}
        />

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 gap-4">
          {/* Cancel Pending button - only show if status is pending */}
          {isPending && (
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleCancelPending}
              disabled={isOperationLoading('cancelPending')}
              className="gap-2 border-amber-500 text-amber-500 hover:bg-amber-50"
            >
              <Clock className="w-5 h-5" />
              {isOperationLoading('cancelPending') ? t('cancelling_request') : t('cancel_pending_request')}
            </Button>
          )}

          {/* Unpublish button - only show if already published */}
          {isPublished && (
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleUnpublish}
              disabled={isOperationLoading('unpublish')}
              className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
            >
              <EyeOff className="w-5 h-5" />
              {isOperationLoading('unpublish') ? t('unpublishing') : t('unpublish')}
            </Button>
          )}

          {/* Only show publish button if not published or pending */}
          {!isPublished && !isPending && (
            <LoaderButton
              isLoading={isOperationLoading('publish')}
              onClick={handlePublish}
              size="lg"
              disabled={
                !linkNameForm.watch('linkName') ||
                !!linkNameForm.formState.errors.linkName ||
                isOperationLoading('publish')
              }
              className="gap-2"
            >
              <Rocket className="w-5 h-5" />
              {t('publish_exhibition')}
            </LoaderButton>
          )}
        </div>
      </div>
    </div>
  );
}