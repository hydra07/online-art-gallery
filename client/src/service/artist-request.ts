import { createApi } from "@/lib/axios";
import axiosInstance from "axios";
import { getCurrentUser } from "@/lib/session";

export type CccdDataType = {
  id: "",
  name: "",
  dob: "",
  sex: "",
  nationality: "",
  home: "",
  address: "",
  doe: "",
  issue_date: "",
  issue_loc: "",
  features: "",
  mrz: "",
  imageFront: "",
  imageBack: "",
}

export async function getArtistRequest(accessToken: string) {
  try {
    // const user = await getCurrentUser();
    // if (!user) {
    //   throw new Error("User not found");
    // }
    const res = await createApi(accessToken).get(`/artist-request/my-request`);
    return res.data;
  } catch (err) {
    console.error(`Error when fetching Artist Request by User ID: ${err}`);
  }
}


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
    user: string;
    imageFront?: string;
    imageBack?: string;
  };
}) {
  try {
    // const res = await createApi(accessToken).post('/cccd', cccdData);
    //refacter to create  become artist request
    const res = await createApi(accessToken).post('/artist-request', {
      cccd: cccdData
    });
    if (res.status === 201) {
      return res.data;
    } else {
      console.error(`Failed to create CCCD: ${res.statusText}`);
    }
  } catch (err) {
    if (axiosInstance.isAxiosError(err)) {
      console.error(`Error when creating CCCD: ${err.response?.data?.message || err.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
  }
}
