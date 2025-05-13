import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Artwork } from "@/types/artwork";
import { 
  ArrowUpDown,
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  FileText,
  Image as ImageIcon,
  MoreHorizontal,
  PauseCircle,
  Tag,
  User 
} from "lucide-react";
import Image from "next/image";
import { formatShortDate, formatFullDate } from "@/utils/date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { vietnamCurrency } from "@/utils";

export type ArtworkTableHandlers = {
  handleViewDetails: (artwork: Artwork) => void;
  handleOpenModerationDialog: (artwork: Artwork) => void;
  paginationState: {
    pageIndex: number;
    pageSize: number;
  };
};

export const getArtworkColumns = ({
  handleViewDetails,
  handleOpenModerationDialog,
  paginationState,
}: ArtworkTableHandlers): ColumnDef<Artwork>[] => [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => (
      <div className="text-center">
        {paginationState.pageIndex * paginationState.pageSize + row.index + 1}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "preview",
    header: () => (
      <span className="flex items-center">
        <ImageIcon className="mr-1 h-4 w-4 text-primary" />
        Image
      </span>
    ),
    cell: ({ row }) => {
      const artwork = row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-10 w-10 relative rounded overflow-hidden ring-1 ring-border cursor-pointer transition-all hover:ring-2 hover:ring-primary/70">
                {artwork.url ? (
                  <Image
                    src={artwork.url}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-10 w-10 bg-muted flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              <div className="w-48 h-48 relative rounded-md overflow-hidden">
                {artwork.url ? (
                  <Image
                    src={artwork.url}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                    sizes="192px"
                    priority={false}
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-accent p-0 h-auto font-medium"
      >
        <FileText className="mr-1 h-4 w-4 text-primary" />
        <span className="font-medium">Title</span>
        <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-medium truncate max-w-[180px]" title={row.original.title}>
              {row.original.title}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-sm">
            {row.original.title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "artistId.name",
    header: () => (
      <span className="flex items-center">
        <User className="mr-1 h-4 w-4 text-primary" />
        Artist
      </span>
    ),
    cell: ({ row }) => {
      const artist = row.original.artistId;
      return (
        <div className="truncate max-w-[120px]" title={artist?.name}>
          {artist?.name || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="flex items-center">
        <Tag className="mr-1 h-4 w-4 text-primary" />
        Status
      </span>
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-secondary text-secondary-foreground"
      >
        {row.original.status}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "moderationStatus",
    header: () => (
      <span className="flex items-center">
        <CheckCircle className="mr-1 h-4 w-4 text-primary" />
        Moderation
      </span>
    ),
    cell: ({ row }) => {
      const status = row.original.moderationStatus;
      return (
        <div className="flex items-center">
          {status === "pending" ? (
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              Pending
            </Badge>
          ) : status === "approved" ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
              Approved
            </Badge>
          ) : status === "rejected" ? (
            <Badge variant="outline" className="bg-rose-50 text-rose-700">
              Rejected
            </Badge>
          ) : status === "suspended" ? (
            <Badge variant="outline" className="bg-slate-50 text-slate-700">
              Suspended
            </Badge>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "moderatedBy",
    header: () => (
      <span className="flex items-center">
        <User className="mr-1 h-4 w-4 text-primary" />
        Moderator
      </span>
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[120px]">
        {row.original.moderatedBy || "-"}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-accent p-0 h-auto font-medium"
      >
        <DollarSign className="mr-1 h-4 w-4 text-primary" />
        <span className="font-medium">Price</span>
        <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {vietnamCurrency(row.original.price)}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-accent p-0 h-auto font-medium"
      >
        <Calendar className="mr-1 h-4 w-4 text-primary" />
        <span className="font-medium">Uploaded</span>
        <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-muted-foreground text-sm cursor-help">
              {formatShortDate(row.original.createdAt)}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            {formatFullDate(row.original.createdAt)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    sortingFn: "datetime",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const artwork = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleViewDetails(artwork)}
                className="cursor-pointer flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" /> View details
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              
              {/* Show different moderation options based on current status */}
              {artwork.moderationStatus === "pending" && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Moderation</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => handleOpenModerationDialog(artwork)}
                    className="cursor-pointer text-amber-600 flex items-center"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve / Reject
                  </DropdownMenuItem>
                </>
              )}

              {artwork.moderationStatus === "approved" && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Moderation</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => handleOpenModerationDialog(artwork)}
                    className="cursor-pointer text-slate-600 flex items-center"
                  >
                    <PauseCircle className="mr-2 h-4 w-4" />
                    Suspend artwork
                  </DropdownMenuItem>
                </>
              )}

              {(artwork.moderationStatus === "rejected" || artwork.moderationStatus === "suspended") && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Moderation</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => handleOpenModerationDialog(artwork)}
                    className="cursor-pointer text-emerald-600 flex items-center"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve artwork
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];