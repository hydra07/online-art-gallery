"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { BlogActions } from "./blog-actions";
import Image from "next/image";
import { Blog } from "@/types/blog";
import EditTags from "./edit-tags";
import { FilterHeader, SortableHeader, statusOptions } from "./column-headers";
import { BlogStatus } from "@/utils/enums";

export const columns: ColumnDef<Blog>[] = [
  {
    accessorKey: "title",
    header: () => <div className="w-[200px]">Title</div>,
    cell: ({ row }) => {
      const title = row.original?.title;
      return (
        <div className="font-medium max-w-[200px] truncate h-[60px] flex items-center" title={title || "Unknown"}>
          {title || "Unknown"}
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "image",
    header: () => <div className="text-center w-[120px]">Thumbnail</div>,
    cell: ({ row }) => {
      const image = row.original?.image || "/placeholder-blog.jpg";
      const title = row.original?.title || "Blog thumbnail";
      
      return (
        <div className="flex justify-center items-center h-[60px] w-[120px]">
          <div className="relative h-[50px] w-[90px] overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <Image
              src={image}
              alt={title}
              fill
              sizes="90px"
              className="object-cover"
            />
          </div>
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "author",
    header: () => <div className="w-[150px]">Author</div>,
    cell: ({ row }) => {
      const author = row.original?.author;
      return <div className="font-medium h-[60px] flex items-center justify-center w-[150px]">{author.name}</div>;
    },
    size: 150,
  },
  {
    accessorKey: "views",
    header: ({ column }) => <div className="w-[100px]"><SortableHeader column={column} title="Views" fieldName="views" /></div>,
    cell: ({ row }) => {
      const views = row.original?.views || 0;
      return <div className="font-medium text-center h-[60px] flex items-center justify-center w-[100px]">{views}</div>;
    },
    size: 100,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <div className="w-[150px]"><SortableHeader column={column} title="Updated At" fieldName="updatedAt" /></div>,
    cell: ({ row }) => {
      const updatedAt = row.original?.updatedAt;
      return <div className="font-medium text-center h-[60px] flex items-center justify-center w-[150px]">
        {updatedAt ? new Date(updatedAt).toLocaleDateString() : "N/A"}
      </div>;
    },
    size: 150,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <div className="w-[150px]"><FilterHeader column={column} title="Status" paramName="status" options={statusOptions} /></div>,
    cell: ({ row }) => {
      const status = row.original?.status || BlogStatus.DRAFT;
      
      // Map status to colors
      const statusStyles = {
        [BlogStatus.PUBLISHED]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        [BlogStatus.PENDING_REVIEW]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        [BlogStatus.DRAFT]: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
        [BlogStatus.REVIEW]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        [BlogStatus.REJECTED]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      };

      return (
        <div className="h-[60px] flex items-center justify-center w-[150px]">
          <Badge
            className={`${statusStyles[status] || statusStyles.DRAFT} font-medium`}
          >
            {status.replace('_', ' ')}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      if (!value.length) return true; // If no filters selected, show all
      const status = row.getValue(id) as string;
      return value.includes(status || BlogStatus.DRAFT);
    },
    size: 150,
  },
  {
    id: "actions",
    header: () => <div className="text-center w-[120px]">Actions</div>,
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <div className="flex justify-center items-center gap-2 h-[60px] w-[120px]">
          <EditTags blogId={blog._id} currentTags={blog.tags} />
          <BlogActions blog={blog} />
        </div>
      );
    },
    size: 120,
  }
];