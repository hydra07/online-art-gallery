import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import collectionService from "@/service/collection-service";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
import useAuthClient from "@/hooks/useAuth-client";
import { AuthDialog } from "./auth-dialog";
import CreateCollection from "@/app/(public)/[locale]/artists/collections/create-collection";

interface AddArtworktProps {
    artworkId: string;
    triggerButton?: React.ReactNode;
    onSuccess?: () => void;
}

export default function AddArtworkCollection({artworkId, triggerButton, onSuccess}: AddArtworktProps) {
    const { toast } = useToast();   
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
    const { user, status } = useAuthClient();
    const queryClient = useQueryClient();
    
    // Fetch user collections only if user is logged in
    const { data, isLoading } = useQuery({
        queryKey: ['collections'],
        queryFn: () => collectionService.getByArtistId(),
        enabled: !!user, // Only run query if user is logged in
    });
    
    const collections = data?.data || [];
    
    const mutation = useMutation({
        mutationFn: (collectionId: string) => collectionService.update(collectionId, artworkId),
        onSuccess: (response, collectionId) => {
            // Update the cache with the new collection data
            queryClient.setQueryData(['collections'], (oldData: any) => {
                if (!oldData) return oldData;
                
                // Create a deep copy of the old data
                const newData = JSON.parse(JSON.stringify(oldData));
                
                // Find and update the specific collection
                const collectionIndex = newData.data.findIndex((c: any) => c._id === collectionId);
                if (collectionIndex !== -1) {
                    // Update with the response data or add the artwork to the collection
                    const updatedCollection = response.data;
                    newData.data[collectionIndex] = updatedCollection;
                }
                
                return newData;
            });

            toast({
                title: "Success",
                description: "Artwork added to collection successfully",
                
            });
            
            setIsOpen(false);
            
            if (onSuccess) {
                onSuccess();
            }
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add artwork to collection",
                
            });
        }
    });

    const handleAddToCollection = (collectionId: string) => {
        // Check if artwork already exists in the selected collection
        const selectedCollection = collections?.find(
            (collection: any) => collection._id === collectionId
        );
        
        if (selectedCollection && selectedCollection.artworks) {
            const artworkExists = selectedCollection.artworks.some(
                (artwork: any) => artwork._id === artworkId || artwork.toString() === artworkId
            );
            
            if (artworkExists) {
                toast({
                    title: "Already in collection",
                    description: `This artwork is already in the "${selectedCollection.title}" collection`,
                    className: 'bg-blue-500 text-white border-blue-600'
                });
                return;
            }
        }
        
        setSelectedCollectionId(collectionId);
        mutation.mutate(collectionId);
    };
    
    // Handle the click on the trigger button
    const handleTriggerClick = () => {
        if (!user) {
            // Show auth dialog if user is not logged in
            setIsAuthDialogOpen(true);
        } else {
            // Open collection dialog if user is logged in
            setIsOpen(true);
        }
    };

    const handleCollectionCreated = async () => {
        // Refresh collections after creating a new one
        queryClient.invalidateQueries({ queryKey: ['collections'] });
        
        // Toast notification
        toast({
            title: "Success",
            description: "Collection created successfully! You can now add your artwork to it.",
            className: 'bg-green-500 text-white border-green-600'
        });
    };
    
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <div onClick={handleTriggerClick}>
                    {triggerButton ? (
                        triggerButton
                    ) : (
                        <Button>
                            Add to Collection
                        </Button>
                    )}
                </div>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-xl">Add to Collection</DialogTitle>
                    </DialogHeader>
                    
                    <div className="flex-1 min-h-0 py-2">
                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : collections && collections.length > 0 ? (
                            <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-1">
                                {collections.map((collection: any) => (
                                    <div 
                                        key={collection._id}
                                        className={`p-3 border rounded-md cursor-pointer hover:bg-secondary transition-colors ${
                                            mutation.isPending && selectedCollectionId === collection._id ? 'opacity-70' : ''
                                        }`}
                                        onClick={() => {
                                            handleAddToCollection(collection._id);
                                        }}
                                    >
                                        <div className="font-medium truncate" title={collection.title}>
                                            {collection.title}
                                        </div>
                                        {collection.description && (
                                            <div 
                                                className="text-sm text-muted-foreground line-clamp-2 break-words"
                                                title={collection.description}
                                            >
                                                {collection.description}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 flex flex-col items-center">
                                <p className="mb-4">You don't have any collections yet.</p>
                                <CreateCollection 
                                    onSuccess={handleCollectionCreated} 
                                    triggerButton={
                                        <Button className="flex items-center gap-2">
                                            <PlusCircle size={16} />
                                            Create a new collection
                                        </Button>
                                    }
                                />
                            </div>
                        )}
                    </div>
                    
                    {mutation.isPending && (
                        <div className="flex items-center justify-center gap-2 text-sm mt-4 py-2 border-t">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Adding artwork to collection...</span>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            
            {/* Auth Dialog for non-logged in users */}
            <AuthDialog 
                isOpen={isAuthDialogOpen}
                setIsOpen={setIsAuthDialogOpen}
            />
        </>
    );
}