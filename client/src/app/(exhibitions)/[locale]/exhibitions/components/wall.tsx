import React from 'react';
import { Texture } from 'three';
import { PhysicalCollider } from './physical-collider';

interface WallProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    material: {
        color: string;
        texture?: Texture;
        roughness?: number;
        metalness?: number;
        opacity?: number;
        transparent?: boolean;
    };
    options?: {
        castShadow?: boolean;
        receiveShadow?: boolean;
        hasCollider?: boolean;
        colliderPosition?: [number, number, number];
        showCollider?: boolean; // For debugging
    };
}

export function Wall({
    position,
    rotation = [0, 0, 0],
    dimensions: { width, height, depth },
    material: {
        color,
        texture,
        roughness = 1,
        metalness = 0.1,
        opacity = 1,
        transparent = true
    },
    options: { 
        castShadow = true, 
        receiveShadow = true,
        hasCollider = true,
        colliderPosition,
        showCollider = false
    } = {}
}: WallProps) {
    // Use provided collider position or default to the wall's position
    const actualColliderPosition = colliderPosition || position;

    return (
        <>
            {/* Visual Wall */}
            <mesh
                position={position}
                rotation={rotation}
                castShadow={castShadow}
                receiveShadow={receiveShadow}
            >
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial
                    color={color}
                    map={texture}
                    flatShading={true}
                    roughness={roughness}
                    metalness={metalness}
                    opacity={opacity}
                    transparent={transparent}
                />
            </mesh>

            {/* Physics Collider (only if requested) */}
            {hasCollider && (
                <PhysicalCollider
                    position={actualColliderPosition}
                    rotation={rotation}
                    args={[width, height, depth]}
                    material={{ friction: 0.1, restitution: 0 }}
                    visible={showCollider} // Make visible for debugging
                />
            )}
        </>
    );
}
