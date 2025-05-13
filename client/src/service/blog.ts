"use server";
import axios, { createApi } from '@/lib/axios';
import { Blog, BlogRequestResponse, GetPublishedBlogsResponse, UserBlogsResponse } from '@/types/blog';
import { ApiResponse } from '@/types/response';
import { BlogStatus } from '@/utils/enums';
import axiosInstance from 'axios';
import { handleApiError } from '@/utils/error-handler';

export async function getBlogById(blogId: string) :Promise<ApiResponse<BlogRequestResponse>> {
	try {
		const res = await createApi().get(`/blog/${blogId}`);
		return res.data;
	} catch (err) {
		console.error(`Error when get blog by id: ${err}`);
		throw handleApiError<BlogRequestResponse>(err, 'Failed to get blog by id', 'get_blog_by_id_error');
	}
}

export async function getLastEditedBlogId(accessToken: string): Promise<ApiResponse<BlogRequestResponse>> {
	try {
		const res = await createApi(accessToken).get('/blog/last-edited');
		return res.data;
	} catch (err) {
		console.error(`Error when get last edited blog id: ${err}`);
		throw handleApiError<BlogRequestResponse>(err, 'Failed to get last edited blog id', 'get_last_edited_blog_id_error');
	}
}

export async function createBlog({
	accessToken,
	blogData
}: {
	accessToken: string;
	blogData: {
		title: string;
		content: string;
		image: string;
	};
}): Promise<ApiResponse<BlogRequestResponse>> {
	try {
		const res = await createApi(accessToken).post(
			'/blog',
			blogData
		);

		return res.data;

	} catch (err) {
		console.error(`Error when creating blog:`, err);
		throw handleApiError<BlogRequestResponse>(
			err,
			'Failed to create blog',
		)
	}
}

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
	};
}): Promise<ApiResponse<BlogRequestResponse>> {
	const payload: {
		title?: string;
		content?: string;
		image?: string;
		status?: BlogStatus;
	} = {};

	if (updateData.title) payload.title = updateData.title;
	if (updateData.content) payload.content = updateData.content;
	if (updateData.image) payload.image = updateData.image;
	if (updateData.status) payload.status = updateData.status;
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

export async function getBlogs(accessToken: string) {
	try {
		const res = await createApi(accessToken).get('/blog');
		return res.data;
	} catch (err) {
		console.error(`Error when get blogs: ${err}`);
		throw handleApiError<BlogRequestResponse>(err, 'Failed to get blogs', 'get_blogs_error');
	}
}

export async function getBlogsByPublished({
	published
}: {
	published: boolean;
}): Promise<Blog[]> {
	const res = await axios.get(`/blog/published/${published}`);
	return res.data;
}


export async function getPublishedBlogs({
	after,
	before,
	first,
	last,
	query
}: {
	after?: string;
	before?: string;
	first?: number;
	last?: number;
	query?: string;
}): Promise<GetPublishedBlogsResponse> {
	try {
		const params = new URLSearchParams();

		if (after) params.set('after', after);
		if (before) params.set('before', before);
		if (first) params.set('first', first.toString());
		if (last) params.set('last', last.toString());
		if (query) params.set('query', query);

		const queryString = params.toString();
		const url = `/blog/published${queryString ? `?${queryString}` : ''}`;
		const res = await createApi().get(url);
		return res.data.data;
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(
				`Error when get published blogs: ${error.response?.data}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
		return {
			edges: [],
			pageInfo: {
				hasNextPage: false,
				endCursor: ''
			},
			total: 0
		};
	}
}


export async function createPublicRequest({
	accessToken,
	id
}: {
	accessToken: string;
	id: string;
}): Promise<ApiResponse<BlogRequestResponse>> {
	try {
		const res = await createApi(accessToken).put(`/blog/${id}/request-publish`);
		return res.data;
	} catch (error) {
		console.error(`Error when create public request:`, error);
		throw handleApiError<BlogRequestResponse>(
			error,
			'Failed to create public request'
		);
	}
}

export async function getUserBlogs(accessToken: string): Promise<ApiResponse<UserBlogsResponse>> {
	try {
		const response = await createApi(accessToken).get('/blog/user-blogs');
		return response.data;
	} catch (error) {
		console.error(`Error when get user blogs:`, error);
		throw handleApiError<UserBlogsResponse>(
			error,
			'Failed to fetch user blogs'
		);
	}
}



//delete blog
export async function deleteBlog(accessToken: string, blogId: string) :Promise<ApiResponse<BlogRequestResponse>> {
	try {
		const res = await createApi(accessToken).delete(`/blog/${blogId}`);
		return res.data;
	} catch (error) {
		console.error(`Error when delete blog:`, error);
		throw handleApiError<BlogRequestResponse>(
			error,
			'Failed to delete blog'
		);
	}
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getBookmarkedPostIds(accessToken: string) {
	try {
		// const res = await createApi(accessToken).get('/blog/bookmarked');
		// return res.data.map((post: { id: string }) => post.id);
		return [];
	} catch (error) {
		console.error(`Error when get bookmarked post ids: ${error}`);
		return [];
	}
}


export async function getBlogInteractions(blogId: string) {
	try {
		const res = await axios.get(`/blog/interactions/${blogId}`);
		return res.data;
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(
				`Error when get blog interactions: ${error.response?.data}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
	}
}

export async function getUserInteractions(accessToken: string, blogId: string) {
	try {
		const res = await createApi(accessToken).get(
			`/interaction/user/blog/${blogId}`
		);
		return {
			...res.data,
			bookmarked: false
		};
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(
				`Error when get user interactions: ${error.response?.data}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
	}
}


export async function toggleHeartBlogService(
	accessToken: string,
	blogId: string
): Promise<boolean> {
	try {
		const res = await createApi(accessToken).put(
			`/blog/toggle-heart/${blogId}`
		);
		if (res.status === 200) {
			return res.data;
		} else {
			return false;
		}
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(
				`Error when toggle heart blog: ${error.response?.data}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
		return false;
	}
}

export async function toggleBookmarkBlogService(
	accessToken: string,
	blogId: string
): Promise<boolean> {
	try {
		const res = await createApi(accessToken).put(
			`/blog/toggle-bookmark/${blogId}`
		);
		if (res.status === 200) {
			return res.data;
		} else {
			return false;
		}
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(
				`Error when toggle bookmark blog: ${error.response?.data}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
		return false;
	}
}


export async function addHeartToBlog(accessToken: string, blogId: string, userId: string) {
    try {
        const res = await axios.put(
            `http://localhost:5000/api/blog/${blogId}/addHeart`,
            { blogId, userId }, // Gửi body theo yêu cầu API
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error(`Error when adding heart: ${error}`);
        return null;
    }
}


export async function removeHeartFromBlog(accessToken: string, blogId: string, userId: string) {
    try {
        const res = await axios.put(
            `http://localhost:5000/api/blog/${blogId}/removeHeart`,
            { blogId, userId }, // Gửi body theo yêu cầu API
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error(`Error when removing heart: ${error}`);
        return null;
    }
}

export async function getHeartCount(blogId: string): Promise<number | undefined> {
    try {
        const res = await axios.get(`/api/blog/${blogId}/heart-count`);
        return res.data.count; 
    } catch (error) {
        console.error(`Error when getting heart count: ${error}`);
        return undefined; 
    }
}


export async function checkIsUserHeartedBlog(
	blogId: string,
	userId: string,
	token: string
  ) {
	try {
	  const res = await axios.get(
		`http://localhost:5000/api/blog/${blogId}/isHeart/${userId}`,
		{
		  headers: {
			Authorization: `Bearer ${token}`,
		  },
		}
	  );
	  return res.data?.hasLiked ?? false;
	} catch (error) {
	  console.error(`Error when checking heart status: ${error}`);
	  return false;
	}
  }
  

export async function getUsersWhoHeartedBlog(blogId: string) {
    try {
        const res = await axios.get(`/blog/${blogId}/heart-users`);
        return res.data;
    } catch (error) {
        console.error(`Error when getting heart users: ${error}`);
    }
}
