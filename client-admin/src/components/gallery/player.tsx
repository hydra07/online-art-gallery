import { memo } from 'react';
import { useSphere } from '@react-three/cannon';
import { useThree, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useMovementControls } from '@/hooks/useMovementControls';
import { usePhysicsSubscription } from '@/hooks/usePhysicsSubscription';
import { PHYSICS_CONFIG } from '@/utils/constants';
// import { useSmoothCamera } from "@/hooks/useSmoothCamera";

import { useSmoothControls } from '@/hooks/useSmoothControl';
import { useCameraStore } from '@/store/cameraStore';
// import { useSmoothRotation } from "@/hooks/useSmoothRotation";
// import { useAutoMovement } from "@/hooks/useAutoMovement";

interface PlayerProps {
	initialPosition?: [number, number, number];
	speed?: number;
	smoothFactor?: number;
}

const Player: React.FC<PlayerProps> = memo(
	({ initialPosition = [0, 2.5, 5], speed = 10, smoothFactor = 0.05 }) => {
		const { camera } = useThree();
		const [ref, api] = useSphere<Mesh>(() => ({
			...PHYSICS_CONFIG,
			position: initialPosition as [number, number, number],
			type: 'Dynamic'
		}));

		const keys = useMovementControls();
		const { velocity, position } = usePhysicsSubscription(api);
		const smoothVelocity = useSmoothControls(
			keys,
			camera,
			speed,
			smoothFactor
		);
		const isLocked = useCameraStore((state) => state.isLocked);

		// useSmoothRotation(camera, 0.3);

		useFrame(() => {
			if (!isLocked) {
				camera.position.set(
					position.current[0],
					position.current[1] + 2,
					position.current[2]
				);

				api.velocity.set(
					smoothVelocity.current.x,
					velocity.current[1],
					smoothVelocity.current.z
				);
			}
		});

		return <mesh ref={ref} />;
	}
);

Player.displayName = 'Player';

export default Player;
