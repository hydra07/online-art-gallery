import { Vec3 } from '@/types/gallery';
import { Texture } from 'three';
import { PhysicalCollider } from './physical-collider';

interface RoomFloorProps {
	position: Vec3;
	args: [number, number, number]; //  width, height, depth
	colliderPosition: Vec3;
	material: {
		texture?: Texture;
		color?: string;
		roughness?: number;
	};
}

export function RoomFloor({
	position,
	args,
	colliderPosition,
	material
}: RoomFloorProps) {
	const rotation = [-Math.PI / 2, 0, 0] as [number, number, number];
	return (
		<>
			{/* Visual Floor */}
			<mesh
				rotation={rotation}
				position={position}
				castShadow
				receiveShadow
			>
				<boxGeometry args={args} />
				<meshStandardMaterial
					map={material.texture}
					color={material.color}
					roughness={material.roughness ?? 1}
				/>
			</mesh>

			{/* Physics Collider */}
			<PhysicalCollider
				position={colliderPosition}
				rotation={rotation}
				args={args}
				material={{ friction: 0.1, restitution: 0 }}
			/>
		</>
	);
}
