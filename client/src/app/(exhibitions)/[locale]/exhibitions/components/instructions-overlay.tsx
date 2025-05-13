'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';
import Kbd from '@/components/ui.custom/kbd';
import { useTranslations } from 'next-intl';

interface InstructionOverlayProps {
    active: boolean;
    onResume: () => void;
    onExit: () => void;
}

export const InstructionOverlay: React.FC<InstructionOverlayProps> = ({
    active,
    onResume,
    onExit
}) => {
    const t = useTranslations('exhibitions');

    const overlayClassName = `
        absolute inset-0 flex items-center justify-center z-10
        bg-black/80 text-white p-4
        transition-opacity duration-300 ease-in-out
        ${active ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}
    `;

    return (
        <div className={overlayClassName}>
            <div className="max-w-md text-center">
                <h2 className="text-xl font-bold mb-4">{t('instruction')}</h2>
                <ul className="mb-4 text-sm text-left list-inside space-y-3">
                    <li>
                        <Kbd>W</Kbd>, <Kbd>A</Kbd>, <Kbd>S</Kbd>, <Kbd>D</Kbd> - {t('movement')}
                    </li>
                    <li>{t('look')}</li>
                    <li><Kbd>ESC</Kbd> - {t('menu')}</li>
                </ul>
                <div className="flex gap-4 justify-center">
                    <Button
                    
                        onClick={onResume}
                        className="flex items-center gap-2"
                        variant="default"
                    >
                        <Play className="h-4 w-4" /> {t('resume')}
                    </Button>
                    <Button
                        onClick={onExit}
                        className="flex items-center gap-2"
                        variant="secondary"
                    >
                        <X className="h-4 w-4" /> {t('exit')}
                    </Button>
                </div>
            </div>
        </div>
    );
};