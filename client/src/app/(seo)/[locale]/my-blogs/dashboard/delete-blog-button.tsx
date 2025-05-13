'use client';

import { LoaderButton } from '@/components/ui.custom/loader-button';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';
import { deleteBlogAction } from './action';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function DeleteBlogButton({
    blogId,
    children
}: {
    blogId: string;
    children: React.ReactNode;
}) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const tCommon = useTranslations('common');
    const tBlog = useTranslations('blog');
    
    const { execute, isPending } = useServerAction(deleteBlogAction, {
        onSuccess() {
            toast({
                title: tCommon('success'),
                description: tBlog('blog_deleted_success'),
                variant: 'success'
            });
            setIsOpen(false);
            redirect('/my-blogs');
        },
        onError() {
            toast({
                title: tCommon('error'),
                description: tBlog('blog_delete_error'),
                variant: 'destructive' // Changed 'error' to 'destructive' to match your toast system
            });
        }
    });

    // Handle trigger click separately to prevent propagation
    const handleTriggerClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
    };
    
    // Handle actual deletion
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        execute({ blogId });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            {/* Handle trigger with a custom wrapper to control propagation */}
            <div onClick={handleTriggerClick}>
                <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                    {children}
                </AlertDialogTrigger>
            </div>
            
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{tBlog('delete_blog_title') || 'Delete Blog'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {tBlog('delete_blog_confirmation') || 'Are you sure you want to delete this blog? All data will be removed from our system.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                        {tCommon('cancel') || 'Cancel'}
                    </AlertDialogCancel>
                    <LoaderButton
                        isLoading={isPending}
                        onClick={handleDelete}
                        variant="destructive"
                    >
                        {tCommon('delete') || 'Delete'}
                    </LoaderButton>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}