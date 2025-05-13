import { createApi } from "@/lib/axios";
import { BlogTagResponse } from "@/types/blog";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";


/**
 * Fetches all blog tags from the API
 * @returns {Promise<BlogTag[]>} Array of blog tags
 */
export async function getTags(): Promise<ApiResponse<BlogTagResponse>> {
  try {
    const res = await createApi().get('/blog-tag');
    return res.data;

  } catch (error) {
    console.error(`Error getting blog tags:`, error);
    throw handleApiError<BlogTagResponse>(
      error,
      'Failed to fetch blog tags'
    );
  }
}