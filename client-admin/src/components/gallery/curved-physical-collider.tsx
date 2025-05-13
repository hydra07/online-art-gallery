import { useTrimesh } from '@react-three/cannon';
import { Vec3 } from '@/types/gallery';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';

interface CurvedPhysicalColliderProps {
    position?: Vec3;
    rotation?: Vec3;
    radius: number;
    height: number;
    segments?: number;
    arc?: number;
    type?: 'Static' | 'Dynamic' | 'Kinematic';
    material?: {
        friction?: number;
        restitution?: number;
    };
    visible?: boolean;
}

export function CurvedPhysicalCollider({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    radius = 1,
    height = 1,
    segments = 32,
    arc = Math.PI * 2,
    type = 'Static',
    material = {
        friction: 0.1,
        restitution: 0
    },
    visible = false
}: CurvedPhysicalColliderProps) {
    // Create curved geometry
    const geometry = useMemo(() => {
        const curve = new THREE.CylinderGeometry(radius, radius, height, segments, 1, true, 0, arc);
        const positions = Array.from(curve.attributes.position.array);
        const indices = Array.from(curve.index?.array || []);
        return { positions, indices };
    }, [radius, height, segments, arc]);

    // Create trimesh collider
    useTrimesh(() => ({
        type,
        args: [geometry.positions, geometry.indices],
        position: position as [number, number, number],
        rotation: rotation as [number, number, number],
        material
    }));

    // Visual representation
    const meshRef = useRef<THREE.Mesh>(null);

    return visible ? (
        <mesh
            ref={meshRef}
            position={position}
            rotation={rotation}
        >
            <cylinderGeometry 
                args={[radius, radius, height, segments, 1, true, 0, arc]} 
            />
            <meshStandardMaterial
                wireframe
                color="#ff0000"
                opacity={0.3}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    ) : null;
}