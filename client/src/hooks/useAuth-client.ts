'use client';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string[];
  accessToken: string;
  refreshToken: string;
} | null;

type AuthResult = {
  user: User;
  status: string;
};


type SessionResponse = {
  user: User;
  expires: string;
};

// export default function useAuthClient() {
//   const { data: session, status, update } = useSession({ required: false });
//   const resultRef = useRef<AuthResult>({ user: null, status: 'loading' });

//   // Memoize the result to prevent unnecessary re-renders
//   const result = useMemo(() => {
//     const newUser = session?.user as User || null;
//     return { user: newUser, status };
//   }, [session?.user, status]);

//   // Update ref for stability
//   useEffect(() => {
//     resultRef.current = result;
//   }, [result]);

//   return resultRef.current;
// }
export default function useAuthClient(): AuthResult {
  const [authResult, setAuthResult] = useState<AuthResult>({ user: null, status: 'loading' });
  const {data: session, status } = useSession({ required: false });
  
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      setAuthResult({
        user: session?.user || null,
        status
      });
    }
    
    // Clean-up function that runs when component unmounts
    return () => {
      isMounted = false;
    };
  }, [session, status]);
  
  return authResult;
}


const fetchSession = async ():Promise<SessionResponse> => {
  const res = await fetch('/api/auth/session', {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch session');
  }
  
  return res.json();
};

export  function useAuth() {
  const resultRef = useRef<AuthResult>({ user: null, status: 'loading' });
  
  // Use TanStack Query to fetch session data
  const { data, error, isLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: fetchSession,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // Memoize the result to prevent unnecessary re-renders
  const result = useMemo(() => {
    let status = 'loading';
    
    if (isLoading) {
      status = 'loading';
    } else if (error || !data) {
      status = 'unauthenticated';
    } else if (data.user) {
      status = 'authenticated';
    } else {
      status = 'unauthenticated';
    }
    
    return { 
      user: data?.user || null, 
      status 
    };
  }, [data, error, isLoading]);
  
  // Update ref for stability - same pattern as original hook
  useEffect(() => {
    resultRef.current = result;
  }, [result]);
  
  return resultRef.current;
}