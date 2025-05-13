import { Button } from '@/components/ui/button';
import { Share2, MessageSquare } from 'lucide-react';

interface SocialBlogActionsProps {
	className?: string;
}

export function SocialBlogActions({ className }: SocialBlogActionsProps) {
	return (
		<div className={`absolute right-4 top-4 flex space-x-2 ${className}`}>
			<Button variant='secondary' size='sm'>
				<MessageSquare className='h-4 w-4 mr-2' />
				Discuss
			</Button>
			<Button variant='secondary' size='sm'>
				<Share2 className='h-4 w-4 mr-2' />
				Share
			</Button>
		</div>
	);
}
