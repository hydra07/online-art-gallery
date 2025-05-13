'use client';
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useQuery, useMutation } from '@tanstack/react-query';
import collectionService from '@/service/collection-service';
import { useToast } from '@/hooks/use-toast';
import CreateCollection from './create-collection';

type Artwork = {
    _id: string;
    title: string;
    url: string;
};

type Collection = {
    _id: string;
    userId: string;
    title: string;
    description: string;
    artworks?: Artwork[];
    createdAt: string;
    updatedAt: string;
};

export default function Collections() {
    const { toast } = useToast();
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
    const [artworkToDelete, setArtworkToDelete] = useState<string | null>(null);
    const [isDeleteArtDialogOpen, setIsDeleteArtDialogOpen] = useState(false);

    // Fetch user's collections
    const { data: response, isLoading, refetch } = useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            try {
                const res = await collectionService.getByArtistId();
                return res;
            } catch (error) {
                console.error('Error fetching collections:', error);
                return { data: [] };
            }
        }
    });

    const collections = response?.data || [];

    // Delete collection mutation
    const deleteMutation = useMutation({
        mutationFn: (collectionId: string) => collectionService.delete(collectionId),
        onSuccess: () => {
            toast({
                title: 'Collection deleted',
                description: 'Collection has been deleted successfully',
                className: 'bg-green-500 text-white border-green-600'
            });
            refetch();
            setIsDeleteDialogOpen(false);
            setCollectionToDelete(null);
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to delete collection',
                className: 'bg-red-500 text-white border-red-600'
            });
        }
    });

    const removeArtworkMutation = useMutation({
        mutationFn: ({ collectionId, artworkId }: { collectionId: string, artworkId: string }) => 
            collectionService.deleteArt(collectionId, artworkId),
        onSuccess: (_, variables) => {
            // First update the UI state immediately for a responsive feel
            if (selectedCollection) {
                // Create a new version of selectedCollection with the artwork removed
                setSelectedCollection({
                    ...selectedCollection,
                    artworks: selectedCollection.artworks?.filter(
                        artwork => artwork._id !== variables.artworkId
                    )
                });
            }
            
            // Show success message
            toast({
                title: 'Artwork removed',
                description: 'Artwork has been removed from collection successfully',
                className: 'bg-green-500 text-white border-green-600'
            });
            
            // Then refetch data from the server to ensure consistency
            refetch();
            setIsDeleteArtDialogOpen(false);
            setArtworkToDelete(null);
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to remove artwork from collection',
                className: 'bg-red-500 text-white border-red-600'
            });
        }
    });

    const handleCollectionCreated = useCallback(() => {
        refetch();
    }, [refetch]);

    const confirmDeleteCollection = useCallback((collectionId: string) => {
        setCollectionToDelete(collectionId);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteCollection = useCallback(() => {
        if (collectionToDelete) {
            deleteMutation.mutate(collectionToDelete);
        }
    }, [collectionToDelete, deleteMutation]);

    const confirmRemoveArtwork = useCallback((artworkId: string) => {
        setArtworkToDelete(artworkId);
        setIsDeleteArtDialogOpen(true);
    }, []);

    const handleRemoveArtwork = useCallback(() => {
        if (artworkToDelete && selectedCollection) {
            removeArtworkMutation.mutate({ 
                collectionId: selectedCollection._id, 
                artworkId: artworkToDelete 
            });
        }
    }, [artworkToDelete, selectedCollection, removeArtworkMutation]);

    const viewCollection = useCallback((collection: Collection) => {
        setSelectedCollection(collection);
        setIsViewDialogOpen(true);
    }, []);

    return (
        <div className="p-3 md:p-6 space-y-2 md:space-y-3 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                    <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                        Collections
                    </h1>
                    <p className="text-xs md:text-sm text-teal-600 dark:text-cyan-400 mt-1">
                        Organize and showcase your artworks
                    </p>
                </div>
                <CreateCollection 
                    onSuccess={handleCollectionCreated}
                    triggerButton={
                        <Button
                            className="rounded-lg h-10 text-sm md:text-base bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Collection
                        </Button>
                    }
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-teal-500" />
                </div>
            ) : collections.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                    <h3 className="text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">
                        No collections yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                        Create your first collection to start organizing your favorite artworks
                    </p>
                    <CreateCollection
                        onSuccess={handleCollectionCreated}
                        triggerButton={
                            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Collection
                            </Button>
                        }
                    />
                </div>
            ) : (
                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {collections.map((collection: Collection) => (
                        <div key={collection._id} className="h-full">
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                                <CardHeader className="border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800">
                                    <div className="flex justify-between items-center">
                                        <div className="relative group min-w-0">
                                            <h2 className="text-base md:text-lg font-semibold text-emerald-700 dark:text-emerald-200 truncate max-w-full">
                                                {collection.title}
                                            </h2>
                                            {/* Tooltip for full title on hover */}
                                            <div className="absolute left-0 top-full mt-1 z-10 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-200 p-2 rounded-md shadow-lg text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-emerald-100 dark:border-emerald-800 max-w-xs">
                                                {collection.title}
                                            </div>
                                            <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-300">
                                                {collection.artworks?.length || 0} artworks
                                            </p>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-emerald-600 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-100"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    viewCollection(collection);
                                                }}
                                            >
                                                <Eye size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    confirmDeleteCollection(collection._id);
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
                                    <div className="relative group mb-2 md:mb-4">
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 overflow-hidden">
                                            {collection.description || 'No description'}
                                            {collection.description && collection.description.length > 60 && (
                                                <span className="text-teal-500 dark:text-teal-400 ml-1">...</span>
                                            )}
                                        </p>
                                        {/* Tooltip for full description on hover */}
                                        {collection.description && collection.description.length > 60 && (
                                            <div className="absolute left-0 top-full mt-1 z-10 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 rounded-md shadow-lg text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-gray-200 dark:border-gray-700 max-w-xs">
                                                {collection.description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 md:gap-3 flex-1 p-2 md:p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                                        {collection.artworks && collection.artworks.length > 0 ? (
                                            <>
                                                {collection.artworks.slice(0, 5).map((artwork) => (
                                                    <div key={artwork._id} className="relative aspect-square rounded-lg overflow-hidden">
                                                        <Image
                                                            src={artwork.url || '/placeholder.svg'}
                                                            alt={artwork.title}
                                                            fill
                                                            className="object-cover transition-transform hover:scale-105 duration-300"
                                                        />
                                                    </div>
                                                ))}
                                                {collection.artworks.length > 5 && (
                                                    <div className="relative aspect-square bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                                                        <span className="text-sm md:text-base font-semibold text-emerald-700 dark:text-emerald-200">
                                                            +{collection.artworks.length - 5}
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="col-span-3 flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                                                No artworks yet
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            {/* View Collection Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    {selectedCollection && (
                        <>
                            {/* Dialog Header with gradient background */}
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800 p-6 rounded-t-lg">
                                <DialogHeader>
                                    <div className="flex justify-between items-center">
                                        <DialogTitle className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                                            {selectedCollection.title}
                                        </DialogTitle>
                                       
                                    </div>
                                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
                                        {selectedCollection.description || 'No description provided'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="bg-emerald-200/70 dark:bg-emerald-700/50 text-xs px-2.5 py-1 rounded-full text-emerald-800 dark:text-emerald-200">
                                            {selectedCollection.artworks?.length || 0} artworks
                                        </div>
                                        <div className="text-xs text-emerald-600 dark:text-emerald-400">
                                            Created {new Date(selectedCollection.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </DialogHeader>
                            </div>
                            
                            {/* Content area */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400"><path d="M12 19c.5 0 1-.1 1.4-.4.4-.3.6-.7.6-1.1 0-.3-.1-.5-.2-.8-.2-.3-.5-.4-.8-.6-.3-.1-.5-.2-.9-.4l-.1-.1c-.2-.1-.4-.2-.6-.3-.2-.1-.3-.3-.3-.5s.1-.4.2-.5.3-.2.5-.2c.5 0 .9.2 1.2.6l.5-.8c-.2-.2-.4-.4-.7-.5-.3-.1-.6-.2-.9-.2-.4 0-.8.1-1.2.4-.3.2-.5.6-.5 1s.1.7.3.9c.2.2.4.4.7.5.3.1.6.3.9.4.3.2.6.3.8.5.2.1.2.3.2.5s-.1.4-.3.5c-.2.2-.4.2-.7.2-.4 0-.8-.1-1-.2-.3-.1-.5-.3-.7-.6l-.7.7c.3.3.6.6 1 .8.4.1.8.2 1.2.2Z"/><path d="M7 19h1a2 2 0 0 0 2-2v-1"/><path d="M17 19h-1a2 2 0 0 1-2-2v-1"/><path d="M7 5h1a2 2 0 0 1 2 2v1"/><path d="M17 5h-1a2 2 0 0 0-2 2v1"/></svg>
                                        Gallery
                                    </h3>
                                  
                                </div>

                                {selectedCollection.artworks && selectedCollection.artworks.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {selectedCollection.artworks.map((artwork) => (
                                            <div 
                                                key={artwork._id} 
                                                className="group aspect-square bg-muted rounded-lg overflow-hidden relative border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
                                            >
                                                <Image
                                                    src={artwork.url}
                                                    alt={artwork.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                                    <Button 
                                                        variant="destructive" 
                                                        size="icon"
                                                        className="self-end h-7 w-7 opacity-90 hover:opacity-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            confirmRemoveArtwork(artwork._id);
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                    <p className="text-white font-medium text-center text-sm line-clamp-2">
                                                        {artwork.title}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-r from-gray-50/50 to-emerald-50/50 dark:from-gray-800/30 dark:to-emerald-900/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                                        <div className="bg-emerald-100/50 dark:bg-emerald-900/30 p-4 rounded-full mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9.5 15V9"/><path d="M14.5 9v6"/></svg>
                                        </div>
                                        <p className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            No artworks yet
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
                                            This collection is waiting for your beautiful artworks.
                                        </p>
                                        <Link 
                                            href={`/artists/collections/${selectedCollection._id}`}
                                            className="text-sm bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-800/50 dark:hover:bg-emerald-700/50 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full font-medium flex items-center transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                            Add Artwork to Collection
                                        </Link>
                                    </div>
                                )}
                            </div>
                            
                            {/* Dialog footer with soft gradient */}
                            <div className="bg-gradient-to-b from-transparent to-emerald-50/50 dark:to-emerald-950/30 p-4 flex justify-end rounded-b-lg border-t border-gray-100 dark:border-gray-800">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {selectedCollection.artworks?.length || 0} artworks in this collection
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Collection Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Collection</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-muted-foreground">
                            Are you sure you want to delete this collection? This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDeleteCollection}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Artwork Confirmation Dialog */}
            <Dialog open={isDeleteArtDialogOpen} onOpenChange={setIsDeleteArtDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Remove Artwork</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-muted-foreground">
                            Are you sure you want to remove this artwork from the collection?
                            The artwork will remain in your gallery.
                        </p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDeleteArtDialogOpen(false)}
                            disabled={removeArtworkMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleRemoveArtwork}
                            disabled={removeArtworkMutation.isPending}
                        >
                            {removeArtworkMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Removing...
                                </>
                            ) : 'Remove'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}