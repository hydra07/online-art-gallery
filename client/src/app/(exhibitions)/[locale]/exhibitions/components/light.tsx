import React, { useRef, useEffect } from 'react';
import { useThree, extend } from '@react-three/fiber';
import {
	DirectionalLight,
	DirectionalLightHelper,
	PCFSoftShadowMap
} from 'three';

// Ensure DirectionalLightHelper is extended
extend({ DirectionalLightHelper });

const Light = () => {
	const directionalLightRef = useRef<DirectionalLight>(null);
	const { gl } = useThree();

	useEffect(() => {
		const light = directionalLightRef.current;

		if (light) {
			// Ensure renderer supports shadows
			gl.shadowMap.enabled = true;
			gl.shadowMap.type = PCFSoftShadowMap; // Optional: for better shadow quality

			// Configure light for shadows
			light.castShadow = true;

			// Detailed shadow camera configuration
			const shadowCamera = light.shadow.camera;
			shadowCamera.left = -50;
			shadowCamera.right = 50;
			shadowCamera.top = 50;
			shadowCamera.bottom = -50;
			shadowCamera.near = 0.5;
			shadowCamera.far = 500;

			// Increase shadow map resolution
			light.shadow.mapSize.width = 2048;
			light.shadow.mapSize.height = 2048;

			// Update shadow camera
			shadowCamera.updateProjectionMatrix();
		}
	}, [gl]);

	return (
		<>
			<directionalLight
				ref={directionalLightRef}
				position={[15, 30, 60]}
				intensity={3}
				color={0xffffff}
				// Explicitly set shadow properties
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				shadow-camera-far={500}
				shadow-camera-near={0.5}
				shadow-camera-top={50}
				shadow-camera-bottom={-50}
				shadow-camera-right={50}
				shadow-camera-left={-50}
				castShadow
			/>
			{directionalLightRef.current && (
				<directionalLightHelper
					args={[directionalLightRef.current, 10, 0xff0000]}
				/>
			)}
		</>
	);
};

export default Light;
