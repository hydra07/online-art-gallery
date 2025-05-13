'use client';
import { useSession } from 'next-auth/react';

export default function useAuthClient() {
	const { data: session, status } = useSession({
		required: false
	});
	if (!session || !session.user)
		return {
			user: null,
			status
		};
	return {
		user: session.user,
		status
	};
}
