import HeaderButton from '@/app/(public)/[locale]/_header/components/header-button';
import { SettingsIcon } from 'lucide-react';
import LanguageSwitcher from '@/app/(public)/[locale]/_header/language-switcher';
import ThemeSwitcher from '@/app/(public)/[locale]/_header/theme-switcher';
import { useTranslations } from 'next-intl';
import CustomDropdown from '@/components/ui.custom/custom-dropdown';

export default function Settings() {
	const t = useTranslations('header');
	return (
		<CustomDropdown
			trigger={
				<HeaderButton
					className='backdrop-blur-md bg-opacity-40'
					aria-label='Settings'
				>
					<SettingsIcon className='h-6 w-6' />
				</HeaderButton>
			}
		>
			<div className='w-48'>
				<div className='px-2 py-1.5 text-sm font-semibold'>
					{t('settings')}
				</div>
				<LanguageSwitcher dropdown />
				<ThemeSwitcher dropdown />
			</div>
		</CustomDropdown>
	);
}
