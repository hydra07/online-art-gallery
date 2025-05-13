import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import SignInContent from './sign-in-content';

export default async function SignInPage() {
	const user = await getCurrentUser();
	if (user) {
		redirect('/');
	}

	return (
		<>
			<SignInContent />
		</>
	);
}
