'use client'
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast";
import { deleteExhibition } from "@/service/exhibition";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { useRouter } from "next/navigation";

interface DeleteExhibitionButtonProps {
  exhibitionId: string;
  onSuccess?: () => void;
  variant?: "icon" | "button";
  size?: "sm" | "default";
}

export default function DeleteExhibitionButton({ 
  exhibitionId, 
  onSuccess,
  variant = "icon", 
  size = "sm"
}: DeleteExhibitionButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const deleteMutation = useMutation({
    mutationFn: (exhibitionId: string) => deleteExhibition(exhibitionId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Exhibition deleted successfully",
        variant: "success",
      });
      
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete exhibition",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    setIsDialogOpen(false);
    deleteMutation.mutate(exhibitionId);
  };

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size={size}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
          onClick={() => setIsDialogOpen(true)}
          disabled={deleteMutation.isPending}
          aria-label="Delete Exhibition"
        >
          {deleteMutation.isPending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      ) : (
        <Button 
          variant="destructive" 
          size={size}
          onClick={() => setIsDialogOpen(true)}
          disabled={deleteMutation.isPending}
          className="transition-all"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete Exhibition"}
        </Button>
      )}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <span>Are you sure?</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              This action cannot be undone. This will permanently delete the 
              exhibition and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              ) : (
                "Delete Exhibition"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}