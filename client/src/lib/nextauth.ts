import { isTokenExpired } from '@/lib/utils';
import env from '@/lib/validateEnv';
import { authenticate, refreshAccessToken } from '@/service/auth-service';
import { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
const authOptions: AuthOptions = {
	providers: [
		Credentials({
			id: 'phone',
			name: 'Phone',
			credentials: {
				phone: { label: 'Phone', type: 'text' },
				password: {
					label: 'Password',
					type: 'password'
				}
			},
			authorize: async (credentials) => {
				try {
					if (!credentials?.phone || !credentials?.password) {
						return null;
					}

					const { phone, password } = credentials as {
						phone: string;
						password: string;
					};

					const result = await authenticate(
						{ phone, password },
						{ provider: 'phone' }
					);

					if (!result.isAuthenticated) {
						return null;
					}

					return {
						id: result.result.id,
						role: result.result.role,
						accessToken: result.result.accessToken,
						refreshToken: result.result.refreshToken,
						name: result.result.name,
						email: result.result.email,
						image: result.result.image
					};
				} catch (error) {
					console.error('Authentication error:', error);
					return null;
				}
			}
		}),
		Google({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					// prompt: "consent", //màn hình xác nhận của google
					access_type: 'offline',
					response_type: 'code'
				}
			}
		})
	],
	secret: env.NEXTAUTH_SECRET,
	session: {
		maxAge: 2 * 24 * 60 * 60, // 2 days
		strategy: 'jwt'
	},
	callbacks: {
		async signIn({ user, account }) {
			if (!account) return false;

			let result = null;
			if (account.provider === 'phone') {
				result = await authenticate(user, {
					...account
				});
			} else if (account.provider === 'google') {
				result = await authenticate(user, {
					...account,
					tokenId: account.id_token
				});
			}
			if (result?.result) {
				user.id = result.result.id;
				user.role = result.result.role;
				user.accessToken = result.result.accessToken;
				user.refreshToken = result.result.refreshToken;
				// setCookies({
				//   accessToken: result.result.accessToken,
				//   refreshToken: result.result.refreshToken,
				// });
			}
			return result?.isAuthenticated;
		},
		async jwt({ token, user, account }) {
			if (account) {
				return {
					...token,
					id: user.id,
					role: user.role,
					accessToken: user.accessToken,
					refreshToken: user.refreshToken
				};
			} else {
				if (isTokenExpired(token.accessToken as string)) {
					const newToken = await refreshAccessToken(
						token.refreshToken as string
					);
					token.accessToken = newToken.accessToken;
					token.refreshToken = newToken.refreshToken;
				}
				return token;
			}
		},
		async session({ session, token }) {
			session.user.id = token.id as string;
			session.user.role = token.role as string[];
			session.user.accessToken = token.accessToken as string;
			session.user.refreshToken = token.refreshToken as string;
			return session;
		}
	},
	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signout'
	}
};

export default authOptions;
