import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3, PerspectiveCamera } from 'three';

export const useSmoothCamera = (
	targetPosition: number[],
	smoothFactor = 0.1,
	heightOffset = 2
) => {
	const currentPos = useRef(new Vector3());
	const targetPos = useRef(new Vector3());

	useFrame((state) => {
		const camera = state.camera as PerspectiveCamera;

		// Update target position
		targetPos.current.set(
			targetPosition[0],
			targetPosition[1] + heightOffset,
			targetPosition[2]
		);

		// Smooth interpolation
		currentPos.current.lerp(targetPos.current, smoothFactor);

		// Apply to camera
		camera.position.copy(currentPos.current);
	});
};
