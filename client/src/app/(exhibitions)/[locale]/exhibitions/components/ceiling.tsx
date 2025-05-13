import React from 'react';

interface CeilingProps {
	width: number;
	height: number;
	length: number;
	color: string;
}

const Ceiling: React.FC<CeilingProps> = ({ width, height, length, color }) => {
	return (
		<mesh
			position={[0, height / 2, 0]}
			castShadow={true}
			receiveShadow={true}
		>
			<boxGeometry args={[width, 1, length]} />
			<meshStandardMaterial
				attach='material'
				color={color}
				roughness={1}
			/>
		</mesh>
	);
};

export default Ceiling;
