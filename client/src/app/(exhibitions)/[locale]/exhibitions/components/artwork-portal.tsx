import { useMovementDetection } from '@/hooks/useMovementDetection';
import { useRaycaster } from '@/hooks/useRaycaster';
import { usePortalControls } from '@/hooks/usePortalControl';
import { Html } from '@react-three/drei';
import { PropsWithChildren, useCallback, useRef } from 'react';
import { Mesh } from 'three';
import { useThree } from '@react-three/fiber';

// Props interface cho ArtworkPortal component
interface IPortalProps {
	isOpen: boolean; // Trạng thái mở/đóng của portal
	onClose: () => void; // Hàm callback khi đóng portal
}

/**
 * ArtworkPortal component - Hiển thị nội dung trong một portal overlay
 *
 * @param isOpen - Boolean để kiểm soát việc hiển thị portal
 * @param onClose - Callback function được gọi khi đóng portal
 * @param children - Nội dung bên trong portal
 */
export function ArtworkPortal({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	isOpen,
	onClose,
	children
}: PropsWithChildren<IPortalProps>) {
	usePortalControls({
		isOpen,
		onClose
	});
	const closeButtonRef = useRef<Mesh>(null);

	const handleClose = useCallback(() => {
		onClose();
	}, [onClose]);

	useMovementDetection(handleClose);

	useRaycaster({
		meshRef: closeButtonRef,
		onIntersect: handleClose
	});
	const { size } = useThree();

	return (
		// Html component từ drei để render HTML trong Three.js scene
		<Html
			center
			fullscreen
			style={{
				width: '100vw',
				height: '100vh',
				position: 'fixed',
				display: 'flex',
				alignItems: 'flex-end',
				justifyContent: 'center',
				pointerEvents: 'auto'
			}}
			transform={false}
			calculatePosition={() => {
				// Tính toán rotation để luôn quay về phía camera
				return [size.width / 2, size.height, 0];
			}}
		>
			{/* Overlay container chiếm toàn màn hình */}
			<div
				className='w-full flex justify-center pointer-events-auto'
				onClick={(e) => {
					e.stopPropagation(); // Ngăn sự kiện click bubble lên
					onClose(); // Gọi hàm onClose khi click vào overlay
				}}
			>
				{/* Content container với style */}
				<div
					onClick={(e) => e.stopPropagation()} // Ngăn click bubble để không đóng khi click vào content
				>
					{children}
				</div>
			</div>
		</Html>
	);
}
