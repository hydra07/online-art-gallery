import { createAxiosInstance } from "@/lib/axios";
// API service using axios
const artworkService = {
  getArtworks: async ({
    skip = 0,
    take = 10,
    status = "",
    sortBy,
    sortOrder,
  }: {
    skip?: number;
    take?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    const axios = await createAxiosInstance({ useToken: true });
    if (!axios) {
      throw new Error("Failed to create axios instance");
    }
    const params = new URLSearchParams();
    params.append("skip", skip.toString());
    params.append("take", take.toString());
    if (status && status !== "all") {
      params.append("moderationStatus", status);
    }
    // if (sortBy) {
    //   params.append("sortBy", sortBy);
    // }
    // if (sortOrder) {
    //   params.append("sortOrder", sortOrder);
    // }

    const response = await axios.get(`/artwork/admin?${params.toString()}`);
    console.log("Response data:", response.data);
    return response.data;
  },
  reviewArtwork: async ({
    artworkId,
    moderationStatus,
    moderationReason,
  }: {
    artworkId: string;
    moderationStatus: "approved" | "rejected" | "suspended";
    moderationReason?: string;
  }) => {
    const axios = await createAxiosInstance({ useToken: true });
    if (!axios) {
      throw new Error("Failed to create axios instance");
    }
    const response = await axios.post(`/artwork/admin/${artworkId}`, {
      moderationStatus,
      moderationReason,
    });
    return response.data;
  },
};

export default artworkService;