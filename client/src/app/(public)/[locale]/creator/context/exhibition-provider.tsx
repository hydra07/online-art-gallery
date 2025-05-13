/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useState } from 'react';
import { Exhibition, UpdateExhibitionDto } from '@/types/exhibition';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';
import { updateExhibitionAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

interface ExhibitionContextType {
  exhibition: Exhibition;
  isUpdating: boolean;
  updateExhibition: (
    data: UpdateExhibitionDto,
    options?: { onSuccess?: (result: { data: any }) => void; onError?: (error: { err: { code: string; message: string; }; }) => void }
  ) => Promise<any>;
  refreshExhibition: () => void;
}

const ExhibitionContext = createContext<ExhibitionContextType | null>(null);

export default function ExhibitionContextProvider({
  initialData,
  children
}: {
  initialData: Exhibition;
  children: React.ReactNode;
}) {
  const [exhibition, setExhibition] = useState<Exhibition>(initialData);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('exhibitions');
  const tCommon = useTranslations('common');

  // State to track callback options for the current operation
  const [callbackOptions, setCallbackOptions] = useState<{
    onSuccess?: (result: {
      data: any;
    }) => void;
    onError?: (error: {
      err: {
        code: string;
        message: string;
      };
    }) => void;
  } | null>(null);

  const { execute, isPending } = useServerAction(updateExhibitionAction, {
    onSuccess: (result) => {
      // Always update the exhibition state
      setExhibition(result.data.exhibition);

      // If custom success callback provided, call it
      if (callbackOptions?.onSuccess) {
        callbackOptions.onSuccess(result);
        setCallbackOptions(null);
      } else {
        // Default success toast
        toast({
          title: tCommon('success'),
          description: t('exhibition_updated_success'),
          variant: 'success'
        });
      }
    },
    onError: (error) => {
      // If custom error callback provided, call it
      if (callbackOptions?.onError) {
        callbackOptions.onError(error);
        setCallbackOptions(null);
      } else {
        // Default error toast
        toast({
          title: tCommon('error'),
          description: t('exhibition_update_failed'),
          variant: 'destructive'
        });
        console.error('Error updating exhibition:', error);
      }
    }
  });

  const updateExhibition = async (
    data: UpdateExhibitionDto,
    options?: {
      onSuccess?: (result: any) => void,
      onError?: (error: any) => void
    }
  ) => {

    // Store callback options for this operation
    if (options) {
      setCallbackOptions(options);
    } else {
      setCallbackOptions(null);
    }

    try {
      // Execute the server action
      return await execute({ id: exhibition._id, data });
    } catch (error) {
      console.error('Error in updateExhibition:', error); // Add this line
      // Server action's onError will handle displaying errors
      // But we need to re-throw for proper promise rejection
      throw error;
    }
  };

  const refreshExhibition = () => {
    router.refresh();
  };

  return (
    <ExhibitionContext.Provider
      value={{
        exhibition,
        isUpdating: isPending,
        updateExhibition,
        refreshExhibition
      }}
    >
      {children}
    </ExhibitionContext.Provider>
  );
}

// Custom hook to use the exhibition context
export function useExhibition() {
  const context = useContext(ExhibitionContext);
  if (!context) {
    throw new Error('useExhibition must be used within an ExhibitionContextProvider');
  }
  return context;
}