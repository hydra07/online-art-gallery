import React, { useRef, useEffect } from 'react';
import { useThree, extend } from '@react-three/fiber';
import {
	DirectionalLight,
	DirectionalLightHelper,
	PCFSoftShadowMap
} from 'three';
import { LightConfig } from '@/utils/light-config';

// Extend DirectionalLightHelper for usage
extend({ DirectionalLightHelper });

interface RoomLightsProps {
	config: LightConfig;
	debug?: boolean;
}

export function RoomLights({ config, debug = false }: RoomLightsProps) {
	const directionalLightRef = useRef<DirectionalLight>(null);
	const { gl } = useThree();

	// Configure shadows and light settings
	useEffect(() => {
		const light = directionalLightRef.current;

		if (light) {
			// Enable shadow mapping
			gl.shadowMap.enabled = true;
			gl.shadowMap.type = PCFSoftShadowMap;

			// Configure light for shadows
			light.castShadow = true;

			// Configure shadow camera
			const shadowCamera = light.shadow.camera;
			shadowCamera.left = -50;
			shadowCamera.right = 50;
			shadowCamera.top = 50;
			shadowCamera.bottom = -50;
			shadowCamera.near = 0.5;
			shadowCamera.far = 500;

			// Set shadow map resolution
			light.shadow.mapSize.width = 2048;
			light.shadow.mapSize.height = 2048;

			// Update shadow camera
			shadowCamera.updateProjectionMatrix();
		}
	}, [gl]);

	return (
		<>
			{config.ambient && (
				<ambientLight
					intensity={config.ambient.intensity}
					color={config.ambient.color}
				/>
			)}

			{config.directional && (
				<directionalLight
					ref={directionalLightRef}
					position={config.directional.position}
					intensity={config.directional.intensity}
					color={config.directional.color}
					castShadow
					shadow-mapSize-width={2048}
					shadow-mapSize-height={2048}
					shadow-camera-far={500}
					shadow-camera-near={0.5}
					shadow-camera-top={50}
					shadow-camera-bottom={-50}
					shadow-camera-right={50}
					shadow-camera-left={-50}
				/>
			)}

			{/* DirectionalLight Helper */}
			{debug && directionalLightRef.current && (
				<directionalLightHelper
					args={[directionalLightRef.current, 10, 0xff0000]}
				/>
			)}

			{/* Other lights */}
			{config.spots?.map((spot, index) => (
				<spotLight
					key={`spot-${index}`}
					position={spot.position}
					intensity={spot.intensity}
					color={spot.color}
					angle={spot.angle}
					penumbra={spot.penumbra}
					castShadow={spot.castShadow}
				/>
			))}

			{config.points?.map((point, index) => (
				<pointLight
					key={`point-${index}`}
					position={point.position}
					intensity={point.intensity}
					color={point.color}
					distance={point.distance}
					decay={point.decay}
				/>
			))}

			{config.hemisphere && (
				<hemisphereLight
					intensity={config.hemisphere.intensity}
					color={config.hemisphere.color}
					groundColor={config.hemisphere.groundColor}
				/>
			)}
		</>
	);
}
