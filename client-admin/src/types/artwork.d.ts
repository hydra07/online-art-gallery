export interface Artist {
	_id: string;
	name: string;
	image: string;
}

export interface Dimensions {
	width: number;
	height: number;
	_id: string;
}

export interface AIReview {
	keywords: string[];
	suggestedCategories: string[];
	description: string;
	metadata: {
		style: string;
		subject: string;
		colors: string[];
		mood: string;
		technique: string;
	};
}

export interface Artwork {
	_id: string;
	title: string;
	description: string;
	category: string[];
	dimensions: Dimensions;
	url: string;
	status: string;
	price: number;
	artistId: Artist;
	moderationStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
	moderationReason?: string;
	moderatedBy?: string | null;
	aiReview?: AIReview;
	views: number;
	buyers: string[]; // Array of buyer IDs
	createdAt: string;
	updatedAt: string;
	__v?: number; // Version key from MongoDB
	_optimistic?: boolean; // For UI optimistic updates
}
