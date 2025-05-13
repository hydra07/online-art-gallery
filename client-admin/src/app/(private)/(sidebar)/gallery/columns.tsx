"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Gallery } from "@/types/gallery";
import { GalleryActions } from "./gallery-actions";

export const columns: ColumnDef<Gallery>[] = [
  {
    accessorKey: "preview",
    header: () => <div className="text-center w-[100px]">Preview</div>,
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div className="flex justify-center items-center h-[60px] w-[100px]">
          <div className="relative h-[50px] w-[50px] rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
            {template.previewImage ? (
              <Image
                src={template.previewImage}
                alt={template.name}
                fill
                sizes="50px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-xs">No preview</p>
              </div>
            )}
          </div>
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left w-[180px]">Name</div>,
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div className="text-left h-[60px] flex items-center w-[180px]">
          <p className="font-medium truncate" title={template.name}>
            {template.name}
          </p>
        </div>
      );
    },
    size: 180,
  },
  {
    accessorKey: "description",
    header: () => <div className="text-left w-[250px]">Description</div>,
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div className="h-[60px] flex items-center w-[250px]">
          <p className="text-sm text-muted-foreground line-clamp-2 text-left" title={template.description}>
            {template.description}
          </p>
        </div>
      );
    },
    size: 250,
  },
  {
    accessorKey: "dimensions",
    header: () => <div className="text-center w-[120px]">Dimensions</div>,
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div className="text-center h-[60px] flex items-center justify-center w-[120px]">
          <Badge variant="secondary">
            {template.dimensions.xAxis}x{template.dimensions.zAxis}m
          </Badge>
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "wallHeight",
    header: () => <div className="text-center w-[100px]">Height</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center h-[60px] flex items-center justify-center w-[100px]">
          {row.original.wallHeight}m
        </div>
      );
    },
    size: 100,
  },
  {
    id: "actions",
    header: () => <div className="text-center w-[100px]">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center gap-2 h-[60px] w-[100px]">
          <GalleryActions gallery={row.original} />
        </div>
      );
    },
    size: 100,
  },
];