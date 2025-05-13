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
import { ExhibitionStatus } from "@/types/exhibition";
import { Column } from "@tanstack/react-table";

// Status options for dropdown filter
export const statusOptions = [
    { value: ExhibitionStatus.PUBLISHED, label: "Published" },
    { value: ExhibitionStatus.PENDING, label: "Pending" },
    { value: ExhibitionStatus.DRAFT, label: "Draft" },
    { value: ExhibitionStatus.PRIVATE, label: "Private" },
    { value: ExhibitionStatus.REJECTED, label: "Rejected" },
];

// SortableHeader component for tables
export function SortableHeader({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    column,
    title,
    fieldName
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column: Column<any, unknown>;
    title: string;
    fieldName: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const currentSortField = searchParams.get('sortField') || 'createdAt';
    const currentSortOrder = searchParams.get('sortOrder') || 'desc';
    
    const isSorted = currentSortField === fieldName;
    const isAsc = isSorted && currentSortOrder === 'asc';
    
    const handleSort = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortField', fieldName);
        params.set('sortOrder', isAsc ? 'desc' : 'asc'); 
        router.push(`${pathname}?${params.toString()}`);
    };
    
    return (
        <Button
            variant="ghost"
            onClick={handleSort}
            className="hover:bg-transparent"
        >
            {title}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

// FilterHeader component for tables
export function FilterHeader({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    column,
    title,
    paramName,
    options
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column: Column<any, unknown>;
    title: string;
    paramName: string;
    options: { value: string; label: string }[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // Get currently selected status values from URL
    const currentValues = searchParams.get(paramName)?.split(',') || [];
    
    const handleStatusChange = (value: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        
        let newValues = [...currentValues];
        if (checked) {
            // Add value if not present
            if (!newValues.includes(value)) {
                newValues.push(value);
            }
        } else {
            // Remove value if present
            newValues = newValues.filter(val => val !== value);
        }
        
        if (newValues.length > 0) {
            params.set(paramName, newValues.join(','));
        } else {
            params.delete(paramName);
        }
        
        router.push(`${pathname}?${params.toString()}`);
    };
    
    return (
        <div className="flex items-center space-x-2">
            <span>{title}</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-8 w-8">
                        <Filter className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {options.map((option) => (
                        <DropdownMenuCheckboxItem
                            key={option.value}
                            checked={currentValues.includes(option.value)}
                            onCheckedChange={(checked) => handleStatusChange(option.value, checked)}
                        >
                            {option.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}