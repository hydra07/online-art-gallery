import { useBox } from '@react-three/cannon';
import { Vec3 } from '@/types/gallery';
import * as THREE from 'three';
import { useRef } from 'react';

interface PhysicalColliderProps {
    position?: Vec3;
    rotation?: Vec3;
    args: [number, number, number];
    type?: 'Static' | 'Dynamic' | 'Kinematic';
    material?: {
        friction?: number;
        restitution?: number;
    };
    visible?: boolean;
}

export function PhysicalCollider({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    args,
    type = 'Static',
    material = {
        friction: 0.1,
        restitution: 0
    },
    visible = false
}: PhysicalColliderProps) {
    // Create separate refs - one for physics, one for mesh
    useBox(() => ({
        type,
        position: position as [number, number, number],
        rotation: rotation as [number, number, number],
        args: args as [number, number, number],
        material
    }));
    
    // Create a separate ref for the visual mesh
    const meshRef = useRef<THREE.Mesh>(null);
    
    // Only render a visual representation if visible is true
    return visible ? (
        <mesh 
            ref={meshRef} 
            position={position} 
            rotation={rotation}
        >
            <boxGeometry args={args} />
            <meshStandardMaterial 
                wireframe 
                color="#ff0000" 
                opacity={0.3} 
                transparent 
            />
        </mesh>
    ) : null;
}