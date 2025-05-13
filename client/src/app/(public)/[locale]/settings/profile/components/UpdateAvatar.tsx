import { Avatar } from '@/components/ui.custom/Avatar';
import FileUploader from '@/components/ui.custom/file-uploader';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateAvatarAction } from '../actions';

interface UpdateAvatarProps {
    user: {
        image: string | undefined;
        isPremium: boolean;
    };
}

const UpdateAvatar: React.FC<UpdateAvatarProps> = ({ user }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { status, data: session } = useSession();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();

    const handleAvatarUpload = async (files: { url: string; width?: number; height?: number; _id?: string }[]) => {
        if (status !== 'authenticated') {
            toast({
                title: 'Authentication Error',
                description: 'Please sign in to update your avatar',
                variant: 'destructive'
            });
            router.push('/auth/signin');
            return;
        }

        try {
            if (session?.user?.accessToken) {
                // Use the url from the first file in the array
                const imageUrl = files[0].url;
                await updateAvatarAction({ url: imageUrl });
                await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
                router.push('/settings/profile');
                toast({
                    title: 'Success',
                    description: 'Avatar updated successfully'
                });
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update avatar',
                variant: 'destructive'
            });
        }
    };

    return (
        <>
            {/* Clickable Avatar */}
            <div
                className="relative cursor-pointer group"
                onClick={() => setIsDialogOpen(true)}
            >
                <div className="ring-4 ring-gray-100 dark:ring-gray-800 rounded-full">
                    <Avatar
                        user={{
                            image: user.image || '',
                            isPremium: user.isPremium
                        }}
                        size="lg"
                    />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs">Change Photo</span>
                </div>
            </div>

            {/* Update Avatar Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
                            Update Profile Picture
                        </DialogTitle>
                        <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                            Upload a new profile picture
                        </p>
                    </DialogHeader>

                    <div className="py-6">
                        <div className="flex flex-col items-center space-y-4">
                            {/* Current Avatar Preview */}
                            <div className="mb-4">
                                <div className="ring-4 ring-gray-100 dark:ring-gray-800 rounded-full">
                                    <Avatar
                                        user={{
                                            image: user.image || '',
                                            isPremium: user.isPremium
                                        }}
                                        size="lg"
                                    />
                                </div>
                            </div>

                            {/* File Uploader */}
                            <div className="w-full">
                                <FileUploader
                                    onFileUpload={handleAvatarUpload}
                                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
                                    maxFiles={1}
                                    maxSize={ 10 * 1024 * 1024 }
                                />
                            </div>

                            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                                Maximum file size: 10MB
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateAvatar; 