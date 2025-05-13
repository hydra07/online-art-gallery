"use client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { deleteExhibitionAction } from "./action";
import { DeleteModal } from "@/components/ui.custom/delete-modal";

export function DeleteExhibitionButton({ exhibitionId }: { exhibitionId: string }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const { execute, error, isPending } = useServerAction(deleteExhibitionAction, {
      onSuccess: () => {
        toast({
          title: "Exhibition deleted",
          variant: "success",
          description: "Exhibition deleted successfully",
        });
        setIsOpen(false);
      },
      onError: () => {
        toast({
          title: "Error",
          variant: "error",
          description: error?.message || "An error occurred while deleting the exhibition"
        });
      },
    });
  
    return (
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Delete Exhibition"
        description="Are you sure you want to delete this exhibition? This action cannot be undone."
        onConfirm={() => execute({ exhibitionId })}
        isPending={isPending}
      />
    );
}