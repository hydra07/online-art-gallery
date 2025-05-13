'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Save, RefreshCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Exhibition } from "@/types/exhibition";

export type DateFormValues = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

interface ExhibitionDateManagerProps {
  form: UseFormReturn<DateFormValues>;
  exhibition: Exhibition;
  onSaveDates: (dates: DateFormValues) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;

}

export default function ExhibitionDateManager({
  form,
  exhibition,
  onSaveDates,
  isLoading,
  disabled = false
}: ExhibitionDateManagerProps) {
  const t = useTranslations('exhibitions');
  const [isDirty, setIsDirty] = useState(false);

  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    form.setValue(field, date, {
      shouldValidate: true,
      shouldDirty: true
    });
    setIsDirty(true);
  };

  const handleReset = () => {
    form.setValue('startDate', exhibition.startDate ? new Date(exhibition.startDate) : undefined, {
      shouldDirty: false
    });
    form.setValue('endDate', exhibition.endDate ? new Date(exhibition.endDate) : undefined, {
      shouldDirty: false
    });
    setIsDirty(false);
  };

  const handleSave = async () => {
    await onSaveDates({
      startDate,
      endDate
    });
    setIsDirty(false);
  };

  const startDateError = form.formState.errors.startDate?.message;
  const endDateError = form.formState.errors.endDate?.message;

  // Validate that end date is after start date
  const isEndDateValid = !startDate || !endDate || (startDate && endDate && endDate > startDate);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <Label className="text-lg font-semibold">
          {t('exhibition_dates')}
        </Label>
        <p className="text-sm text-gray-500 mb-4">
          {t('exhibition_dates_description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">{t('start_date')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground",
                  startDateError && "border-destructive"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : t('select_date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => handleDateChange('startDate', date)}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
          {startDateError && (
            <p className="text-sm text-destructive">{startDateError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">{t('end_date')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground",
                  (endDateError || !isEndDateValid) && "border-destructive"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : t('select_date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => handleDateChange('endDate', date)}
                initialFocus
                disabled={(date) => startDate ? date < startDate : false}
              />
            </PopoverContent>
          </Popover>
          {endDateError && (
            <p className="text-sm text-destructive">{endDateError}</p>
          )}
          {!endDateError && !isEndDateValid && (
            <p className="text-sm text-destructive">{t('end_date_after_start')}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
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
          disabled={disabled || isLoading || !isDirty || !isEndDateValid}
          className="gap-1"
        >
          <Save className="w-4 h-4" />
          {isLoading ? t('saving') : t('save_changes')}
        </Button>
      </div>
    </Card>
  );
}