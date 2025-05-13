"use client"

import { Button } from "@/components/ui/button"
import { btnStyles } from "@/styles/icons";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function CreateExhibitionButton() {
    return (
        <>
            <Link href="/exhibitions/create">
                <Button
                    className={cn(btnStyles, "flex items-center")}
                >
                    <PlusIcon className="w-4 h-4" />
                    New Exhibition
                </Button>
            </Link>
        </>
    )
}