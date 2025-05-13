"use client";

import { EllipsisVertical, Eye, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "@/components/ui.custom/delete-modal";
import { useServerAction } from "zsa-react";
import { deleteArtistRequestAction } from "./action";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { InteractiveOverlay } from "@/components/ui.custom/interactive-overlay";
import { ApproveRequestForm } from "./approve-request-form";
import { ArtistRequest, ArtistRequestStatus } from "@/types/artist-request";

export function ArtistRequestActions({ request }: { request: ArtistRequest }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { execute, isPending } = useServerAction(deleteArtistRequestAction, {
    onSuccess() {
      setIsOpen(false);
    },
  });

  return (
    <>
      <InteractiveOverlay
        isOpen={isReviewOpen}
        setIsOpen={setIsReviewOpen}
        title=""
        description=""
        form={<ApproveRequestForm request={request} setIsOpen={setIsReviewOpen} />}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Artist Request"
        description="Are you sure you want to delete this artist request? This action cannot be undone."
        onConfirm={() => {
          execute({
            requestId: request._id,
          });
        }}
        isPending={isPending}
      />

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {request.status === ArtistRequestStatus.PENDING && (
            <DropdownMenuItem
              className={cn(btnStyles, "text-blue-500")}
              onClick={() => {
                setIsReviewOpen(true);
              }}
            >
              <Eye className={btnIconStyles} />
              Review
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className={cn(btnStyles, "text-red-500")}
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
          >
            <TrashIcon className={btnIconStyles} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}