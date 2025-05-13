// import { useGLTF } from "@react-three/drei";
import { useMemo } from 'react';
import { Vec3 } from '@/types/gallery';
import { useCloudinaryGLTF } from '@/hooks/useCloudinaryGLTF';
import { MODEL_URL } from '@/utils/constants';

interface GlassWindowProps {
	position?: Vec3;
	scale?: Vec3;
	rotation?: Vec3;
}

// GlassWindow2
export default function GlassWindow2({
	position,
	scale,
	rotation
}: GlassWindowProps) {
	const { scene } = useCloudinaryGLTF(MODEL_URL.GLASS_WINDOW_2);
	const clonedScene = useMemo(() => scene.clone(), [scene]);

	return (
		<primitive
			object={clonedScene}
			position={position}
			scale={scale}
			rotation={rotation}
		/>
	);
}
