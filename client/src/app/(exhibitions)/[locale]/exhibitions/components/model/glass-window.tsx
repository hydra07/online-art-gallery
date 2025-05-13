import { useCloudinaryGLTF } from '@/hooks/useCloudinaryGLTF';
import { MODEL_URL } from '@/utils/constants';
import { Vec3 } from '@/types/gallery';
import { useMemo } from 'react';

interface GlassWindowProps {
	position?: Vec3;
	scale?: Vec3;
	rotation?: Vec3;
}
// GlassWindow
export default function GlassWindow({
	position,
	scale,
	rotation
}: GlassWindowProps) {
	const { scene } = useCloudinaryGLTF(MODEL_URL.GLASS_WINDOW);
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
