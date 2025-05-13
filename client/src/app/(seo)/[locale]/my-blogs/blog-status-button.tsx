'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import { cancelPublicRequestAction, createPublicRequestAction, updateBlogAction } from './action';
import { useTranslations } from 'next-intl';
import { BlogStatus } from '@/utils/enums';
import { useServerAction } from 'zsa-react';

interface BlogStatusButtonProps {
    blogId: string;
    initialStatus: BlogStatus;
}

const BlogStatusButton = ({ blogId, initialStatus }: BlogStatusButtonProps) => {
    const [status, setStatus] = useState(initialStatus);
    const router = useRouter();
    const { toast } = useToast();
    const tBlog = useTranslations('blog');
    const tCommon = useTranslations('common');
    // For making blog private (from PUBLISHED to DRAFT)
    const { execute: executeSetPrivate, isPending: isPrivatePending } = useServerAction(
        updateBlogAction,
        {
            onSuccess: () => {
                setStatus(BlogStatus.DRAFT);
                toast({
                    title: tCommon('success'),
                    description: tBlog('set_private_success') || 'Blog has been set to private',
                    variant: 'success'
                });
                router.refresh();
            },
            onError: () => {
                toast({
                    title: tCommon('error'),
                    description: tBlog('update_status_error'),
                    variant: 'destructive'
                });
            }
        }
    );

    // For requesting publication (from DRAFT to PENDING_REVIEW)
    const { execute: executeCreateRequest, isPending: isCreateRequestPending } = useServerAction(
        createPublicRequestAction,
        {
            onSuccess: () => {
                setStatus(BlogStatus.PENDING_REVIEW);
                toast({
                    title: tCommon('success'),
                    description: tBlog('create_request'),
                    variant: 'success'
                });
                router.refresh();
            },
            onError: () => {
                toast({
                    title: tCommon('error'),
                    description: tBlog('update_status_error'),
                    variant: 'destructive'
                });
            }
        }
    );

    // For canceling publication request (from PENDING_REVIEW to DRAFT)
    const { execute: executeCancelRequest, isPending: isCancelRequestPending } = useServerAction(
        cancelPublicRequestAction,
        {
            onSuccess: () => {
                setStatus(BlogStatus.DRAFT);
                toast({
                    title: tCommon('success'),
                    description: tBlog('cancel_request'),
                    variant: 'success'
                });
                router.refresh();
            },
            onError: () => {
                toast({
                    title: tCommon('error'),
                    description: tBlog('update_status_error'),
                    variant: 'destructive'
                });
            }
        }
    );

    const isPending = isPrivatePending || isCreateRequestPending || isCancelRequestPending;

    const handleStatusChange = () => {
        switch (status) {
            case BlogStatus.PUBLISHED:
                // Make the blog private
                executeSetPrivate({ id: blogId, status: BlogStatus.DRAFT });
                break;
            case BlogStatus.DRAFT:
                // Request publication
                executeCreateRequest({ id: blogId });
                break;
            case BlogStatus.PENDING_REVIEW:
                // Cancel publication request
                executeCancelRequest({ id: blogId });
                break;
            default:
                break;
        }
    };

    const getButtonText = () => {
        if (isPending) {
            return <LoaderCircle className='animate-spin' />;
        }

        switch (status) {
            case BlogStatus.PUBLISHED:
                return tBlog('private') || 'Make Private';
            case BlogStatus.DRAFT:
                return tBlog('public') || 'Request Publish';
            case BlogStatus.PENDING_REVIEW:
                return tBlog('cancel') || 'Cancel Request';
            default:
                return '';
        }
    };

    const getButtonStyles = () => {
        switch (status) {
            case BlogStatus.PUBLISHED:
            case BlogStatus.PENDING_REVIEW:
                return 'bg-yellow-500 border border-yellow-500 hover:bg-yellow-600 ' +
                       'dark:bg-yellow-700 dark:hover:bg-yellow-800 dark:border-yellow-700';
            case BlogStatus.DRAFT:
                return 'bg-secondary border border-secondary hover:bg-secondary/80 ' +
                       'dark:bg-secondary dark:hover:bg-secondary/80 dark:border-secondary';
            default:
                return '';
        }
    };

    // Don't render anything if the status is not one of the expected ones
    if (![BlogStatus.PUBLISHED, BlogStatus.DRAFT, BlogStatus.PENDING_REVIEW].includes(status)) {
        return null;
    }

    return (
        <Button
            className={`text-black rounded-full py-2 px-4 
                ${getButtonStyles()}
                ${isPending ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={handleStatusChange}
            disabled={isPending}
            style={status === BlogStatus.PUBLISHED ? { width: '100px' } : undefined}
        >
            {getButtonText()}
        </Button>
    );
};

export default BlogStatusButton;