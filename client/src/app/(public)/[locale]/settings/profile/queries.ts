import axios, { createApi } from '@/lib/axios';

export const updateAvatar = async (imageUrl: string, token: string) => {
	if (!token) {
		throw new Error('No authentication token available');
	}

	const response = await createApi(token).put('user/avatar', { avatar: imageUrl }, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	return response.data;
};

export const updateArtwork = async (artworkId: string, image: string) => {
	const { data } = await axios.put(`/api/artworks/${artworkId}/image`, {
		image
	});
	return data;
};

export const updateCollection = async (collectionId: string, image: string) => {
	const { data } = await axios.put(`/api/collections/${collectionId}/image`, {
		image
	});
	return data;
};

export const updateProfile = async (
	data: {
		name?: string;
		address?: string;
		image?: string,
		artistProfile?: {
			bio?: string,
			genre?: string[]
		}
	},
	token?: string
) => {
	if (!token) {
		throw new Error('No authentication token available');
	}

	console.log('Updating profile with data:', data);

	const response = await createApi(token).put('user', data);
	return response.data;
};



