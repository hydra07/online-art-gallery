import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { getCloudinaryModelUrl } from '@/utils/room-helper';

export function useCloudinaryGLTF(modelPath: string) {
	const url = useMemo(() => getCloudinaryModelUrl(modelPath), [modelPath]);
	const { scene, ...rest } = useGLTF(url);
	const clonedScene = useMemo(() => scene.clone(), [scene]);

	return { scene: clonedScene, ...rest };
}

// Preload function for models
export const preloadCloudinaryGLTF = (modelPath: string) => {
	const url = getCloudinaryModelUrl(modelPath);
	return useGLTF.preload(url);
};
