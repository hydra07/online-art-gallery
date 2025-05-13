import { createAxiosInstance } from '@/lib/axios';

const userService = {
	async getAllUser() {
		try {
			const axios = await createAxiosInstance({ useToken: true });
			if (!axios) {
				throw new Error('Failed to create axios instance');
			}
			const res = await axios.get('/user/all-user');
			return res.data;
		} catch (error) {
			console.error('Error getting all users:', error);
			return null;
		}
	},

	updateToAdmin: async (userId: string) => {
		try {
			const axios = await createAxiosInstance({ useToken: true });
			if (!axios) {
				throw new Error('Failed to create axios instance');
			}
			const response = await axios.patch(`/user/update-to-admin/${userId}`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	removeAdminRole: async (userId: string) => {
		try {
			const axios = await createAxiosInstance({ useToken: true });
			if (!axios) {
				throw new Error('Failed to create axios instance');
			}
			const response = await axios.patch(`/user/remove-admin/${userId}`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};

export default userService;