import { useEffect } from 'react';
import { useMovementControls } from './useMovementControls';

export function useMovementDetection(onMove: () => void) {
	const keys = useMovementControls();
	useEffect(() => {
		if (keys.forward || keys.backward || keys.left || keys.right) {
			onMove();
		}
	}, [keys, onMove]);
}
