"use server";
import { createApi } from '@/lib/axios';
import { handleApiError } from '@/utils/error-handler';
import axiosInstance from 'axios';

export async function createArtistRequest({
  accessToken,
  cccdData,
}: {
  accessToken: string;
  cccdData: {
    id: string;
    name: string;
    dob: string;
    sex: string;
    nationality: string;
    home: string;
    address: string;
    doe: string;
    issue_date: string;
    issue_loc: string;
    features?: string;
    mrz?: string;
    imageFront?: string;
    imageBack?: string;
  };
}) {
  try {
    const api = createApi(accessToken);
    const res = await api.post('/artist-request', {
      cccd: cccdData
    });
    return res.data;
  } catch (err: any) {
   const errorData = err.response?.data || {
      message: 'Unknown error occurred',
      statusCode: 500,
      errorCode: 'UNKNOWN_ERROR',
    };
    console.error('Artist request error:', errorData);
    
    // Return error object instead of throwing
    return {
      success: false,
      error: errorData
    };
  }
}

// export async function getCCCDById({ accessToken, cccdId }: { accessToken: string; cccdId: string }) {
//   try {
//     const res = await createApi(accessToken).get(`/cccd/${cccdId}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return res.data;
//   } catch (err) {
//     console.error(`Error when fetching CCCD by ID: ${err}`);
//   }
// }

// export async function getCCCDByUserId({ accessToken, userId }: { accessToken: string; userId: string }) {
//   try {
//     const res = await createApi(accessToken).get(`/cccd/user/${userId}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return res.data;
//   } catch (err) {
//     console.error(`Error when fetching CCCD by User ID: ${err}`);
//   }
// }

export async function updateCCCD({
  accessToken,
  cccdId,
  updateData,
}: {
  accessToken: string;
  cccdId: string;
  updateData: Partial<{
    id: string;
    name: string;
    dob: string;
    sex: string;
    nationality: string;
    home: string;
    address: string;
    doe: string;
    issue_date: string;
    issue_loc: string;
    features?: string;
    mrz?: string;
    userId: string;
    imageFront?: string;
    imageBack?: string;
  }>;
}) {
  try {
    const res = await createApi(accessToken).put(`/cccd/${cccdId}`, updateData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 200) {
      return res.data;
    } else {
      console.error(`Failed to update CCCD: ${res.statusText}`);
    }
  } catch (err) {
    console.error(`Error when updating CCCD: ${err}`);
  }
}

export async function deleteCCCD({ accessToken, cccdId }: { accessToken: string; cccdId: string }) {
  try {
    const res = await createApi(accessToken).delete(`/cccd/${cccdId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 200) {
      return true;
    } else {
      console.error(`Failed to delete CCCD: ${res.statusText}`);
      return false;
    }
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when deleting CCCD: ${err.response?.data.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
    return false;
  }
}

// export async function requestBecomeArtist({ accessToken }: { accessToken: string }) {
//   try {
//     const res = await createApi(accessToken).post('user/request-become-artist', {}, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (res.status === 200) {
//       return res.data;
//     } else {
//       console.error(`Failed to request become artist: ${res.statusText}`);
//       return null;
//     }
//   } catch (err) {
//     if (axiosInstance.isAxiosError(err)) {
//       console.error(`Error when requesting become artist: ${err.response?.data?.message || err.message}`);
//     } else {
//       console.error(`Unexpected error: ${err}`);
//     }
//     return null;
//   }
// }

