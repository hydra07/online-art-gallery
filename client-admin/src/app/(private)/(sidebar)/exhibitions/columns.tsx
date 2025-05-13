"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Exhibition, ExhibitionStatus } from "@/types/exhibition";
import { ExhibitionActions } from "./exhibition-actions";
import { FilterHeader, SortableHeader, exhibitionStatusOptions } from "../blogs/column-headers";

export const columns: ColumnDef<Exhibition>[] = [
    {
        accessorKey: "contents",
        header: () => <div className="w-[200px]">Name</div>,
        cell: ({ row }) => {
            const contents = row.original?.contents || [];
            const defaultContent = contents.find(c => c.languageCode === "en") || contents[0];
            const name = defaultContent?.name || "Untitled Exhibition";

            return (
                <div className="font-medium max-w-[200px] truncate h-[60px] flex items-center" title={name}>
                    {name}
                </div>
            );
        },
        size: 200,
    },
    {
        accessorKey: "welcomeImage",
        header: () => <div className="text-center w-[120px]">Image</div>,
        cell: ({ row }) => {
            const image = row.original?.welcomeImage || "/modern_c1_plan.png";
            const name = row.original?.contents?.[0]?.name || "Exhibition thumbnail";

            return (
                <div className="flex justify-center items-center h-[60px] w-[120px]">
                    <div className="relative h-[50px] w-[90px] overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                        <Image
                            src={image}
                            alt={name}
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
        header: () => <div className="w-[150px]">Creator</div>,
        cell: ({ row }) => {
            const author = row.original?.author;
            return <div className="font-medium h-[60px] flex items-center justify-center w-[150px]">{author?.name || "Unknown"}</div>;
        },
        size: 150,
    },
    {
        accessorKey: "startDate",
        header: ({ column }) => <div className="w-[150px]"><SortableHeader column={column} title="Start Date" fieldName="startDate" /></div>,
        cell: ({ row }) => {
            const startDate = row.original?.startDate;
            return <div className="font-medium text-center h-[60px] flex items-center justify-center w-[150px]">
                {startDate ? new Date(startDate).toLocaleDateString() : "N/A"}
            </div>;
        },
        size: 150,
    },
    {
        accessorKey: "endDate",
        header: ({ column }) => <div className="w-[150px]"><SortableHeader column={column} title="End Date" fieldName="endDate" /></div>,
        cell: ({ row }) => {
            const endDate = row.original?.endDate;
            return <div className="font-medium text-center h-[60px] flex items-center justify-center w-[150px]">
                {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
            </div>;
        },
        size: 150,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <div className="w-[150px]"><FilterHeader column={column} title="Status" paramName="status" options={exhibitionStatusOptions} /></div>,
        cell: ({ row }) => {
            const status = row.original?.status || ExhibitionStatus.DRAFT;

            // Map status to colors
            const statusStyles = {
                [ExhibitionStatus.PUBLISHED]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
                [ExhibitionStatus.PENDING]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
                [ExhibitionStatus.DRAFT]: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
                [ExhibitionStatus.PRIVATE]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
                [ExhibitionStatus.REJECTED]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
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
            return value.includes(status || ExhibitionStatus.DRAFT);
        },
        size: 150,
    },
    {
        accessorKey: "result.visits",
        header: ({ column }) => <div className="w-[100px]"><SortableHeader column={column} title="Visits" fieldName="result.visits" /></div>,
        cell: ({ row }) => {
            const visits = row.original?.result?.visits || 0;
            return <div className="font-medium text-center h-[60px] flex items-center justify-center w-[100px]">{visits}</div>;
        },
        size: 100,
    },
    {
        id: "actions",
        header: () => <div className="text-center w-[120px]">Actions</div>,
        cell: ({ row }) => {
            const exhibition = row.original;
            return (
                <div className="flex justify-center items-center gap-2 h-[60px] w-[120px]">
                    <ExhibitionActions exhibition={exhibition} />
                </div>
            );
        },
        size: 120,
    }
];