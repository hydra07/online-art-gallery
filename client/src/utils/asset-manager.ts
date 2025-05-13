import { cache } from 'react';

export const MODEL_PATHS = {
	SPIRAL_STAIR: '/models/spiral_stair/spiral_stair.gltf',
	DC_STAIR: '/models/dc_stair/dc_stair.glb',
	RAILING: '/models/railing/railing.glb'
} as const;

export const TEXTURE_PATHS = {
	FLOOR: '/models/textures/floor.jpg',
	WALL: '/models/textures/white-wall.jpg'
} as const;

// Cache asset loading results
export const getAssetCache = cache(() => {
	const cache = new Map<string, unknown>();
	return {
		get: <T>(key: string): T | undefined => cache.get(key) as T | undefined,
		set: (key: string, value: unknown) => cache.set(key, value),
		has: (key: string) => cache.has(key),
		clear: () => cache.clear()
	};
});
