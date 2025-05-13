import axios, { AxiosError, AxiosInstance } from 'axios';
import env from '@/lib/validateEnv';
import { getSession } from 'next-auth/react';
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
export default axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-type': 'application/json'
		// "Authorization": `Bearer ${token}`
	}
});

export function axiosWithAuth(token: string) {
	return axios.create({
		baseURL: env.NEXT_PUBLIC_API_URL,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
}

export const createApi = (token?: string): AxiosInstance => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	return axios.create({
		baseURL: BASE_API_URL,
		headers
	});
};

interface AxiosInstanceOptions {
	useToken?: boolean;
	onError?: (error: AxiosError | Error) => void;
}

/**
 * Hàm fetching sử dụng ở client side, tự động thêm token vào header nếu cần
 * @param useToken - Sử dụng token hay không
 * @param onError - Xử lý lỗi
 * @returns AxiosInstance | null, nếu trả về null thì có vấn đề với phần token
 *
 */
export async function createAxiosInstance({
  useToken = false,
  onError
}: AxiosInstanceOptions): Promise<AxiosInstance> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (useToken) {
    const session = await getSession();
    const accessToken = session?.user.accessToken;
    
    if (!accessToken) {
      const error = new Error('Access token is missing from the session.');
      console.error(error.message);
      if (onError) onError(error);
      throw error;
    }
    
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const instance = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    headers
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.message);
      } else {
        console.error('Unexpected Error:', error);
      }
      
      if (onError) onError(error as Error);
      return Promise.reject(error);
    }
  );

  return instance;
}
