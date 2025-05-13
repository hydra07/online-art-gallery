import { useToast } from '@/hooks/use-toast';
import collectionService from '@/service/collection-service';
import { CollectionForm, collectionSchema, CreateCollectionForm, createCollection } from '@/types/collection';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { PlusCircle, X, Bookmark, Loader2 } from 'lucide-react';

interface CreateCollectionProps {
    onSuccess?: () => void;
    triggerButton?: React.ReactNode;
}

export default function CreateCollection({ onSuccess, triggerButton }: CreateCollectionProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const form = useForm<CreateCollectionForm>({
        resolver: zodResolver(createCollection),
        defaultValues: {
            title: '',
            description: '',
            artworks: []
        }
    });

    const mutation = useMutation({
        mutationFn: (data: CreateCollectionForm) => {
            return collectionService.createInUser(data);
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Collection created successfully!',
                className: 'bg-green-500 text-white border-green-600',
                duration: 2000
            });
            setOpen(false);
            form.reset();
            if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
            console.log('Mutation error:', error);
            toast({
                title: 'Error',
                description: error?.message || 'Failed to create collection',
                className: 'bg-red-500 text-white border-red-600',
                duration: 2000
            });
            setIsSubmitting(false);
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });

    const onSubmit = (data: CreateCollectionForm) => {
        setIsSubmitting(true);
        mutation.mutate(data);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || (
                    <Button className="flex items-center gap-2">
                        <PlusCircle size={16} />
                        New Collection
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="My Amazing Collection" 
                                            {...field} 
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe your collection"
                                            className="resize-none"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="flex gap-2 sm:justify-between pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-1"
                                disabled={isSubmitting}
                            >
                                <X size={16} />
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                className="flex items-center gap-1"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Bookmark size={16} />
                                        Create Collection
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
