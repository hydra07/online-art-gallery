'use client';
import { Button } from '@/components/ui/button';
// import { signOutAction } from "@/app/(public)/[locale]/(auth)/sign-up/actions";
import { useTranslations } from 'next-intl';
import NProgress from 'nprogress';
import { signOut } from 'next-auth/react';
import { DropdownItemWithIcon } from '@/app/(public)/[locale]/_header/components/header-dropdown';
import { LogOutIcon } from 'lucide-react';

export default function SignOutItem({ dropdown }: { dropdown?: boolean }) {
	const tCommon = useTranslations('common');

	const handleSignOut = async () => {
		NProgress.start();
		await signOut({
			callbackUrl: '/sign-in',
			redirect: true
		});
		NProgress.done();
	};

	if (dropdown) {
		return (
			<DropdownItemWithIcon
				icon={<LogOutIcon className='w-6 h-6' />}
				text={tCommon('logout')}
				onClick={handleSignOut}
			/>
		);
	}

	return <Button onClick={handleSignOut}>{tCommon('logout')}</Button>;
}
