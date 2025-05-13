"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArtistRequest, ArtistRequestStatus } from "@/types/artist-request";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArtistRequestActions } from "./artist-request-actions";

export const columns: ColumnDef<ArtistRequest>[] = [
  {
    accessorKey: "userId",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.userId;
      return (
        <div className="flex items-center justify-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "cccd",
    header: "ID Card",
    cell: ({ row }) => {
      const cccd = row.original.cccd;
      if (!cccd) return null;
      return (
        <div className="space-y-2">
          <p className="text-muted-foreground">{cccd.id}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === ArtistRequestStatus.APPROVED
              ? "default"
              : status === ArtistRequestStatus.REJECTED
                ? "destructive"
                : "default"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reviewedBy",
    header: "Reviewed By",
    cell: ({ row }) => row.original.reviewedBy?.name || "-",
  },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPp"),
  },
  {
    id: "actions",
    cell: ({ row }) => <ArtistRequestActions request={row.original} />,
  },
];