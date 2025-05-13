"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Filter } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlogStatus } from "@/utils/enums";
import { Column } from "@tanstack/react-table";
import { ExhibitionStatus } from "@/types/exhibition";

// Status options for dropdown filter
export const statusOptions = [
    { value: BlogStatus.PUBLISHED, label: "Published" },
    { value: BlogStatus.PENDING_REVIEW, label: "Pending" },
    { value: BlogStatus.DRAFT, label: "Draft" },
    { value: BlogStatus.REVIEW, label: "Review" },
    { value: BlogStatus.REJECTED, label: "Rejected" },
];

export const exhibitionStatusOptions = [
    { value: ExhibitionStatus.PUBLISHED, label: "Published" },
    { value: ExhibitionStatus.PENDING, label: "Pending" },
    { value: ExhibitionStatus.DRAFT, label: "Draft" },
    { value: ExhibitionStatus.PRIVATE, label: "Private" },
    { value: ExhibitionStatus.REJECTED, label: "Rejected" },
];
// SortableHeader - handles sort logic with proper hook usage
export function SortableHeader({
    column,
    title,
    fieldName
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column: Column<any, unknown>;
    title: string;
    fieldName: string;
}) {
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isSorted = column.getIsSorted();

    const handleSort = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Check if we're already sorting by this field
        const currentSortField = searchParams.get('sortField');
        const currentSortOrder = searchParams.get('sortOrder');
        
        // Clear sort logic
        if (currentSortField === fieldName && currentSortOrder === 'desc') {
            // If already sorted desc, remove sorting
            params.delete('sortField');
            params.delete('sortOrder');
        } else if (currentSortField === fieldName && currentSortOrder === 'asc') {
            // If already sorted asc, change to desc
            params.set('sortOrder', 'desc');
        } else {
            // If not sorted or sorted by different column, set to asc
            params.set('sortField', fieldName);
            params.set('sortOrder', 'asc');
        }

        // Reset to page 1 when sorting changes
        params.set('page', '1');

        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <Button
            variant="ghost"
            onClick={handleSort}
            className={fieldName === 'title' ? "p-0 hover:bg-transparent" : "w-full font-semibold text-center"}
        >
            {title}
            {isSorted === 'asc' && <ArrowUpDown className="ml-2 h-4 w-4 transform rotate-180" />}
            {isSorted === 'desc' && <ArrowUpDown className="ml-2 h-4 w-4" />}
            {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
        </Button>
    );
}

export function FilterHeader<T extends string>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    column,
    title,
    paramName,
    options,
    icon = <Filter className="ml-2 h-4 w-4" />
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column: Column<any, unknown>;
    title: string;
    paramName: string;
    options: Array<{ value: T, label: string }>;
    icon?: React.ReactNode;
}) {
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleFilter = (value: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentValues = params.get(paramName) || '';
        const valuesArray = currentValues ? currentValues.split(',') : [];
        
        if (checked) {
            // Add the value if it doesn't exist
            if (!valuesArray.includes(value)) {
                valuesArray.push(value);
            }
        } else {
            // Remove the value if it exists
            const index = valuesArray.indexOf(value);
            if (index !== -1) {
                valuesArray.splice(index, 1);
            }
        }
        
        // Join values with comma and set param (or remove if empty)
        if (valuesArray.length > 0) {
            params.set(paramName, valuesArray.join(','));
        } else {
            params.delete(paramName);
        }

        params.set('page', '1');

        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-full flex justify-center">
                    {title}
                    {icon}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {options.map((option) => (
                    <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={searchParams.get(paramName)?.split(',').includes(option.value) || false}
                        onCheckedChange={(checked) => {
                            handleFilter(option.value, checked);
                        }}
                    >
                        {option.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}