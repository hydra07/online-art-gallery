import { useBox } from '@react-three/cannon';
import { Vec3 } from '@/types/gallery';

interface PhysicalFloorColliderProps {
	position?: Vec3;
	rotation?: Vec3;
	args: [number, number, number];
}

export function PhysicalFloorCollider({
	position,
	rotation,
	args
}: PhysicalFloorColliderProps) {
	const physicsArgs = [args[0], args[1] || 0.2, args[2]];
	useBox(() => ({
		/* static: - Không di chuyển và không bị ảnh hưởng bởi lực (gravity, collisions)
               - dùng cho các vật thể cố định không di chuyển */
		type: 'Static',
		position: position as [number, number, number],
		rotation: rotation,
		args: physicsArgs as [number, number, number],
		material: {
			friction: 0.1,
			restitution: 0
		}
	}));

	return null;
}
