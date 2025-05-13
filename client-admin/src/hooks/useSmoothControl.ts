import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Camera, Vector3 } from 'three';

export const useSmoothControls = (
	keys: {
		forward: boolean;
		backward: boolean;
		left: boolean;
		right: boolean;
	},
	camera: Camera,
	speed = 8, // Reduced base speed
	smoothFactor = 0.05 // Increased smoothing
) => {
	const currentVelocity = useRef(new Vector3());
	const targetVelocity = useRef(new Vector3());
	const acceleration = useRef(new Vector3());

	useFrame((state, delta) => {
		const frontVector = new Vector3();
		const sideVector = new Vector3();
		const direction = new Vector3();

		// Calculate target velocity
		if (keys.forward) frontVector.add(camera.getWorldDirection(direction));
		if (keys.backward) frontVector.sub(camera.getWorldDirection(direction));
		if (keys.left) {
			sideVector.sub(
				camera.getWorldDirection(direction).cross(camera.up)
			);
		}
		if (keys.right) {
			sideVector.add(
				camera.getWorldDirection(direction).cross(camera.up)
			);
		}

		// Calculate target velocity with normalized direction
		targetVelocity.current
			.subVectors(frontVector, sideVector)
			.normalize()
			.multiplyScalar(speed);

		// Calculate acceleration
		acceleration.current
			.subVectors(targetVelocity.current, currentVelocity.current)
			.multiplyScalar(smoothFactor);

		// Apply acceleration to current velocity
		currentVelocity.current.add(
			acceleration.current.multiplyScalar(delta * 60)
		);

		// Apply damping when no input
		if (frontVector.length() === 0 && sideVector.length() === 0) {
			currentVelocity.current.multiplyScalar(0.95);
		}

		return currentVelocity.current;
	});

	return currentVelocity;
};
