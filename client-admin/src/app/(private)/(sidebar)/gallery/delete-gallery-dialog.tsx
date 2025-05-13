"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deleteGalleryTemplateAction } from "./actions";
import { useServerAction } from "zsa-react";

interface DeleteGalleryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  galleryId: string;
  galleryName: string;
}

export function DeleteGalleryDialog({
  isOpen,
  onClose,
  galleryId,
  galleryName,
}: DeleteGalleryDialogProps) {
  const { toast } = useToast();
  const router = useRouter();

  const { execute: deleteTemplate, isPending } = useServerAction(deleteGalleryTemplateAction, {
    onSuccess: () => {
      toast({
        title: "Gallery template deleted",
        description: "The gallery template has been deleted successfully.",
      });
      onClose();
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.err.message,
        variant: "destructive",
      });
      onClose();
    },
  });

  const handleDelete = async () => {
    await deleteTemplate({
      id: galleryId,
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the gallery
            template <span className="font-semibold">{galleryName}</span> and remove its
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}