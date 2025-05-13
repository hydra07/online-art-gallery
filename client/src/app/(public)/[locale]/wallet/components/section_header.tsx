'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface SectionHeaderProps {
    title: string;
    backUrl?: string | null;
    rightContent?: ReactNode;
}

export function SectionHeader({ title, backUrl = '/wallet', rightContent }: SectionHeaderProps) {
    return (
        <div className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-[80px] z-30'>
            <div className='container max-w-screen-xl mx-auto py-4'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                        {backUrl && (
                            <Button variant='ghost' size='icon' asChild>
                                <Link href={backUrl}>
                                    <ArrowLeft className='h-5 w-5' />
                                    <span className='sr-only'>Back</span>
                                </Link>
                            </Button>
                        )}
                        <h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
                            {title}
                        </h1>
                    </div>
                    {rightContent}
                </div>
            </div>
        </div>
    );
}
