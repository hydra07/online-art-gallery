import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
export function useCloudinaryAsset(path: string) {
	return useLoader(TextureLoader, path);
}
