'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { updateProfile } from '../queries';
import { revalidateProfilePages } from '../actions';
import { AxiosError } from 'axios';
import UpdateAvatar from './UpdateAvatar';
import { BioEditor } from './bio-editor';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEditProfileSchema } from '../schema';
import { z } from 'zod';

interface EditProfileProps {
    initialData: {
        name: string;
        email: string;
        address?: string;
        image?: string;
        isPremium?: boolean;
        artistProfile?: {
            bio?: string;
            genre?: string[];
        };
        role?: string[];
    };
}

// Danh sách các trường phái nghệ thuật
const AVAILABLE_GENRES = [
    'Realism',
    'Impressionism',
    'Abstract',
    'Surrealism',
    'Contemporary',
    'Pop Art',
    'Minimalism',
    'Expressionism',
    'Digital Art',
    'Traditional',
    'Illustration',
    'Conceptual Art',
    'Street Art',
    'Portrait',
    'Landscape',
    'Still Life',
    'Modern Art',
    'Fine Art',
    'Urban Sketching',
    'Watercolor',
] as const;

const EditProfile = ({ initialData }: EditProfileProps) => {
    const { data: session, status } = useSession();
    const { editProfileSchema } = useEditProfileSchema();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: initialData.name,
            address: initialData.address || '',
            bio: initialData.artistProfile?.bio || '',
            genres: initialData.artistProfile?.genre || [],
        }
    });
    const [newGenre, setNewGenre] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();
    const isArtist = initialData.role?.includes('artist');
    const t = useTranslations('profile.edit');

    const handleAddGenre = async () => {
        if (!session?.user?.accessToken) {
            toast({
                title: 'Error',
                description: t('toast.login_required'),
                variant: 'destructive'
            });
            return;
        }

        if (newGenre && !watch('genres').includes(newGenre)) {
            const updatedGenres = [...watch('genres'), newGenre];
            try {
                await updateProfile({
                    artistProfile: {
                        genre: updatedGenres,
                        bio: watch('bio')
                    }
                }, session.user.accessToken);

                setValue('genres', updatedGenres);
                setNewGenre('');

                await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
                await revalidateProfilePages();

                toast({
                    title: 'Success',
                    description: t('toast.style_added')
                });
            } catch (error) {
                console.error('Error updating genres:', error);
                toast({
                    title: 'Error',
                    description: t('toast.style_add_error'),
                    variant: 'destructive'
                });
            }
        }
    };

    const handleRemoveGenre = async (genreToRemove: string) => {
        if (!session?.user?.accessToken) {
            toast({
                title: 'Error',
                description: t('toast.login_required'),
                variant: 'destructive'
            });
            return;
        }

        try {
            const updatedGenres = watch('genres').filter(g => g !== genreToRemove);
            await updateProfile({
                artistProfile: {
                    genre: updatedGenres,
                    bio: watch('bio')
                }
            }, session.user.accessToken);

            setValue('genres', updatedGenres);

            await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            await revalidateProfilePages();

            toast({
                title: 'Success',
                description: t('toast.style_removed')
            });
        } catch (error) {
            console.error('Error removing genre:', error);
            toast({
                title: 'Error',
                description: t('toast.style_remove_error'),
                variant: 'destructive'
            });
        }
    };

    const onSubmit = async (data: z.infer<typeof editProfileSchema>) => {
        if (status !== 'authenticated') {
            toast({
                title: 'Authentication Error',
                description: t('toast.auth_error'),
                variant: 'destructive'
            });
            router.push('/auth/signin');
            return;
        }

        try {
            setIsLoading(true);
            const updateData = {
                name: data.name,
                address: data.address,
                artistProfile: isArtist ? {
                    bio: data.bio,
                    genre: data.genres
                } : undefined
            };

            await updateProfile(updateData, session?.user?.accessToken);
            await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            await revalidateProfilePages();

            toast({
                title: 'Success',
                description: t('toast.update_success')
            });
            router.push('/settings/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Error',
                description: ((error as AxiosError).response?.data as { message: string }).message || t('toast.update_error'),
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 py-12'>
            <div className='container mx-auto px-4 max-w-4xl'>
                {/* Main Card */}
                <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
                    {/* Header with Background Image */}
                    <div className='relative h-48 bg-gradient-to-r from-purple-600 to-pink-600'>
                        <div className='absolute inset-0 bg-black/20'></div>
                        <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                            <h1 className='text-3xl font-bold'>{t('title')}</h1>
                            <p className='text-white/80 mt-2'>{t('subtitle')}</p>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className='relative px-6 pb-6'>
                        {/* Avatar Section - Positioned to overlap header */}
                        <div className='relative -mt-20 mb-6 flex justify-center'>
                            <div className='relative group'>
                                <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200'></div>
                                <div className='relative bg-white p-1 rounded-full'>
                                    <UpdateAvatar
                                        user={{
                                            image: initialData.image,
                                            isPremium: initialData.isPremium || false
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8 max-w-2xl mx-auto'>
                            {/* Basic Info Card */}
                            <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6 hover:border-purple-200 transition duration-200'>
                                <div className='flex items-center space-x-2 text-lg font-semibold text-gray-900'>
                                    <span className='p-1.5 bg-purple-100 rounded-lg'>
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </span>
                                    <h2>{t('basic_info')}</h2>
                                </div>

                                <div className='space-y-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='name' className='text-sm font-medium text-gray-700'>
                                            {t('name')} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id='name'
                                            {...register('name')}
                                            className={`w-full focus:ring-purple-500 focus:border-purple-500 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                            placeholder={t('name_placeholder')}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className='space-y-2'>
                                        <Label htmlFor='address' className='text-sm font-medium text-gray-700'>
                                            {t('address')}
                                        </Label>
                                        <Input
                                            id='address'
                                            {...register('address')}
                                            className={`w-full focus:ring-purple-500 focus:border-purple-500 ${errors.address ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                            placeholder={t('address_placeholder')}
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-500">{errors.address.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Artist Profile Card */}
                            {isArtist && (
                                <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6 hover:border-purple-200 transition duration-200'>
                                    <div className='flex items-center space-x-2 text-lg font-semibold text-gray-900'>
                                        <span className='p-1.5 bg-purple-100 rounded-lg'>
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </span>
                                        <h2>{t('artist_profile')}</h2>
                                    </div>

                                    {/* Bio Editor */}
                                    <div className='space-y-4'>
                                        <Label className='text-sm font-medium text-gray-700'>
                                            {t('biography')}
                                        </Label>
                                        <div className={`bg-white rounded-lg border ${errors.bio ? 'border-red-300' : 'border-gray-200'} shadow-sm hover:border-purple-200 transition duration-200`}>
                                            <BioEditor
                                                initialBio={watch('bio')}
                                                isEditable={true}
                                                onChange={(newBio) => setValue('bio', newBio)}
                                            />
                                        </div>
                                        {errors.bio && (
                                            <p className="text-sm text-red-500">{errors.bio.message}</p>
                                        )}
                                    </div>

                                    {/* Art Styles */}
                                    <div className='space-y-4'>
                                        <Label className='text-sm font-medium text-gray-700'>{t('art_styles')}</Label>
                                        <div className='flex flex-wrap items-center gap-3'>
                                            <select
                                                className={`flex-1 text-sm rounded-lg border ${errors.genres ? 'border-red-300' : 'border-gray-200'} bg-white px-4 py-2.5 shadow-sm focus:border-purple-500 focus:ring-purple-500 hover:border-purple-200 transition duration-200`}
                                                value={newGenre}
                                                onChange={(e) => setNewGenre(e.target.value)}
                                            >
                                                <option value="">{t('select_art_style')}</option>
                                                {AVAILABLE_GENRES
                                                    .filter(genre => !watch('genres').includes(genre))
                                                    .map(genre => (
                                                        <option key={genre} value={genre}>{genre}</option>
                                                    ))
                                                }
                                            </select>
                                            <Button
                                                type="button"
                                                onClick={handleAddGenre}
                                                disabled={!newGenre}
                                                variant="outline"
                                                size="sm"
                                                className='bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200'
                                            >
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        <div className={`p-4 bg-gray-50 rounded-xl min-h-[60px] border ${errors.genres ? 'border-red-300' : 'border-gray-100'}`}>
                                            {watch('genres').length === 0 ? (
                                                <p className='text-gray-500 text-sm text-center'>{t('no_art_styles')}</p>
                                            ) : (
                                                <div className='flex flex-wrap gap-2'>
                                                    {watch('genres').map((genre) => (
                                                        <Badge
                                                            key={genre}
                                                            variant="secondary"
                                                            className="bg-white border border-purple-200 text-purple-800 flex items-center gap-1.5 px-3 py-1.5 hover:bg-purple-50 transition duration-200"
                                                        >
                                                            {genre}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveGenre(genre)}
                                                                className="hover:text-red-500 transition-colors"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {errors.genres && (
                                            <p className="text-sm text-red-500">{errors.genres.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className='flex gap-4 justify-end pt-6 border-t border-gray-100'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => router.push('/settings/profile')}
                                    disabled={isLoading}
                                    className='min-w-[120px] border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                >
                                    {t('buttons.cancel')}
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={isLoading}
                                    className='min-w-[120px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25'
                                >
                                    {isLoading ? (
                                        <div className='flex items-center gap-2'>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>{t('buttons.saving')}</span>
                                        </div>
                                    ) : t('buttons.save')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile; 