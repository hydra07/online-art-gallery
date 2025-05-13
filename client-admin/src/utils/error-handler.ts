import { ApiResponse } from '@/types/response';
import { AxiosError, isAxiosError } from 'axios';

interface ErrorResponse {
  errorCode?: string;
  message?: string;
  details?: string;
}

export const handleApiError = <T>(
  error: unknown, 
  defaultMessage: string,
  errorCode = 'unknown_error'
): ApiResponse<T> => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      status: axiosError.response?.status || 500,
      errorCode: axiosError.response?.data?.errorCode || errorCode,
      details: error,
      message: axiosError.response?.data?.message || defaultMessage,
      data: null
    };
  }

  return {
    status: 500,
    errorCode,
    details: error,
    message: defaultMessage,
    data: null
  };
};