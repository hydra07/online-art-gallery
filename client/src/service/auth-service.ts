'use strict';
import axios from '@/lib/axios';
import { setCookies } from '@/lib/session';
import axiosInstance from 'axios';

interface Account {
	provider: string;
	providerAccountId?: string;
	tokenId?: string;
}

/*
sample response:
  res {
    isAuthenticated: true,
    message: 'Authentication successful!',
    user: {
      _id: '67432aa6db699749a4e24421',
      provider: 'google',
      providerId: '101033468453537182850',
      name: 'Võ Xuân Thành',
      role: [ 'user' ],
      createdAt: '2024-11-24T13:31:18.214Z',
      updatedAt: '2024-11-24T13:31:18.214Z',
      __v: 0
    }
  }
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function authenticate(user: any, account: Account) {
	const data = {
		provider: account.provider as string,
		providerAccountId: account.providerAccountId as string,
		//
		tokenId: account.tokenId as string,
		phone: user.phone as string,
		password: user.password as string
	};
	try {
		const res = await axios.post('/auth', data);
		if (res.data.isAuthenticated) {
			setCookies({
				accessToken: res.data.result.accessToken,
				refreshToken: res.data.result.refreshToken
			});
		}
		return res.data;
	} catch (err) {
		if (axiosInstance.isAxiosError(err)) {
			console.error(
				`Error when authenticate: ${err.response?.data.message}`
			);
		} else {
			console.error(`Unexpected error: ${err}`);
		}
	}
}

// trả về accessToken và refreshToken
export async function generateToken(userId: string, role: string[]) {
	const data: { userId: string; role: string[] } = { userId, role };
	console.log(data, 'data');
	try {
		const res = await axios.post('/auth/token', data);
		return res.data;
	} catch (err) {
		if (axiosInstance.isAxiosError(err)) {
			console.error(
				`Error when generate token: ${err.response?.data.message}`
			);
		} else {
			console.error(`Unexpected error: ${err}`);
		}
	}
}

export async function refreshAccessToken(refreshToken: string) {
	try {
		const res = await axios.post('/auth/refresh', {
			oldToken: refreshToken
		});
		return res.data;
	} catch (err) {
		if (axiosInstance.isAxiosError(err)) {
			console.error(
				`Error when refresh token: ${err.response?.data.message}`
			);
		} else {
			console.error(`Unexpected error: ${err}`);
		}
	}
}

export async function decode(token: string) {
	try {
		const res = await axios.get(`/auth/decode/${token}`);
		return res.data;
	} catch (err) {
		if (axiosInstance.isAxiosError(err)) {
			console.error(
				`Error when decode token: ${err.response?.data.message}`
			);
		} else {
			console.error(`Unexpected error: ${err}`);
		}
	}
}
