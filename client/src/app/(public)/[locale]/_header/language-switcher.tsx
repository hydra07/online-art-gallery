'use client';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import ReactCountryFlag from 'react-country-flag';
import { DropdownItemWithIcon } from '@/app/(public)/[locale]/_header/components/header-dropdown';

export default function LanguageSwitcher({ dropdown }: { dropdown?: boolean }) {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const toggleLanguage = () => {
		const newLocale = locale === 'vi' ? 'en' : 'vi';
		router.replace(pathname, { locale: newLocale });
	};

	if (dropdown) {
		return (
			<DropdownItemWithIcon
				icon={
					locale === 'en' ? (
						<ReactCountryFlag
							countryCode='VN'
							svg
							style={{
								width: '1.2em',
								height: '1.2em'
							}}
						/>
					) : (
						<ReactCountryFlag
							countryCode='US'
							svg
							style={{
								width: '1.2em',
								height: '1.2em'
							}}
						/>
					)
				}
				text={locale === 'en' ? 'Tiếng Việt' : 'English'}
				onClick={toggleLanguage}
			/>
		);
	}

	return (
		<button className='w-full space-x-2' onClick={toggleLanguage}>
			{locale === 'en' ? (
				<ReactCountryFlag
					countryCode='VN'
					svg
					style={{
						width: '1.2em',
						height: '1.2em'
					}}
				/>
			) : (
				<ReactCountryFlag
					countryCode='US'
					svg
					style={{
						width: '1.2em',
						height: '1.2em'
					}}
				/>
			)}
		</button>
	);
}
