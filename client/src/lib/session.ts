'use server';
import { getServerSession } from 'next-auth/next';
import { AuthenticationError, AuthorizationError } from '@/lib/errors';
import authOptions from '@/lib/nextauth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface TokenPair {
	accessToken: string;
	refreshToken: string;
}

export const getCurrentUser = async () => {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return undefined;
	}
	return {
		...session.user
	};
};

export const getSession = async () => {
	const session = await getServerSession(authOptions);
	return session;
};

export async function setCookies(tokens: TokenPair) {
	'use server';
	console.log('setCookies', tokens);
	const cookieStore = await cookies();

	cookieStore.set('accessToken', tokens.accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 // 1 hour
	});

	// Store refresh token in cookie
	cookieStore.set('refreshToken', tokens.refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 7 * 24 * 60 * 60 // 7 days
	});
}

export const assertAuthenticated = async () => {
	const userSession = await getCurrentUser();

	//kiểm tra session
	if (!userSession) {
		throw new AuthenticationError();
	}

	//kiểm tra user có tồn tại trong database không
	// const user = await getUser(userSession.accessToken);
	// if (!user) {
	//   throw new AuthenticationError();
	// }

	return userSession;
};

export const assertAdmin = async () => {
	try {
		const user = await assertAuthenticated();
		if (!user || !user.role.includes('admin')) {
			throw new AuthorizationError();
		}
		return user;
	} catch (error) {
		if (error instanceof AuthenticationError) {
			redirect('/sign-in');
		}
		if (error instanceof AuthorizationError) {
			redirect('/403');
		}
		throw error;
	}
};

export const assertArtist = async () => {
	try {
		const user = await assertAuthenticated();
		if (!user || !user.role.includes('artist')) {
			throw new AuthorizationError();
		}
		return user;
	} catch (error) {
		if (error instanceof AuthenticationError) {
			redirect('/sign-in');
		}
		if (error instanceof AuthorizationError) {
			redirect('/403');
		}
		throw error;
	}
}

export async function getTokens(): Promise<TokenPair | undefined> {
	const accessToken = cookies().get('accessToken')?.value;
	const refreshToken = cookies().get('refreshToken')?.value;

	if (!accessToken || !refreshToken) {
		return undefined;
	}

	return {
		accessToken,
		refreshToken
	};
}

export async function clearSession() {
	'use server';
	const cookieStore = await cookies();
	cookieStore.delete('accessToken');
	cookieStore.delete('refreshToken');
}
