'use client';
import { CldUploadWidget, CldUploadWidgetPropsChildren, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { ReactElement } from 'react';

interface CloudinaryUploadProps {
    onUploadSuccess: (result: CloudinaryUploadWidgetResults) => void;
    children: (props: CldUploadWidgetPropsChildren) => ReactElement;
    options?: {
        maxFiles?: number;
        resourceType?: string;
        folder?: string;
        clientAllowedFormats?: string[];
        maxFileSize?: number;
        sources?: Array<'local' | 'camera' | 'url' | 'image_search' | 'google_drive' | 'dropbox' | 'facebook' | 'instagram' | 'shutterstock' | 'istock' | 'unsplash' | 'gettyimages'>;
    };
}

export function CloudinaryUpload({
    onUploadSuccess,
    children,
    options = {}
}: CloudinaryUploadProps) {
    const defaultOptions = {
        maxFiles: 1,
        resourceType: "image",
        folder: "avatars",
        clientAllowedFormats: ["png", "jpeg", "jpg"],
        maxFileSize: 5000000, // 5MB
        sources: ['local', 'camera'] as Array<'local' | 'camera'>,
        styles: {
            palette: {
                window: "#FFFFFF",
                windowBorder: "#90A0B3",
                tabIcon: "#0078FF",
                menuIcons: "#5A616A",
                textDark: "#000000",
                textLight: "#FFFFFF",
                link: "#0078FF",
                action: "#FF620C",
                inactiveTabIcon: "#0E2F5A",
                error: "#F44235",
                inProgress: "#0078FF",
                complete: "#20B832",
                sourceBg: "#E4EBF1"
            }
        }
    };

    return (
        <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET || 'ml_default'}
            signatureEndpoint="/api/sign-cloudinary-params"
            onSuccess={onUploadSuccess}
            options={{
                ...defaultOptions,
                ...options
            }}
        >
            {children}
        </CldUploadWidget>
    );
}