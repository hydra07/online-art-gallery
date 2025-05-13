import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getTokens } from './session';

const apiClient: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 30000, // vercel free tier toi da 30s
	headers: {
		'Content-Type': 'application/json'
	}
});

interface ApiCallOptions {
	url: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	body?: any;
	propToken?: boolean;
	multipart?: boolean;
}

export async function makeApiRequest({
	url,
	method,
	body,
	propToken = false,
	multipart = false
}: ApiCallOptions) {
	try {
		const config: AxiosRequestConfig = {
			method,
			url,
			data: body,
			headers: {}
		};

		// Set Content-Type
		config.headers = {
			'Content-Type': multipart
				? 'multipart/form-data'
				: 'application/json'
		};

		if (propToken) {
			// const user = await getCurrentUser();
			// if (user) {
			//   throw new Error("User not found");
			// }
			const tokens = await getTokens();
			if (!tokens) {
				throw new Error('Tokens not found');
			}
			const { accessToken } = tokens;
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		const response = await apiClient(config);
		return response;
	} catch (error) {
		throw error;
	}
}
