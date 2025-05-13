import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/app/(public)/[locale]/_header/queries';

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

export default useUserProfile; 