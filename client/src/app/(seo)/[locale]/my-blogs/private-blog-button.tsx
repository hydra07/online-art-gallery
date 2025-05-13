'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircleIcon } from 'lucide-react';
import { updateBlogAction } from './action';
import { useTranslations } from 'next-intl';
import { BlogStatus } from '@/utils/enums';

interface PrivateBlogButtonProps {
  blogId: string;
}
  
const PrivateBlogButton = ({ blogId }: PrivateBlogButtonProps) => {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const tBlog = useTranslations('blog');

  const handleSetPrivate = async () => {
    setIsPending(true);
    try {
      await updateBlogAction({
        id: blogId,
        status: BlogStatus.DRAFT
      });
      
      toast({
        title: 'Success',
        description: 'Blog has been set to private',
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
      className="text-black rounded-full py-2 px-4 
        bg-yellow-500 border border-yellow-500 hover:bg-yellow-600 
        dark:bg-yellow-700 dark:hover:bg-yellow-800 dark:border-yellow-700
        disabled:cursor-not-allowed disabled:opacity-50"
      onClick={handleSetPrivate}
      style={{ width: '100px' }}
      disabled={isPending}
    >
      {isPending ? (
        <LoaderCircleIcon className='animate-spin' />
      ) : (
        tBlog('private') || 'Make Private'
      )}
    </Button>
  );
};

export default PrivateBlogButton;