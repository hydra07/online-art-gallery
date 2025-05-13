import { createApi, createAxiosInstance } from '@/lib/axios';

export async function fetchUser() {
	const axios = await createAxiosInstance({ useToken: true });
	if (!axios) return null;
	const res = await axios.get('/user');
	return res.data.user;
}

export const getArtistProfile = async (token: string) => {
	try {
		const response = await createApi(token).get('/artist/profile');

		if (response.status !== 200) {
			throw new Error('Failed to fetch artist profile');
		}

		return response.data;
	} catch (error) {
		console.error('Error fetching artist profile:', error);
		throw error;
	}
};
