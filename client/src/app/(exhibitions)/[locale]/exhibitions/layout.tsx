import '@/app/globals.css';
import type { Metadata } from 'next';
import React, { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

export const metadata: Metadata = {
    title: 'Art Gallery',
    icons: [
        { rel: 'icon', type: 'image/png', sizes: '48x48', url: '/favicon.ico' }
    ],
    keywords: 'yolo',
    description: 'art gallery online for everyone'
};

export default async function ExhibitionLayout({
    children,
    params: { locale }
}: Readonly<{
    children: ReactNode;
    params: { locale: string };
}>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <div className=''>{children}</div>
        </NextIntlClientProvider>
    );
}
