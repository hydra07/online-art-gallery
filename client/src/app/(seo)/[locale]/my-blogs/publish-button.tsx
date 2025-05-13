'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircleIcon } from 'lucide-react';
import { updateBlogAction } from './action';
import { useTranslations } from 'next-intl';
import { BlogStatus } from '@/utils/enums';

interface PublishButtonProps {
  blogId: string;
  initialStatus: BlogStatus;
}

const PublishButton = ({ blogId, initialStatus }: PublishButtonProps) => {
  const [status, setStatus] = useState<BlogStatus>(initialStatus);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const tBlog = useTranslations('blog');

  const isPublished = status === BlogStatus.PUBLISHED;

  const handlePublishToggle = async () => {
    setIsPending(true);
    try {
      const newStatus = isPublished ? BlogStatus.DRAFT : BlogStatus.PUBLISHED;
      
      await updateBlogAction({
        id: blogId,
        status: newStatus
      });
      
      setStatus(newStatus);
      toast({
        title: 'Success',
        description: isPublished
          ? tBlog('private_success')
          : tBlog('publish_success'),
        variant: 'success'
      });
      router.refresh(); // Refresh the page to get updated data
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update blog status',
        variant: 'destructive'
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      className={`text-black rounded-full py-2 px-4 
        ${isPublished
          ? 'bg-yellow-500 border border-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800 dark:border-yellow-700'
          : 'bg-secondary border border-secondary hover:bg-secondary/80 dark:bg-secondary dark:hover:bg-secondary/80 dark:border-secondary'
        }
        ${isPending ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={handlePublishToggle}
      style={{ width: '80px' }}
      disabled={isPending}
    >
      {isPending ? (
        <LoaderCircleIcon className='animate-spin' />
      ) : isPublished ? (
        tBlog('private')
      ) : (
        tBlog('publish')
      )}
    </Button>
  );
};

export default PublishButton;