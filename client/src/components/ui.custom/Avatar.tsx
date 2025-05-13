import Image from 'next/image';
import { PremiumBadge } from './PremiumBadge';

interface AvatarProps {
  user: {
    image: string;
    isPremium: boolean;
  };
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = ({ user, size = 'md' }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  // If user has uploaded their own image, use that
  // Otherwise, fall back to Google image
  // Finally, use default avatar
  const avatarSrc = user.image
    ? user.image
    : 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg';

  return (
    <div className="relative inline-block">
      <Image
        src={avatarSrc}
        alt="Avatar"
        width={64}
        height={64}
        className={`rounded-full ${sizeClasses[size]} object-cover`}
      />

      {user.isPremium && (
        <div className="absolute -top-1 -right-1">
          <PremiumBadge />
        </div>
      )}
    </div>
  );
};