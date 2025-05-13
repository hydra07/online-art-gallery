import { BlogStatus } from '@/utils/enums';
import { z } from 'zod';
import { Pagination } from './response';

export const blogSchema = z.object({
	_id: z.string(),
	title: z.string(),
	content: z.string(),
	image: z.string(),
	status: z.nativeEnum(BlogStatus),
	createdAt: z.date(),
	updatedAt: z.date(),
	heartCount: z.number(),
	isBookmarked: z.boolean(),
	author: z.object({
		_id: z.string(),
		name: z.string(),
		image: z.string(),
	})
});
export type Blog = z.infer<typeof blogSchema>;
export type PageInfo = {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string;
	endCursor: string;
};
export type BlogEdge = {
	node: Blog & {
		author: {
			_id: string;
			name: string;
			image: string;
		};
	};
	cursor: string;
};

export type GetPublishedBlogsResponse = {
	edges: BlogEdge[];
	total: number;
	pageInfo: {
		hasNextPage: boolean;
		endCursor: string;
	};
};

export type UserBlogsResponse = {
    blogs: Blog[];
    pagination: Pagination;
}

//CRUD
export type BlogRequestResponse = {
	blog: Blog | null;
};