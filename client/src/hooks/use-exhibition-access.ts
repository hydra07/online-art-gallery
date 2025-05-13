import { Exhibition } from "@/types/exhibition";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ExhibitionAccess {
  isOwner: boolean;
  hasTicket: boolean;
  canAccess: boolean;
  isLoading: boolean;
}

export function useExhibitionAccess(exhibition: Exhibition): ExhibitionAccess {
  const { data: session, status } = useSession();

  const [accessState, setAccessState] = useState<ExhibitionAccess>({
    isOwner: false,
    hasTicket: false,
    canAccess: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for free access first
    const isFree = exhibition.ticket?.requiresPayment === false;

    if (isFree) {
      // If it's free, everyone can access
      setAccessState({
        isOwner: status === 'authenticated' && session?.user?.id === exhibition.author._id, // Still determine ownership if logged in
        hasTicket: status === 'authenticated' && (exhibition.ticket?.registeredUsers?.includes(session.user.id) || false), // Still determine ticket status if logged in
        canAccess: true,
        isLoading: false
      });
      return;
    }

    // If not free, proceed with original logic based on authentication
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !session?.user) {
      // Unauthenticated users cannot access non-free exhibitions
      setAccessState({
        isOwner: false,
        hasTicket: false,
        canAccess: false,
        isLoading: false
      });
      return;
    }

    // Authenticated user logic for non-free exhibitions
    const isOwner = exhibition.author._id === session.user.id;
    const hasTicket = exhibition.ticket?.registeredUsers?.includes(session.user.id) || false;
    const canAccess = isOwner || hasTicket;

    setAccessState({
      isOwner,
      hasTicket,
      canAccess,
      isLoading: false
    });
  }, [session, status, exhibition.author._id, exhibition.ticket?.registeredUsers, exhibition.ticket?.requiresPayment]); // Added exhibition.ticket?.requiresPayment to dependencies

  return accessState;
}