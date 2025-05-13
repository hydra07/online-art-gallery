"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Artist } from "@/types/artist";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArtistActions } from "./artist-actions";
import { format } from "date-fns";
import { Star, Users } from "lucide-react";
import { SortableHeader } from "../blogs/column-headers";

export const columns: ColumnDef<Artist>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Artist" fieldName="name" />,
    cell: ({ row }) => {
      const artist = row.original;
      return (
        <div className="flex items-center gap-3 max-w-[200px]">
          <Avatar className="h-8 w-8">
            <AvatarImage src={artist.image} alt={artist.name} />
            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium truncate">{artist.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="w-[200px]">Email</div>,
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground truncate max-w-[200px]">
          {row.getValue("email")}
        </div>
      );
    },
  },
  {
    accessorKey: "followers",
    header: ({ column }) => <SortableHeader column={column} title="Followers" fieldName="followers" />,
    cell: ({ row }) => {
      const followers = row.original.followers;
      return (
        <div className="flex items-center gap-2 justify-center">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{followers.length}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "artistProfile.isFeatured",
    header: () => <div className="text-center">Featured</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.artistProfile?.isFeatured ? (
            <Badge variant="default">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} title="Joined" fieldName="createdAt" />,
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {format(new Date(row.getValue("createdAt")), 'PP')}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <ArtistActions artist={row.original} />
        </div>
      );
    },
  },
];