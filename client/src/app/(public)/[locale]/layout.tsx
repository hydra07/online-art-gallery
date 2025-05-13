import { routing } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
// import SignOutItem from "./_header/sign-out-item";
import Header from './_header';
// import Footer from '@/components/footer';

export default async function PublicLayout({
	children,
	params: { locale }
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<NextIntlClientProvider messages={messages} locale={locale}>
			<Header />
			<div className='mt-20'>{children}</div>
			{/* <Footer /> */}
		</NextIntlClientProvider>
	);
}
