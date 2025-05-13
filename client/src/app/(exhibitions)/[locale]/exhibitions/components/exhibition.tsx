'use client';

import React, { useState, useRef, Suspense, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCameraStore } from '@/store/cameraStore';
import { GalleryPreviewLoader } from '@/app/(public)/[locale]/about/components/gallery-preview-loader';
import { InstructionOverlay } from './instructions-overlay';
import { usePointerLock } from '@/hooks/use-pointer-lock';
import { useKeyboardControls } from '@/hooks/use-keyboard-controls';
import { Exhibition as ExhibitionType } from '@/types/exhibition';
import { Session } from 'next-auth';

export interface ExhibitionProps {
    exhibition: ExhibitionType;
    session: Session | null;
}

const Scene = dynamic(() => import('./scene').then((mod) => mod.default), {
    ssr: false,
    loading: () => <GalleryPreviewLoader />,
});

export default function Exhibition({ exhibition, session }: ExhibitionProps) {
    const [active, setActive] = useState(true);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const storeIsLocked = useCameraStore(state => state.isLocked);
    const { setTargetPosition, setIsTransitioningBack } = useCameraStore();

    usePointerLock({
        active,
        canvasContainerRef,
        setActive,
        setIsTransitioningBack
    });

    useKeyboardControls(active, setActive, setTargetPosition);

    const handleResume = useCallback(() => {
        if (useCameraStore.getState().isLocked) {
            setTargetPosition(null);
        }
        setActive(true);
    }, [setTargetPosition]);

    const handleExit = useCallback(() => {
        if (document.body.style.cursor === 'none') {
            document.body.style.cursor = 'default';
        }
        setActive(false);
        setTargetPosition(null);
        router.push('/discover');
    }, [router, setTargetPosition]);

    useEffect(() => {
        return () => {
            // Cleanup: ensure cursor is visible when component unmounts
            document.body.style.cursor = 'default';
        };
    }, []);

    return (
        <div
            ref={canvasContainerRef}
            style={{ cursor: (active && !storeIsLocked) ? 'none' : 'default' }}
            className='relative w-full h-screen bg-gray-900'
        >
             {exhibition.backgroundAudio && (
            <audio
              src={exhibition.backgroundAudio}
              loop
              autoPlay
              className="hidden"
            />
          )}
            <InstructionOverlay
                active={active}
                onResume={handleResume}
                onExit={handleExit}
            />
            <Canvas
                shadows
                performance={{ min: 0.5, max: 1, debounce: 200 }}
                className="w-full h-screen block"
            >
                <Suspense fallback={null}>
                    <Scene exhibition={exhibition} session={session} />
                </Suspense>
            </Canvas>
        </div>
    );
}