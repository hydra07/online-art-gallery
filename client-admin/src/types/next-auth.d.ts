import { Session as NextAuthSession } from 'next-auth';
declare module 'next-auth' {
	interface User extends User {
		id: string;
		name: string;
		email: string;
		image: string;
		role: string[];
		accessToken: string;
		refreshToken: string;
	}

	interface JWT extends JWT {
		id: string;
		name: string;
		email: string;
		image: string;
		role: string[];
		accessToken: string;
		refreshToken: string;
	}

	interface Session extends NextAuthSession {
		user: {
			id: string;
			name: string;
			email: string;
			image: string;
			role: string[];
			accessToken: string;
			refreshToken: string;
		};
	}
}
