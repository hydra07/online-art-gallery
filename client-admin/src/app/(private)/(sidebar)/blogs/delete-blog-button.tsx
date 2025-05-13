"use client";
import { useToast } from "@/hooks/use-toast";
import {  useState } from "react";
import { useServerAction } from "zsa-react";
import { deleteBlogAction } from "./action";
import { DeleteModal } from "@/components/ui.custom/delete-modal";




export function DeleteBlogButton({ blogId }: { blogId: string }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);



    const { execute, error, isPending } = useServerAction(deleteBlogAction, {
      onSuccess: () => {
        toast({

          title: "Charm deleted",
          variant: "success",
          description: "Charm deleted successfully",
        });
        setIsOpen(false);
      },
      onError: () => {
        toast({
          title: "Error",
          variant: "error",
          description: error?.message || "An error occurred while deleting the charm"
        });
      },
    });
  
    return (
      <DeleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Delete Blog"
        description="Are you sure you want to delete this blog? This action cannot be undone."
        onConfirm={() => execute({ blogId })}
        isPending={isPending}
      />

    );
  }