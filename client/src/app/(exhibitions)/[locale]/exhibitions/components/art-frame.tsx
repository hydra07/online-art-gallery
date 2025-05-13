'use client';

import { useTexture } from '@react-three/drei';
import { LinearFilter } from 'three';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
interface ArtFrameProps {
	position: [number, number, number];
	rotation: [number, number, number];
	imageUrl: string;
	size?: [number, number];
}

function ArtFrameContent({
	position,
	rotation,
	imageUrl,
	size = [2, 3]
}: ArtFrameProps) {
	const texture = useTexture(imageUrl, (loadedTexture) => {
		loadedTexture.minFilter = LinearFilter;
		loadedTexture.magFilter = LinearFilter;
		loadedTexture.needsUpdate = true;
	});

	return (
		<group position={position} rotation={rotation}>
			{/* Frame */}
			<mesh position={[0, 0, -0.05]}>
				<boxGeometry args={[size[0] + 0.2, size[1] + 0.2, 0.1]} />
				<meshStandardMaterial color='#786449' />
			</mesh>

			{/* Artwork */}
			<mesh>
				<planeGeometry args={size} />
				<meshBasicMaterial map={texture} transparent />
			</mesh>
		</group>
	);
}

export function ArtFrame(props: ArtFrameProps) {
	return (
		<ErrorBoundary
			fallback={
				<mesh>
					<planeGeometry />
					<meshStandardMaterial color='red' />
				</mesh>
			}
		>
			<Suspense
				fallback={
					<mesh>
						<planeGeometry />
						<meshStandardMaterial color='gray' />
					</mesh>
				}
			>
				<ArtFrameContent {...props} />
			</Suspense>
		</ErrorBoundary>
	);
}
