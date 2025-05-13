// src/components/spiral-stair.tsx
'use client';
import { Vec3 } from '@/types/gallery';
import { useEffect, useMemo } from 'react';
import { Mesh } from 'three';
import { MODEL_URL } from '@/utils/constants';
import { useCloudinaryGLTF } from '@/hooks/useCloudinaryGLTF';

interface RailingProps {
	position?: Vec3;
	scale?: Vec3 | number;
	rotation?: Vec3;
}
// SpiralStair
export function Railing({
	position = [1.5, 0, 5],
	scale = 0.7,
	rotation = [0, 0, 0]
}: RailingProps) {
	const { scene } = useCloudinaryGLTF(MODEL_URL.RAILING);
	const clonedScene = useMemo(() => scene.clone(), [scene]);

	useEffect(() => {
		clonedScene.traverse((child: { castShadow: boolean }) => {
			if (child instanceof Mesh) {
				child.castShadow = true;
				// child.receiveShadow = true
			}
		});
	}, [clonedScene]);
	return (
		<primitive
			object={clonedScene}
			position={position}
			// scale={[2,3,3]}
			scale={scale}
			rotation={rotation}
		/>
	);
}
