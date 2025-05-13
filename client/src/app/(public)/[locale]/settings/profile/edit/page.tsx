import { Suspense } from 'react';
import { getArtistProfile } from '@/app/(public)/[locale]/_header/queries';
import { getCurrentUser } from '@/lib/session';
import { ProfileSkeleton } from '../components/profile-content';
import EditProfile from '../components/edit-profile';
import { redirect } from 'next/navigation';
import { getUser } from '@/service/user';

export default async function EditProfilePage() {
 const currentUser = await getCurrentUser();
 if (!currentUser) {
  redirect('/login');
 }
 const isArtist = currentUser.role?.includes('artist');

 // Fetch data on the server
 const userData = await (isArtist ? getArtistProfile(currentUser.accessToken) : getUser(currentUser.accessToken));

 return (
  <Suspense fallback={<ProfileSkeleton />}>
   <EditProfile initialData={userData.user} />
  </Suspense>
 );
} 