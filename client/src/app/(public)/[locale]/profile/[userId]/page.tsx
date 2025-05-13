'use client';

import { useEffect, useState } from 'react';
import UserProfileContent from "./user-profile-content";
import { AuthDialog } from '@/components/ui.custom/auth-dialog';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function ProfilePage({ params }: { params: { locale: string; userId: string } }) {
  const { userId } = params;
  const { data: user, status } = useSession();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowAuthDialog(true);
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <>
      {user ? (
        <UserProfileContent userId={userId} />
      ) : (
        <AuthDialog 
          isOpen={showAuthDialog} 
          setIsOpen={setShowAuthDialog} 
        />
      )}
    </>
  );
}