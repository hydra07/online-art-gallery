"use client";

import { Eye, EllipsisVertical, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "@/components/ui.custom/delete-modal";
import { useServerAction } from "zsa-react";
import { deleteGalleryTemplateAction, toggleGalleryStatusAction } from "./actions";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Gallery } from "@/types/gallery";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export function GalleryActions({ gallery }: { gallery: Gallery }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const { toast } = useToast();

  const { execute, isPending } = useServerAction(deleteGalleryTemplateAction, {
    onSuccess() {
      setIsOpen(false);
      setIsDeleteModalOpen(false);
      toast({
        title: "Gallery disabled",
        description: "The gallery has been successfully disabled",
        variant: "success"
      });
    },
    onError(error) {
      toast({
        title: "Error",
        description: error.err.message || "Failed to disable gallery",
        variant: "destructive"
      });
    }
  });

  //disable gallery
  const { execute: toggleExecute, isPending: togglePending } = useServerAction(toggleGalleryStatusAction, {
    onSuccess() {
      setIsStatusModalOpen(false);
      setIsOpen(false);
      toast({
        title: gallery.isActive ? "Gallery enabled" : "Gallery disabled",
        description: `The status updated successfully`,
        variant: "success"
      });
    },
    onError(error) {
      toast({
        title: "Error",
        description: error.err.message || "Failed to update gallery status",
        variant: "destructive"
      });
    }
  });

  return (
    <>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Gallery"
        confirmText="Delete"
        description="Are you sure you want to delete this gallery? This action cannot be undone."
        onConfirm={() => {
          execute({
            id: gallery._id,
          });
        }}
        isPending={isPending}
      />
      <DeleteModal
        isOpen={isStatusModalOpen}
        setIsOpen={setIsStatusModalOpen}
        title={gallery.isActive ? "Disable Gallery" : "Enable Gallery"}
        confirmText={gallery.isActive ? "Disable" : "Enable"}
        description={`Are you sure you want to ${gallery.isActive ? "disable" : "enable"} this gallery?`}
        onConfirm={() => {
          toggleExecute({
            id: gallery._id,
            isActive: !gallery.isActive, // Toggle the current status
          });
        }}
        isPending={togglePending}
      />

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className={cn(btnStyles)}
            asChild
          >
            <Link href={`/gallery/edit/${gallery._id}`}>
              <Eye className={btnIconStyles} />
              View & Edit
            </Link>
          </DropdownMenuItem>
          {/* Commenting out Delete button and replacing with Disable
          <DropdownMenuItem
            className={cn(btnStyles, "text-red-500")}
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
          >
            <TrashIcon className={btnIconStyles} />
            Delete
          </DropdownMenuItem>
          */}
          <DropdownMenuItem
            className={cn(btnStyles, "text-orange-500")}
            onClick={() => {
                setIsStatusModalOpen(true);
            }}
          >
            <TrashIcon className={btnIconStyles} />
            {gallery.isActive ? 'Disable' : 'Enable'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}