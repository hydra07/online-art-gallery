import { useEffect } from 'react';
import { useCameraStore } from '@/store/cameraStore';

export const useKeyboardControls = (
    active: boolean, 
    setActive: (value: boolean) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setTargetPosition: (value: any) => void
) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const storeIsLocked = useCameraStore.getState().isLocked;

            if (event.key === 'Escape') {
                if (storeIsLocked) {
                    setTargetPosition(null);
                } else if (active) {
                    setActive(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [active, setActive, setTargetPosition]);
};