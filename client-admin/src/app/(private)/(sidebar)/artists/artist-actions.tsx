"use client";

import { useState } from "react";
import { Artist } from "@/types/artist";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { setArtistFeaturedAction } from "./action";
import { useToast } from "@/hooks/use-toast";
import { EllipsisVertical, Star, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function ArtistActions({ artist }: { artist: Artist }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const { execute: setFeatured, isPending: isFeaturePending } = useServerAction(
    setArtistFeaturedAction,
    {
      onSuccess() {
        setIsOpen(false);
        toast({
          title: "Artist updated",
          description: "Artist marked as featured",
          variant: "success",
        });
      },
      onError(error) {
        toast({
          title: "Error",
          description: error.err.message || "An error occurred while updating the artist",
          variant: "destructive",
        });
      }
    }
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        <Link href={`/artists/${artist._id}`} passHref>
          <DropdownMenuItem className={cn(btnStyles)}>
            <ExternalLink className={btnIconStyles} />
            View Details
          </DropdownMenuItem>
        </Link>
        
        {!artist.artistProfile?.isFeatured && (
          <DropdownMenuItem
            className={cn(btnStyles)}
            onClick={() => {
              setFeatured({
                artistId: artist._id,
              });
            }}
            disabled={isFeaturePending}
          >
            <Star className={btnIconStyles} />
            Set as Featured
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}