import { createApi } from "@/lib/axios";
import { BlogRequestResponse, GetBlogsResponse } from "@/types/blog";
import { ApiResponse } from "@/types/response";
import { BlogStatus } from "@/utils/enums";
import { handleApiError } from "@/utils/error-handler";
import axiosInstance from 'axios';

export const deleteBlog = async (blogId: string) => {
	// todo: delete blog from database
	// todo: delete blog from cloudinary
	console.log("Deleting blog with ID:", blogId);
};

export const getBlog = async (blogId: string) => {
	// todo: get blog from database
	return {
		_id: blogId,
		title: "Unleash Your Inner Artist: A Journey Through Creativity",
		content: "<p>The hardest part about abstract art is that I never know when to stop. Are there enough colors? Should I add different colors? How are the stokes? I face the same challenge in life and in my career. I always have the urge to do more - I want to add more, be more, love more, learn more. I have an insatiable appetite to grow. If I don’t feel like I’m growing or changing, I can’t stand it. Art has given me the opportunity to constantly learn, experiment and challenge myself. It keeps me balanced by pushing me to grow when I feel stagnant in other areas of my life.</p>",
		image: "https://res.cloudinary.com/dbh0wjh24/image/upload/v1738799600/blog/file_usq6dl.jpg",
		createdAt: new Date(),
		updatedAt: new Date(),
		author: {
			_id: "1",
			name: "xuan thanh",
			image: "https://res.cloudinary.com/dbh0wjh24/image/upload/v1738799600/blog/file_usq6dl.jpg",
		},
		views: 100,
		tags: ["art", "creative", "artists"],
		heartCount: 100,
		published: true,
		status: "pending" as const,
	};
};
export const getBlogs = async ({
	page = 1,
	limit = 10,
	sort = { createdAt: -1 },
	filter = {},
	status = undefined,
	search = ""
}: {
	page?: number;
	limit?: number;
	sort?: Record<string, 1 | -1>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	filter?: Record<string, any>;
	status?: string;
	search?: string;
}): Promise<ApiResponse<GetBlogsResponse>> => {
	try {
		const queryParams = new URLSearchParams();

		if (page) queryParams.append("page", String(page));
		if (limit) queryParams.append("limit", String(limit));

		if (sort) queryParams.set('sort', JSON.stringify(sort));

		if (filter && Object.keys(filter).length > 0) {
			queryParams.set('filter', JSON.stringify(filter));
		}

		if (status) queryParams.append('status', status);

		if (search) queryParams.set('search', search);

		const queryString = queryParams.toString();
		const url = `/blog${queryString ? `?${queryString}` : ''}`;
		const res = await createApi()(url);
		return res.data;
	} catch (error) {
		console.error("Error fetching blogs:", error);
		throw handleApiError(error,
			'Error fetching blogs'
		);
	}
};


export async function updateBlog({
	accessToken,
	updateData
}: {
	accessToken: string;
	updateData: {
		_id: string;
		title?: string;
		content?: string;
		image?: string;
		status?: BlogStatus;
		tags?: string[];
	};
}): Promise<ApiResponse<BlogRequestResponse>> {
	const payload: {
		title?: string;
		content?: string;
		image?: string;
		status?: BlogStatus;
		tags?: string[];
	} = {};

	if (updateData.title) payload.title = updateData.title;
	if (updateData.content) payload.content = updateData.content;
	if (updateData.image) payload.image = updateData.image;
	if (updateData.status) payload.status = updateData.status;
	if (updateData.tags) payload.tags = updateData.tags;
	try {
		const res = await createApi(accessToken).put(
			`/blog/${updateData._id}`,
			payload
		);
		return res.data;
	} catch (error) {
		console.error(`Error when updating blog:`, error);
		throw handleApiError<BlogRequestResponse>(
			error,
			'Failed to update blog',
			'update_blog_error'
		);
	}
}

export async function approveBlog({
	accessToken,
	blogId,
}: {
	accessToken: string;
	blogId: string;
}): Promise<ApiResponse<null>> {
	try {
		const res = await createApi(accessToken).put(`/blog/${blogId}/approve`);
		return res.data;
	} catch (err) {
		if (axiosInstance.isAxiosError(err)) {
			console.error(err);
			console.error(
				`Error when approve blog: ${err.response?.data.errorCode}`
			);
		} else {
			console.error(`Unexpected error: ${err}`);
		}
		throw err;
	}
}


export async function rejectBlog({
	accessToken,
	blogId,
	reason
}: {
	accessToken: string;
	blogId: string;
	reason: string;
}): Promise<ApiResponse<null>> {
	try {

		const res = await createApi(accessToken).put(`/blog/${blogId}/reject`, { reason });
		return res.data;
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(error);
			console.error(
				`Error when rejecting blog: ${error.response?.data.errorCode}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
		throw error;
	}
}