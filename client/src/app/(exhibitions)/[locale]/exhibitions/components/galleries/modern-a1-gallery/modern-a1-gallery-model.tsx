"use client";
import { useGLTF } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import { PhysicalCollider } from "@/app/(exhibitions)/[locale]/exhibitions/components/physical-collider";
import * as THREE from "three";
import { useMemo } from "react";

export default function ModernA1GalleryModel() {
    const { scene } = useGLTF("/modern-a1-gallery.glb");
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // Add invisible floor
    const [ref] = usePlane<THREE.Mesh>(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, 0, 0],
        material: {
            friction: 0.1,
        },
    }));

    return (
        <>
            <ambientLight
                intensity={2}
                color={'#ffffff'}
            />
            <mesh ref={ref} visible={false} />
            <primitive object={clonedScene} scale={3} position={[0, 0, 0]} />
            
            {/* Hardcoded physical colliders */}
            <PhysicalCollider
                position={[0, 1.5, -15]}
                rotation={[0, 0, 0]}
                args={[20, 3, 0.2]}
                visible={false} // Set to true for debugging
            />
            <PhysicalCollider
                position={[0, 1.5, 15]}
                rotation={[0, 0, 0]}
                args={[20, 3, 0.2]}
                visible={false}
            />
            <PhysicalCollider
                position={[-10, 1.5, 0]}
                rotation={[0, 0, 0]}
                args={[0.2, 3, 28]}
                visible={false}
            />
            <PhysicalCollider
                position={[10, 1.5, 0]}
                rotation={[0, 0, 0]}
                args={[0.2, 3, 28]}
                visible={false}
            />
            {/* Add any additional colliders as needed */}
        </>
    );
}