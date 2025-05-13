import { ClipboardCopy, Eye, ExternalLink, Ticket, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { vietnamCurrency } from '@/utils/converters';
import { ExhibitionStatus } from '@/types/exhibition';

interface ExhibitionStatusProps {
  status: ExhibitionStatus;
  linkName: string;
  baseUrl: string;
  ticket?: {
    requiresPayment: boolean;
    price: number;
    registeredUsers?: string[];
  };
}

export default function ExhibitionPublishStatus({ 
  status, 
  linkName, 
  baseUrl,
  ticket
}: ExhibitionStatusProps) {
  const t = useTranslations('exhibitions');
  const { toast } = useToast();
  
  const hasTicket = ticket !== undefined;
  const isPaid = hasTicket && ticket.requiresPayment;
  const registeredCount = ticket?.registeredUsers?.length || 0;
  // const isPublished = status === ExhibitionStatus.PUBLISHED;
  
  // Helper function to get status color
  const getStatusColor = () => {
    switch(status) {
      case ExhibitionStatus.PUBLISHED:
        return "bg-green-500";
      case ExhibitionStatus.PENDING:
        return "bg-blue-500";
      case ExhibitionStatus.DRAFT:
        return "bg-amber-500";
      case ExhibitionStatus.PRIVATE:
        return "bg-purple-500";
      case ExhibitionStatus.REJECTED:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  // Helper to get status text
  const getStatusText = () => {
    switch(status) {
      case ExhibitionStatus.PUBLISHED:
        return t('published');
      case ExhibitionStatus.PENDING:
        return t('pending');
      case ExhibitionStatus.DRAFT:
        return t('draft');
      case ExhibitionStatus.PRIVATE:
        return t('private');
      case ExhibitionStatus.REJECTED:
        return t('rejected');
      default:
        return t('draft');
    }
  };
  
  // Helper for alert title
  const getAlertTitle = () => {
    switch(status) {
      case ExhibitionStatus.PUBLISHED:
        return t('exhibition_status_published');
      case ExhibitionStatus.PENDING:
        return t('exhibition_status_pending');
      case ExhibitionStatus.DRAFT:
      default:
        return t('exhibition_status_draft');
    }
  };
  
  // Alert icon based on status
  const getAlertIcon = () => {
    if (status === ExhibitionStatus.PENDING) {
      return <Clock className="h-4 w-4" />;
    }
    return <Eye className="h-4 w-4" />;
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('exhibition_status_title')}</h3>
      
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            getStatusColor()
          )} />
          <span className="font-medium">
            {getStatusText()}
          </span>
        </div>
        
        {hasTicket && (
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            <Badge variant={isPaid ? "default" : "outline"}>
              {isPaid ? (
                <span className="flex items-center gap-1">
                   {vietnamCurrency(ticket.price)}
                </span>
              ) : (
                t('ticket_free')
              )}
            </Badge>
            
            {registeredCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {t('registered_count', { count: registeredCount })}
              </Badge>
            )}
          </div>
        )}
      </div>
      
      <Alert className={cn(
        status === ExhibitionStatus.PENDING ? "bg-blue-100" : 
        status === ExhibitionStatus.PUBLISHED ? "bg-green-100" : "bg-yellow-100"
      )}>
        {getAlertIcon()}
        <AlertTitle>
          {getAlertTitle()}
        </AlertTitle>
        <AlertDescription>
          {status === ExhibitionStatus.PUBLISHED ? (
            <div className="mt-2 space-y-2">
              <p>
                {t('exhibition_live')}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-mono break-all">
                  {baseUrl}{linkName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${baseUrl}${linkName}`);
                    toast({
                      description: t('link_copied'),
                    });
                  }}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
                <a
                  href={`https://${baseUrl}${linkName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : status === ExhibitionStatus.PENDING ? (
            <p className="mt-2">
              {t('exhibition_pending_review')}
            </p>
          ) : (
            <p className="mt-2">
              {t('exhibition_not_published')}
            </p>
          )}
        </AlertDescription>
      </Alert>
    </Card>
  );
}