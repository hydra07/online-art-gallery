import { useEffect, useRef } from 'react';
import { useCameraStore } from '@/store/cameraStore';
import { EXHIBITION_CONSTANTS } from '@/utils/constants';

export interface UsePointerLockOptions {
    active: boolean;
    canvasContainerRef: React.RefObject<HTMLDivElement>;
    setActive: (value: boolean) => void;
    setIsTransitioningBack: (value: boolean) => void;
}

export const usePointerLock = ({
    active,
    canvasContainerRef,
    setActive,
    setIsTransitioningBack
}: UsePointerLockOptions) => {
    const lockRequestTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handlePointerLockChange = () => {
            const isPointerLocked = document.pointerLockElement !== null;
            const currentStoreState = useCameraStore.getState();
            const { isLocked: storeIsLockedNow, isTransitioningBack: storeIsTransitioningBack } = currentStoreState;

            if (isPointerLocked) {
                if (storeIsTransitioningBack) {
                    setIsTransitioningBack(false);
                }
            } else if (active && !storeIsLockedNow && !storeIsTransitioningBack) {
                setActive(false);
            }
        };

        const handlePointerLockError = (err: Event) => {
            console.error('Pointer lock failed:', err);
            setIsTransitioningBack(false);
            setActive(false);
            clearLockRequestTimer();
        };

        const clearLockRequestTimer = () => {
            if (lockRequestTimerRef.current) {
                clearTimeout(lockRequestTimerRef.current);
                lockRequestTimerRef.current = null;
            }
        };

        document.addEventListener('pointerlockchange', handlePointerLockChange);
        document.addEventListener('pointerlockerror', handlePointerLockError);

        if (active) {
            const currentStoreState = useCameraStore.getState();
            if (!currentStoreState.isLocked && !currentStoreState.isTransitioningBack) {
                lockRequestTimerRef.current = setTimeout(() => {
                    const canvasElement = canvasContainerRef.current?.querySelector('canvas');
                    const latestStoreState = useCameraStore.getState();
                    
                    if (canvasElement && 
                        document.pointerLockElement === null && 
                        !latestStoreState.isLocked && 
                        !latestStoreState.isTransitioningBack) {
                        canvasElement.requestPointerLock().catch(console.error);
                    }
                    lockRequestTimerRef.current = null;
                }, EXHIBITION_CONSTANTS.POINTER_LOCK_DELAY);
            } else {
                clearLockRequestTimer();
            }
        } else {
            clearLockRequestTimer();
            const currentStoreState = useCameraStore.getState();
            if (document.pointerLockElement && 
                !currentStoreState.isLocked && 
                !currentStoreState.isTransitioningBack) {
                document.exitPointerLock();
            }
        }

        return () => {
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            document.removeEventListener('pointerlockerror', handlePointerLockError);
            clearLockRequestTimer();
        };
    }, [active, canvasContainerRef, setActive, setIsTransitioningBack]);
};