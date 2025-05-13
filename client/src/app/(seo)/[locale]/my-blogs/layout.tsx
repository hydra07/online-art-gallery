import '@/app/globals.css';
import type { Metadata } from 'next';
import React, { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import Sidebar from './sidebar-blog';
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

export default async function RootLayout({
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

	const user = await getCurrentUser();
	if (!user) {
		redirect('/');
	}
	return (
		// <html lang="en" suppressHydrationWarning>
		//     <body
		//         className={cn(
		//             "min-h-screen bg-background antialiased overflow-y-auto",
		//             archivo.variable,
		//             libre_franklin.variable
		//         )}
		//     >
		//         <Providers>
		//             <NextTopLoader color="var(--loader-color)" showSpinner={false} />
		<NextIntlClientProvider messages={messages} locale={locale}>
			<div className='flex h-screen'>
				<Sidebar />
				<div className='flex-grow p-4'>{children}</div>
			</div>
		</NextIntlClientProvider>

		//         </Providers>
		//         <Toaster />
		//     </body>
		// </html>
	);
}
