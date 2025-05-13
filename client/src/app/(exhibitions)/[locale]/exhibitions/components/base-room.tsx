import { Vec3 } from '@/types/gallery';
import React from 'react';

interface BaseRoomProps {
	position: Vec3;
	dimensions: {
		width: number;
		height: number;
		depth: number;
	};
	walls?: {
		back?: React.ReactNode;
		left?: React.ReactNode;
		right?: React.ReactNode;
		front?: React.ReactNode;
	};
	floor?: React.ReactNode;
	ceiling?: React.ReactNode;
	children?: React.ReactNode;
}

export function BaseRoom({
	position,
	walls,
	floor,
	ceiling,
	children
}: BaseRoomProps) {
	return (
		<group position={position}>
			{/* Walls */}
			{walls?.back}
			{walls?.left}
			{walls?.right}
			{walls?.front}

			{/* Floor */}
			{floor}

			{/* Ceiling */}
			{ceiling}

			{/* Additional content */}
			{children}
		</group>
	);
}
