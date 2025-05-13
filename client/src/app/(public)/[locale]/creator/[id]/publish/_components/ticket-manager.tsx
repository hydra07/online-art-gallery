'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, RefreshCcw, Ticket } from 'lucide-react';

export interface TicketData {
  requiresPayment: boolean;
  price: number;
  registeredUsers: string[];
}

interface TicketManagerProps {
  ticket: TicketData | undefined;
  onSave: (ticket: TicketData) => Promise<void>;
  isLoading: boolean;
}

export default function TicketManager({
  ticket,
  onSave,
  isLoading
}: TicketManagerProps) {
  const t = useTranslations('exhibitions');
  const [ticketSettings, setTicketSettings] = useState<TicketData>({
    requiresPayment: ticket?.requiresPayment || false,
    price: ticket?.price || 0,
    registeredUsers: ticket?.registeredUsers || []
  });
  const [isDirty, setIsDirty] = useState(false);
  
  const handleRequiresPaymentChange = (checked: boolean) => {
    setTicketSettings(prev => ({ 
      ...prev, 
      requiresPayment: checked,
      // Reset price to 0 when toggling off paid tickets
      price: checked ? prev.price : 0
    }));
    setIsDirty(true);
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value);
    setTicketSettings(prev => ({ 
      ...prev, 
      price: isNaN(price) ? 0 : price 
    }));
    setIsDirty(true);
  };
  
  const handleReset = () => {
    setTicketSettings({
      requiresPayment: ticket?.requiresPayment || false,
      price: ticket?.price || 0,
      registeredUsers: ticket?.registeredUsers || []
    });
    setIsDirty(false);
  };
  
  const handleSave = async () => {
    await onSave(ticketSettings);
    setIsDirty(false);
  };
  
  const isPriceValid = !ticketSettings.requiresPayment || ticketSettings.price > 0;
  const registeredCount = ticketSettings.registeredUsers?.length || 0;
  
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Ticket className="h-5 w-5 text-primary" />
        <Label className="text-lg font-semibold">
          {t('ticket_settings')}
        </Label>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {t('ticket_settings_description')}
      </p>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Label htmlFor="requiresPayment" className="font-medium">
              {t('requires_payment')}
            </Label>
            <p className="text-sm text-gray-500">
              {t('requires_payment_description')}
            </p>
          </div>
          <Switch
            id="requiresPayment"
            checked={ticketSettings.requiresPayment}
            onCheckedChange={handleRequiresPaymentChange}
            disabled={isLoading}
          />
        </div>
        
        {ticketSettings.requiresPayment && (
          <div className="space-y-2">
            <Label htmlFor="ticketPrice" className="font-medium">
              {t('ticket_price')}
            </Label>
            <div className="flex items-center">
              <Input
                id="ticketPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={ticketSettings.price === 0 ? '' : ticketSettings.price.toString()}
                onChange={handlePriceChange}
                placeholder="0.00"
                className={!isPriceValid ? 'border-destructive' : ''}
                disabled={isLoading}
              />
            </div>
            {!isPriceValid && (
              <p className="text-sm text-destructive">
                {t('price_greater_than_zero')}
              </p>
            )}
          </div>
        )}
        
        {registeredCount > 0 && (
          <div className="pt-2 border-t border-border">
            <Label className="font-medium">
              {t('registered_users')}
            </Label>
            <p className="text-sm">
              {t('registered_users_count', { count: registeredCount })}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
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
          disabled={isLoading || !isDirty || (ticketSettings.requiresPayment && !isPriceValid)}
          className="gap-1"
        >
          <Save className="w-4 h-4" />
          {isLoading ? t('saving') : t('save_changes')}
        </Button>
      </div>
    </Card>
  );
}