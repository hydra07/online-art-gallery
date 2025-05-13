import React from 'react';
import { Texture } from 'three';
import { Wall } from './wall';
import { Vec3 } from '@/types/gallery';
import { PhysicalCollider } from './physical-collider';

interface WindowWallProps {
    position?: Vec3;
    rotation?: Vec3;
    dimensions: {
        width: number;
        height: number;
        depth?: number;
    };
    material: {
        color: string;
        texture?: Texture;
        roughness?: number;
        metalness?: number;
        opacity?: number;
        transparent?: boolean;
    };
    windowWidth?: number;
    windowHeight?: number;
}

export function WindowWall({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    dimensions: { width, height, depth = 0.3 },
    material: { color, texture, ...restMaterial },
    windowWidth = 4,
    windowHeight = 6
}: WindowWallProps) {
    // Window positioning (centered in the wall)
    const windowCenterX = 0;
    // const windowCenterY = 0;

    // Calculate wall dimensions based on window size
    const leftSectionWidth = (width / 2) - (windowWidth / 2);
    const rightSectionWidth = (width / 2) - (windowWidth / 2);
    const topSectionHeight = (height - windowHeight) / 2;
    const bottomSectionHeight = (height - windowHeight) / 2;

    return (
        <group position={position} rotation={rotation}>
            {/* Left side of window */}
            <Wall
                position={[-width / 2 + leftSectionWidth / 2, 0, 0]}
                dimensions={{
                    width: leftSectionWidth,
                    height: height,
                    depth: depth
                }}
                material={{ color, texture, ...restMaterial }}
                options={{
                    hasCollider: false
                }}

            />

            {/* Right side of window */}
            <Wall
                position={[width / 2 - rightSectionWidth / 2, 0, 0]}
                dimensions={{
                    width: rightSectionWidth,
                    height: height,
                    depth: depth
                }}
                material={{ color, texture, ...restMaterial }}
                options={{
                    hasCollider: false
                }}

            />

            {/* Top section above window */}
            <Wall
                position={[windowCenterX, height / 2 - topSectionHeight / 2, 0]}
                dimensions={{
                    width: windowWidth,
                    height: topSectionHeight,
                    depth: depth
                }}
                material={{ color, texture, ...restMaterial }}
                options={{
                    hasCollider: false
                }}
            />

            {/* Bottom section below window */}
            <Wall
                position={[windowCenterX, -height / 2 + bottomSectionHeight / 2, 0]}
                dimensions={{
                    width: windowWidth,
                    height: bottomSectionHeight,
                    depth: depth
                }}
                material={{ color, texture, ...restMaterial }}
                options={{
                    hasCollider: false
                }}
            />
            <PhysicalCollider
                position={position}
                rotation={rotation}
                args={[width, height, depth]}
                material={{ friction: 0.1, restitution: 0 }}
            />
        </group>
    );
}