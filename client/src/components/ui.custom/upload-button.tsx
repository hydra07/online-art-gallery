import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadButtonProps {
	onUpload: (file: File) => Promise<void>;
	className?: string;
	children?: React.ReactNode;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
	onUpload,
	className,
	children
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			alert('Please upload an image file');
			return;
		}

		// Validate file size (5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert('File size should be less than 5MB');
			return;
		}

		try {
			setIsLoading(true);
			await onUpload(file);
		} catch (error) {
			console.error('Error uploading file:', error);
			alert('Failed to upload file');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn('relative', className)}>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				accept="image/*"
				className="hidden"
				disabled={isLoading}
			/>
			<button
				onClick={() => fileInputRef.current?.click()}
				className={cn(
					'flex items-center justify-center rounded-full',
					isLoading && 'opacity-50 cursor-not-allowed'
				)}
				disabled={isLoading}
			>
				{children || <Camera className="w-4 h-4" />}
			</button>
		</div>
	);
};
