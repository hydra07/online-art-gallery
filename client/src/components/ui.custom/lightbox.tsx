import { X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface LightboxProps {
	src: string;
	alt: string;
	onClose: () => void;
}

export function Lightbox({ src, alt, onClose }: LightboxProps) {
	const [imageDimensions, setImageDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);
	const [isImageLoaded, setIsImageLoaded] = useState(false); // Trạng thái để kiểm tra xem ảnh đã tải xong chưa

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		},
		[onClose]
	);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	// Cập nhật kích thước ảnh khi ảnh được tải xong
	const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
		const img = event.currentTarget; // Use currentTarget for type safety
		setImageDimensions({
			width: img.naturalWidth,
			height: img.naturalHeight
		});
		setIsImageLoaded(true); // Đánh dấu ảnh đã tải xong
	};

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-85'
			onClick={onClose}
		>
			<div className='relative max-w-4xl max-h-[85vh] w-full h-full flex justify-center self-center'>
				{isImageLoaded && imageDimensions ? (
					<Image
						src={src}
						alt={alt}
						width={imageDimensions.width}
						height={imageDimensions.height}
						style={{
							objectFit: 'contain',
							objectPosition: 'center',
							width: 'auto',
							height: 'auto',
							maxWidth: '100%',
							maxHeight: '100%'
						}}
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw'
						onLoad={handleImageLoad}
						onClick={(e) => e.stopPropagation()}
					/>
				) : (
					<Image
						src={src}
						alt={alt}
						fill
						style={{
							objectFit: 'contain',
							objectPosition: 'center'
						}}
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw'
						className=''
						onLoad={handleImageLoad} // Dùng onLoad thay vì onLoadingComplete
						onClick={(e) => e.stopPropagation()}
					/>
				)}

				<button
					className='absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity'
					onClick={onClose}
				>
					<X size={24} />
				</button>
			</div>
		</div>
	);
}
