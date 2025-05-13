import React from 'react';
import { Texture } from 'three';
import { Wall } from './wall';

interface DoorWallProps {
	dimensions: {
		width: number;
		height: number;
		length: number;
	};
	material: {
		color: string;
		texture?: Texture;
		roughness?: number;
		metalness?: number;
		opacity?: number;
		transparent?: boolean;
	};
}

export function DoorWall({
	dimensions: { width, height, length },
	material: { color, texture }
}: DoorWallProps) {
	const wallWidth = length / 3 + 3.5;
	const wallHeight = (height * 2) / 3;
	const wallDepth = 0.3;
	const topHeight = height / 3;
	const xPosition = width / 2;
	const yPosition = wallHeight / 2;
	const yTopPosition = height - topHeight / 2;

	return (
		<group>
			{/* Right Section */}
			<Wall
				position={[xPosition, yPosition, length / 2 - 8.5]}
				rotation={[0, -Math.PI / 2, 0]}
				dimensions={{
					width: wallWidth,
					height: wallHeight,
					depth: wallDepth
				}}
				material={{ color, texture }}
			/>

			{/* Left Section */}
			<Wall
				position={[xPosition, yPosition, -length / 2 + 8.5]}
				rotation={[0, -Math.PI / 2, 0]}
				dimensions={{
					width: wallWidth,
					height: wallHeight,
					depth: wallDepth
				}}
				material={{ color, texture }}
			/>

			{/* Top Section */}
			<Wall
				position={[xPosition, yTopPosition, 0]}
				rotation={[0, -Math.PI / 2, 0]}
				dimensions={{
					width: length,
					height: topHeight,
					depth: wallDepth
				}}
				material={{ color, texture }}
			/>
		</group>
	);
}
