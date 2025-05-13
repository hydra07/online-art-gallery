import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

export const useAutoMovement = (
	currentPosition: number[],
	targetPosition: Vector3,
	onReachTarget: () => void,
	speed: 5,
	threshold: 0.5
) => {
	const isMoving = useRef(false);
	const direction = useRef(new Vector3());
	const currentVelocity = useRef(new Vector3());

	useFrame(() => {
		if (!isMoving.current) {
			const distance = new Vector3(
				targetPosition.x - currentPosition[0],
				0,
				targetPosition.z - currentPosition[2]
			).length();

			if (distance > threshold) {
				isMoving.current = true;
			} else {
				onReachTarget();
				return;
			}
		}

		direction.current
			.set(
				targetPosition.x - currentPosition[0],
				0,
				targetPosition.z - currentPosition[2]
			)
			.normalize();

		currentVelocity.current.copy(direction.current).multiplyScalar(speed);
		return currentVelocity.current;
	});
	return currentVelocity;
};
