'use client';
import { useEffect, useRef } from 'react';
import { updateExhibitionAnalytics } from '@/service/exhibition';

export function useExhibitionAnalytics(exhibitionId: string, isStarted: boolean) {
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (!exhibitionId || !isStarted) return;

        // Record start time when user enters exhibition
        startTimeRef.current = Date.now();

        return () => {
            // Calculate and send time spent when user leaves
            if (startTimeRef.current) {
                const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
                // updateAnalytics({ exhibitionId, timeSpent });
                updateExhibitionAnalytics(exhibitionId, timeSpent);
            }
        };
    }, [exhibitionId, isStarted]);
}