import { createApi } from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
import { GetArtistRequestsResponse } from "@/types/artist-request";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";
import axiosInstance from 'axios';

export async function getArtistRequests({
  page = 1,
  limit = 10,
  sort = { createdAt: -1 },
  status,
  search
}: {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  status?: string;
  search?: string;
}): Promise<ApiResponse<GetArtistRequestsResponse>> {
  try {
    const queryParams = new URLSearchParams();

    if (page) queryParams.append("page", String(page));
    if (limit) queryParams.append("limit", String(limit));
    if (sort) queryParams.set('sort', JSON.stringify(sort));
    if (status) queryParams.append('status', status);
    if (search) queryParams.set('search', search);

    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Authorization error");
    }

    const url = `/artist-request${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const res = await createApi(user.accessToken)(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching artist requests:", error);
    throw handleApiError(error, 'Error fetching artist requests');
  }
}

export async function approveArtistRequest({
  accessToken,
  requestId,
}: {
  accessToken: string;
  requestId: string;
}): Promise<ApiResponse<null>> {
  try {
    const res = await createApi(accessToken).patch(`/artist-request/${requestId}/status`, {
      status: "approved",
    });
    return res.data;
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when approving artist request: ${err.response?.data.errorCode}`);
    }
    throw handleApiError(err, 'Error approving artist request');
  }
}

export async function rejectArtistRequest({
  accessToken,
  requestId,
  rejectionReason
}: {
  accessToken: string;
  requestId: string;
  rejectionReason: string;
}): Promise<ApiResponse<null>> {
  try {
    const res = await createApi(accessToken).patch(`/artist-request/${requestId}/status`, { rejectionReason, 
      status: "rejected",
     });
    return res.data;
  } catch (error) {
    if (axiosInstance.isAxiosError(error)) {
      console.error(`Error when rejecting artist request: ${error.response?.data.errorCode}`);
    }
    throw handleApiError(error, 'Error rejecting artist request');
  }
}

export async function deleteArtistRequest(
  requestId: string
): Promise<ApiResponse<null>> {
  try {
    const res = await createApi().delete(`/artist-request/${requestId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting artist request:", error);
    throw handleApiError(error, 'Error deleting artist request');
  }
}