import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	locales: ['en', 'vi'],
	defaultLocale: 'vi',
	localePrefix: {
		mode: 'always',
		prefixes: {
			en: '/en',
			vi: '/vi'
		}
	},
	pathnames: {
		'/': '/',
		'/sign-in': '/sign-in',
		'/sign-up': '/sign-up'
	}
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing);
