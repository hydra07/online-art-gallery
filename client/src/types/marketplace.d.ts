export type Artwork = {
	_id: string;
	title: string;
	description: string;
	artistId?: {
		_id: string;
		name: string;
		image: string;
	};
	category: string[];
	dimensions: {
		width: number;
		height: number;
		_id: string;
	};
	url: string;
	status: string;
	moderationStatus?: string;
	views: number;
	price: number;
	createdAt: string;
	updatedAt: string;
	__v?: number;
	artType: string;
};