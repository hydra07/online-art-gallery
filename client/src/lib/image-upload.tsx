// components/avatar-uploader.tsx
'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Image } from 'lucide-react';
interface ImageUploaderProps {
	onUploadSuccess: (url: string) => void;
	folder?: string;
}

export function ImageUploader({ onUploadSuccess, folder }: ImageUploaderProps) {
	return (
		<div className='z-50'>
			<CldUploadWidget
				uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET}
				signatureEndpoint='/api/sign-cloudinary-params'
				onSuccess={async (result) => {
					if (
						typeof result.info === 'object' &&
						'secure_url' in result.info &&
						typeof result.info.secure_url === 'string'
					  ) {
						const url = result.info.secure_url;
						// Check if URL ends with common image extensions
						const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
						const hasImageExtension = imageExtensions.some(ext => 
						  url.toLowerCase().endsWith(ext)
						);
						
						if (hasImageExtension) {
						  onUploadSuccess(url);
						} else {
						  // Handle non-image URL - you might want to show an error or log this
						  console.error('Uploaded file is not a recognized image format');
						  // Optionally still accept the URL or show user feedback
						}
					  }
				}}
				options={{
					singleUploadAutoClose: true,
					folder
				}}
			>
				{({ open }) => (
					<button
						type='button'
						onClick={() => open()}
						className='flex items-center justify-center rounded-full'
					>
						<Image className='' />
					</button>
				)}
			</CldUploadWidget>
		</div>
	);
}
