import { ArtworkFormData } from '@/app/(public)/[locale]/artists/schema';
import { createAxiosInstance } from '@/lib/axios';
import BaseResponse from '@/types/response';
const ITEMS_PER_PAGE = 12;
export const artworkService = {
	upload: async (formData: ArtworkFormData): Promise<BaseResponse<any>> => {
		const axios = await createAxiosInstance({ useToken: true });
		if (!axios) throw new Error('Failed to create Axios instance');

		const response = await axios.post('/artwork', {
			title: formData.title,
			description: formData.description,
			category: formData.categories,
			dimensions: {
				width: Number(formData.width),
				height: Number(formData.height)
			},
			url: formData.imageUrl || '', // In real app, this would be from file upload
			lowResUrl: formData.lowResUrl || '', // In real app, this would be from file upload
			watermarkUrl: formData.watermarkUrl || '', // In real app, this would be from file upload
			status: formData.status.toLowerCase(),
			price: Number(formData.price),
			artType: formData.artType,
			isSelling: formData.isSelling
		});

		if (response.status === 201) {
			return response.data;
		} else {
			throw new Error('Network response was not ok');
		}
	},
	getArtist: async (options: any, currentPage: number): Promise<any> => {
		const skip = (currentPage - 1) * ITEMS_PER_PAGE;
		const take = ITEMS_PER_PAGE;

		const params = new URLSearchParams();
		Object.entries(options).forEach(([key, value]) => {
			if (value) {
				params.append(key, String(value));
			}
		});
		params.append('skip', String(skip));
		params.append('take', String(take));
		// console.log(params.toString());
		const axios = await createAxiosInstance({ useToken: true });
		if (!axios) throw new Error('Failed to create Axios instance');

		const response = await axios.get(`/artwork/artist?${params.toString()}`
			// ,{
			// headers: {
			// 	'Cache-Control': 'no-cache'
			// } }
		);
		if (response.status !== 200 && response.status !== 304) {
			throw new Error('Error fetching artworks');
		}

		return response.data;
	},
	get: async (options: any, currentPage: number): Promise<any> => {
		const skip = (currentPage - 1) * ITEMS_PER_PAGE;
		const take = ITEMS_PER_PAGE;

		const params = new URLSearchParams();
		Object.entries(options).forEach(([key, value]) => {
			if (value) {
				params.append(key, String(value));
			}
		});
		params.append('skip', String(skip));
		params.append('take', String(take));
		// console.log(params.toString());
		const axios = await createAxiosInstance({ useToken: false });
		if (!axios) throw new Error('Failed to create Axios instance');

		const response = await axios.get(`/artwork?${params.toString()}`
			// ,{
			// headers: {
			// 	'Cache-Control': 'no-cache'
			// } }
		);
		if (response.status !== 200 && response.status !== 304) {
			throw new Error('Error fetching artworks');
		}

		return response.data;
	},
	update: async (id: string, updatedData: Partial<ArtworkFormData>): Promise<any> => {
		const axios = await createAxiosInstance({ useToken: true });
		if (!axios) throw new Error('Failed to create Axios instance');

		const response = await axios.put(`/artwork/${id}`, {
			title: updatedData.title,
			description: updatedData.description,
			category: updatedData.categories,
			status: updatedData.status?.toLowerCase(),
			price: updatedData.price ? Number(updatedData.price) : undefined,
			artType: updatedData.artType,
		});

		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error('Failed to update artwork');
		}
	},
	delete: async (id: string): Promise<any> => {
		const axios = await createAxiosInstance({ useToken: true });
		if (!axios) throw new Error('Failed to create Axios instance');

		const response = await axios.delete(`/artwork/${id}`);

		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error('Failed to delete artwork');
		}
	},
	async getCategories(): Promise<any> {
		const axios = await createAxiosInstance({ useToken: false });
		if (!axios) throw new Error('Failed to create Axios instance');

		const response = await axios.get('/artwork/categories');

		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error('Failed to get category');
		}

	}


};
