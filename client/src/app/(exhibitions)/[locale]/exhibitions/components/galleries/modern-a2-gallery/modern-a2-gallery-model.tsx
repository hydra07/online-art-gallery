"use client";
import { useGLTF } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import { PhysicalCollider } from "@/app/(exhibitions)/[locale]/exhibitions/components/physical-collider";
import * as THREE from "three";
import { useMemo } from "react";
import { MODERN_A2_GALLERY_CONFIG } from "@/utils/gallery-config";

export default function ModernA2GalleryModel() {
    const { scene } = useGLTF("/modern-a2-gallery.glb");
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    
    // Get dimensions from configuration
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { X_AXIS, Y_AXIS, Z_AXIS } = MODERN_A2_GALLERY_CONFIG.DIMENSION;
    
    // Wall thickness and height
    const WALL_THICKNESS = 0.2;
    const WALL_HEIGHT = 3;
    const CENTRAL_ELEMENT_SIZE = 4;
    
    // Position values derived from dimensions
    const halfX = X_AXIS / 2;
    const halfZ = Z_AXIS / 2;
    const floorY = 0;
    const wallY = WALL_HEIGHT / 2; // Center of wall height
    
    // Add invisible floor
    const [ref] = usePlane<THREE.Mesh>(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, floorY, 0],
        material: {
            friction: 0.1,
        },
    }));

    // Calculate wall positions and dimensions based on room configuration
    const walls = useMemo(() => [
        // Back wall
        {
            position: [0, wallY, -halfZ],
            rotation: [0, 0, 0],
            args: [X_AXIS, WALL_HEIGHT, WALL_THICKNESS],
        },
        // Front wall
        {
            position: [0, wallY, halfZ],
            rotation: [0, 0, 0],
            args: [X_AXIS, WALL_HEIGHT, WALL_THICKNESS],
        },
        // Left wall
        {
            position: [-halfX, wallY, 0],
            rotation: [0, 0, 0],
            args: [WALL_THICKNESS, WALL_HEIGHT, Z_AXIS],
        },
        // Right wall
        {
            position: [halfX, wallY, 0],
            rotation: [0, 0, 0],
            args: [WALL_THICKNESS, WALL_HEIGHT, Z_AXIS],
        },
        // Central element (custom element)
        {
            position: [0, wallY, 0],
            rotation: [0, 0, 0],
            args: [CENTRAL_ELEMENT_SIZE, WALL_HEIGHT, CENTRAL_ELEMENT_SIZE],
        }
    ], [halfX, halfZ, wallY, X_AXIS, Z_AXIS, WALL_HEIGHT]);

    return (
        <>
            <mesh ref={ref} visible={false} />
            <primitive object={clonedScene} scale={4} position={[0, 0, 0]} />
            
            {/* Dynamic physical colliders */}
            {walls.map((wall, index) => (
                <PhysicalCollider
                    key={`wall-${index}`}
                    position={wall.position as [number, number, number]}
                    rotation={wall.rotation as [number, number, number]}
                    args={wall.args as [number, number, number]}
                    visible={false}
                />
            ))}
        </>
    );
}