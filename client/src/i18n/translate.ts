import { useTranslations } from 'next-intl';

export function useCustomTranslations(namespace: string = 'common') {
	return useTranslations(namespace);
}

export function createTranslator(namespace: string = 'common') {
	return () => {
		const t = useCustomTranslations(namespace);
		return (key: string) => t(key);
	};
}
