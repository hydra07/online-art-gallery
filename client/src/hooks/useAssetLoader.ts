import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { TextureLoader } from 'three';
// import { preloadAssets } from '@/utils/preload-assets';
import { MODEL_PATHS, TEXTURE_PATHS } from '@/utils/asset-manager';

interface AssetPreloaderOptions {
	onProgress?: (progress: number) => void;
	onComplete?: () => void;
	onError?: (error: Error) => void;
}

export function useAssetPreloader(options: AssetPreloaderOptions = {}) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const loadAssets = async () => {
			try {
				// Start preloading models
				const modelPromises = Object.entries(MODEL_PATHS).map(
					([key, path]) => {
						return new Promise((resolve) => {
							useGLTF.preload(path);
							resolve(key);
						});
					}
				);

				// Start preloading textures
				const textureLoader = new TextureLoader();
				const texturePromises = Object.entries(TEXTURE_PATHS).map(
					([key, path]) => {
						return new Promise((resolve) => {
							textureLoader.load(path, () => resolve(key));
						});
					}
				);

				const totalAssets =
					modelPromises.length + texturePromises.length;
				let loadedAssets = 0;

				// Create a promise that tracks progress
				const trackProgress = (promises: Promise<unknown>[]) => {
					return promises.map((promise) =>
						promise.then((result) => {
							loadedAssets++;
							const currentProgress =
								(loadedAssets / totalAssets) * 100;
							setProgress(currentProgress);
							options.onProgress?.(currentProgress);
							return result;
						})
					);
				};

				// Wait for all assets to load
				await Promise.all([
					...trackProgress(modelPromises),
					...trackProgress(texturePromises)
				]);

				setIsLoaded(true);
				options.onComplete?.();
			} catch (err) {
				const error =
					err instanceof Error
						? err
						: new Error('Failed to load assets');
				setError(error);
				options.onError?.(error);
			}
		};

		loadAssets();
	}, [options]);

	return { isLoaded, error, progress };
}
