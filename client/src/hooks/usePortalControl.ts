import { useThree } from '@react-three/fiber';
import { useCallback, useEffect } from 'react';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

interface UsePortalControlsProps {
	isOpen: boolean;
	onClose: () => void;
}

export function usePortalControls({ isOpen, onClose }: UsePortalControlsProps) {
	const { controls } = useThree<{ controls: PointerLockControls }>();

	const unlockControls = useCallback(() => {
		if (controls) {
			controls.unlock?.();
			controls.enabled = true; // Keep controls enabled
			document.body.style.cursor = 'auto';
		}
	}, [controls]);

	// const lockControls = useCallback(() => {
	//   if (controls) {
	//     document.body.style.cursor = "none";
	//     // Small delay to ensure cursor is hidden before locking
	//     controls.enabled = true; // Enable lại controls
	//     setTimeout(() => {
	//       controls.lock?.();
	//     }, 100);
	//   }
	// }, [controls]);
	const lockControls = useCallback(() => {
		if (controls) {
			document.body.style.cursor = 'none';
			controls.enabled = true;
			controls.lock();
		}
	}, [controls]);

	// Handle controls state
	useEffect(() => {
		if (isOpen) {
			unlockControls();
		} else {
			lockControls();
		}

		// Cleanup khi component unmount
		return () => {
			lockControls();
		};
	}, [isOpen, unlockControls, lockControls]);

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		window.addEventListener('keydown', handleEscape);
		return () => {
			window.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, onClose]);

	return { unlockControls, lockControls };
}
