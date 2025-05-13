import { signOut } from 'next-auth/react';
import { TokenExpiredError } from './errors';

export async function refreshAccessToken({ oldToken }: { oldToken: string }) {
	try {
		const response = await fetch(
			`${process.env.NEXTAUTH_URL}/api/refresh`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					oldToken
				})
			}
		);

		if (!response.ok) {
			if (response.status === 401) {
				await fetch(`${process.env.NEXTAUTH_URL}/api/auth/logout`, {
					method: 'POST'
				});
				await signOut({
					redirect: true,
					callbackUrl: '/sign-in'
				});
				// throw new TokenExpiredError();
			}
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		console.log('data lib', data);
		return data;
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			throw error;
		}
		console.error('Error in refreshAccessToken:', error);
		throw error;
	}
}
