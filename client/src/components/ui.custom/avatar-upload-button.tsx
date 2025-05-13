'use client';
import { Camera } from 'lucide-react';
import { CloudinaryUpload } from './cloudinary-upload';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';

interface AvatarUploadButtonProps {
    onUploadSuccess: (result: CloudinaryUploadWidgetResults) => void;
    className?: string;
}

export function AvatarUploadButton({ onUploadSuccess, className }: AvatarUploadButtonProps) {
    return (
        <CloudinaryUpload
            onUploadSuccess={onUploadSuccess}
            options={{
                folder: "avatars",
                maxFiles: 1,
                clientAllowedFormats: ["png", "jpeg", "jpg"],
                maxFileSize: 5000000 // 5MB
            }}
        >
            {({ open }) => (
                <button
                    onClick={() => open()}
                    className={`w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center p-0 shadow-lg border-2 border-white ${className}`}
                >
                    <Camera className="w-4 h-4 text-white" />
                </button>
            )}
        </CloudinaryUpload>
    );
} 