import { createEnv } from '@t3-oss/env-nextjs';
import { config } from 'dotenv';
import { z } from 'zod';
config();
const env = createEnv({
	client: {
		NEXT_PUBLIC_API_URL: z
			.string()
			.url()
			.default('http://localhost:5000/api'),
		NEXT_PUBLIC_SOCKET_URL: z.string().default('ws://localhost:5000')
	},
	server: {
		NODE_ENV: z.string().default('development'),
		NEXTAUTH_SECRET: z.string().default('secret'),
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string()
	},
	runtimeEnv: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET,
		NODE_ENV: process.env.NODE_ENV,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
	}
});

export default env;
