import { createApi } from "@/lib/axios";
import { ExhibitionRequestResponse, GetExhibitionsResponse } from "@/types/exhibition";
import { ApiResponse } from "@/types/response";
import { ExhibitionStatus } from "@/types/exhibition";
import { handleApiError } from "@/utils/error-handler";
import axiosInstance from 'axios';
import { getCurrentUser } from "@/lib/session";

export const deleteExhibition = async (exhibitionId: string) => {
  try {
    const api = createApi();
    await api.delete(`/exhibition/${exhibitionId}`);
    return true;
  } catch (error) {
    console.error("Error deleting exhibition:", error);
    throw new Error("Failed to delete exhibition");
  }
};

export const getExhibition = async (exhibitionId: string): Promise<ApiResponse<ExhibitionRequestResponse>> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Authorization error");
    }
    const response = await createApi(user.accessToken).get(`/exhibition/${exhibitionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching exhibition:", error);
    throw handleApiError(error, 'Failed to fetch exhibition details');
  }
};

export const getExhibitions = async ({
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
}): Promise<ApiResponse<GetExhibitionsResponse>> => {
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
    const url = `/exhibition${queryString ? `?${queryString}` : ''}`;

    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Authorization error");
    }
    const res = await createApi(user.accessToken).get(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching exhibitions:", error);
    throw handleApiError(error, 'Error fetching exhibitions');
  }
};

export async function updateExhibition({
  accessToken,
  updateData
}: {
  accessToken: string;
  updateData: {
    _id: string;
    startDate?: string;
    endDate?: string;
    welcomeImage?: string;
    backgroundMedia?: string;
    backgroundAudio?: string;
    contents?: Array<{ languageCode: string, name: string, description: string }>;
    status?: ExhibitionStatus;
    isFeatured?: boolean;
  };
}): Promise<ApiResponse<ExhibitionRequestResponse>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = {};

  if (updateData.startDate) payload.startDate = updateData.startDate;
  if (updateData.endDate) payload.endDate = updateData.endDate;
  if (updateData.welcomeImage) payload.welcomeImage = updateData.welcomeImage;
  if (updateData.backgroundMedia) payload.backgroundMedia = updateData.backgroundMedia;
  if (updateData.backgroundAudio) payload.backgroundAudio = updateData.backgroundAudio;
  if (updateData.contents) payload.contents = updateData.contents;
  if (updateData.status) payload.status = updateData.status;
  if (updateData.isFeatured !== undefined) payload.isFeatured = updateData.isFeatured;

  try {
    const res = await createApi(accessToken).patch(
      `/exhibition/${updateData._id}`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error(`Error when updating exhibition:`, error);
    throw handleApiError<ExhibitionRequestResponse>(
      error,
      'Failed to update exhibition',
      'update_exhibition_error'
    );
  }
}

export async function approveExhibition({
  accessToken,
  exhibitionId,
}: {
  accessToken: string;
  exhibitionId: string;
}): Promise<ApiResponse<null>> {
  try {
    const res = await createApi(accessToken).patch(`/exhibition/${exhibitionId}/approve`);
    return res.data;
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(err);
      console.error(
        `Error when approving exhibition: ${err.response?.data.errorCode}`
      );
    } else {
      console.error(`Unexpected error: ${err}`);
    }
    throw err;
  }
}

export async function rejectExhibition({
  accessToken,
  exhibitionId,
  reason
}: {
  accessToken: string;
  exhibitionId: string;
  reason: string;
}): Promise<ApiResponse<null>> {
  try {
    const res = await createApi(accessToken).patch(`/exhibition/${exhibitionId}/reject`, { reason });
    return res.data;
  } catch (error) {
    if (axiosInstance.isAxiosError(error)) {
      console.error(error);
      console.error(
        `Error when rejecting exhibition: ${error.response?.data.errorCode}`
      );
    } else {
      console.error(`Unexpected error: ${error}`);
    }
    throw error;
  }
}