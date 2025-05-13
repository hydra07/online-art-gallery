// src/app/(exhibitions)/[locale]/exhibitions/components/like-artwork-button.tsx
'use client';

import { useServerAction } from "zsa-react";
// Adjust path if necessary
import { likeArtworkAction } from "../[linkname]/actions";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import { AuthDialog } from "@/components/ui.custom/auth-dialog";
import { useState, useEffect } from "react";
import { OverlayButton } from "./overlay-button";
import { Session } from "next-auth";
import React from 'react'; // Import React

type User = Session['user'];

interface LikeArtworkButtonProps {
  exhibitionId: string;
  artworkId: string;
  likes: {
    userIds: string[];
    count: number;
  };
  user: User | undefined | null;
  className?: string;
}

export function LikeArtworkButton({
  exhibitionId,
  artworkId,
  likes,
  user,
  className
}: LikeArtworkButtonProps) {
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(
    user ? likes.userIds.includes(user.id) : false
  );

  const { execute: toggleLike, isPending } = useServerAction(likeArtworkAction, {
    onSuccess: (result) => {
      setIsLiked(result.data.liked);
    },
    onError: (error) => {
      setIsLiked(!isLiked); // Revert optimistic update
      toast({
        title: 'error',
        description: error.err.message || 'Like action failed',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    setIsLiked(!!user?.id && likes.userIds.includes(user.id));
  }, [user, likes.userIds]);

  const handleLike = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setIsLiked(!isLiked);
    toggleLike({ exhibitionId, artworkId });
  };

  // This stops the click on the button itself from bubbling up
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault(); 
    handleLike();
  };

  return (
    <>
      <OverlayButton
        onClick={handleClick} // Uses the wrapper with stopPropagation
        disabled={isPending}
        className={className}
        aria-label={isLiked ? 'unlike_artwork' : 'like_artwork'}
      >
        <Heart
          className={`w-6 h-6 transition-colors duration-200 ${
            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
          } ${isPending ? 'opacity-50' : ''}`}
        />
        {/* Consider showing likes.count here */}
      </OverlayButton>

      <AuthDialog
        isOpen={showAuthDialog}
        setIsOpen={setShowAuthDialog}
      />
    </>
  );
}