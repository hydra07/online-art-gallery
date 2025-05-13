import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
const geistSans = localFont({
	src: '../fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
});

const geistMono = localFont({
	src: '../fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
});

const poppins = Poppins({
	subsets: ['latin'], // Chọn các subset bạn cần
	weight: ['400', '500', '700'], // Chọn các weight bạn cần
	variable: '--font-poppins'
});

export const metadata: Metadata = {
	title: 'Art Gallery',
	description: 'A platform for artists to showcase their work'
};

export default function RootLayout({
	children,
	params
}: Readonly<{
	children: React.ReactNode;
	params?: { locale?: string };
}>) {
	const lang = params?.locale || 'en';
	return (
		<html lang={lang} suppressHydrationWarning>
			<body
				className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning
			>
					<Providers>{children}</Providers>
				<Toaster />
			</body>
		</html>
	);
}
