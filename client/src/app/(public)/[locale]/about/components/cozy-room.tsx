import React, { useMemo } from 'react';
import { BaseRoom } from '@/app/(exhibitions)/[locale]/exhibitions/components/base-room';
import { Wall } from '@/app/(exhibitions)/[locale]/exhibitions/components/wall';
import { RoomFloor } from '@/app/(exhibitions)/[locale]/exhibitions/components/room-floor';
import { COZY_A1_ROOM_CONFIG } from '@/utils/gallery-config';
import { Vec3 } from '@/types/gallery';
import { useCloudinaryAsset } from '@/hooks/useCloudinaryAsset';
import { TEXTURE_URL } from '@/utils/constants';
import CozyA1Ceilling from '@/app/(exhibitions)/[locale]/exhibitions/components/galleries/cozy-gallery/cozy-gallery-ceilling';
import { Environment } from '@react-three/drei';
import { RoomLights } from '@/app/(exhibitions)/[locale]/exhibitions/components/room-light';
import { WindowWall } from '@/app/(exhibitions)/[locale]/exhibitions/components/window-wall';
import { ArtworkMesh } from '@/app/(exhibitions)/[locale]/exhibitions/components/art-work-mesh';
import { calculateWallArtworkPositions } from '@/utils/room-helper';

export default function CozyGallery() {
    const { X_AXIS, Y_AXIS, Z_AXIS } = COZY_A1_ROOM_CONFIG.DIMENSION;
    const roomDimensions = { 
        xAxis: X_AXIS, 
        yAxis: Y_AXIS, 
        zAxis: Z_AXIS 
    };

    // Calculate positions for artwork on walls
    const mainWallResult = calculateWallArtworkPositions({
        wallType: 'back',
        wallDimension: X_AXIS,
        artworkCount: 3,
        roomDimensions
    });
    
    const leftWallResult = calculateWallArtworkPositions({
        wallType: 'left',
        wallDimension: Z_AXIS,
        artworkCount: 2,
        roomDimensions
    });
    
    const rightWallResult = calculateWallArtworkPositions({
        wallType: 'right',
        wallDimension: Z_AXIS,
        artworkCount: 2,
        roomDimensions
    });
    
    const centerWallFrontResult = calculateWallArtworkPositions({
        wallType: 'custom',
        wallDimension: Z_AXIS / 2,
        artworkCount: 1,
        roomDimensions,
        wallPosition: [0, Y_AXIS/4, 0],
        wallRotation: [0, Math.PI / 2, 0],
        offsetDirection: [1, 0, 0],
        heightPosition: Y_AXIS/4 + 1
    });
    
    const centerWallBackResult = calculateWallArtworkPositions({
        wallType: 'custom',
        wallDimension: Z_AXIS / 2,
        artworkCount: 1,
        roomDimensions,
        wallPosition: [0, Y_AXIS/4, 0],
        wallRotation: [0, -Math.PI / 2, 0], 
        offsetDirection: [-1, 0, 0],
        heightPosition: Y_AXIS/4 + 1
    });

    // High-quality textures for modern gallery
    const darkGreyConcreteTexture = useCloudinaryAsset(TEXTURE_URL.DARK_GREY_CONCRETE_TEXTURE);
    const greyConcreteTexture = useCloudinaryAsset(TEXTURE_URL.GREY_CONCRETE_TEXTURE);

    // Modern exhibition room configuration
    const exhibitionRoom = useMemo(
        () => ({
            position: [0, 0, 0] as Vec3,
            // Gallery grey floor
            floor: {
                component: (
                    <RoomFloor
                        position={[0, 0, 0]}
                        colliderPosition={[0, 0, 0]}
                        args={[X_AXIS, Z_AXIS, 0.1]}
                        material={{
                            texture: darkGreyConcreteTexture,
                            color: '#9C9C9C',
                            roughness: 0.8, // Polished finish
                            //   metalness: 0.05
                        }}
                    />
                )
            },
            walls: {
                // Main exhibition wall (back)
                back: (
                    <Wall
                        position={[0, Y_AXIS / 2, -Z_AXIS / 2]}
                        dimensions={{
                            width: X_AXIS,
                            height: Y_AXIS,
                            depth: 0.15
                        }}
                        material={{
                            color: '#ffffff',
                            texture: greyConcreteTexture,
                            roughness: 0.9, // Matte finish ideal for art display
                            metalness: 0
                        }}
                    />
                ),
                // Left exhibition wall
                left: (
                    <Wall
                        position={[-X_AXIS / 2, Y_AXIS / 2, 0]}
                        rotation={[0, Math.PI / 2, 0]}
                        dimensions={{
                            width: Z_AXIS,
                            height: Y_AXIS,
                            depth: 0.15
                        }}
                        material={{
                            color: '#ffffff',
                            texture: greyConcreteTexture,
                            roughness: 0.9,
                            metalness: 0
                        }}
                    />
                ),
                // Right exhibition wall
                right: (
                    <Wall
                        position={[X_AXIS / 2, Y_AXIS / 2, 0]}
                        rotation={[0, -Math.PI / 2, 0]}
                        dimensions={{
                            width: Z_AXIS,
                            height: Y_AXIS,
                            depth: 0.15
                        }}
                        material={{
                            color: '#ffffff',
                            texture: greyConcreteTexture,
                            roughness: 0.9,
                            metalness: 0
                        }}
                    />
                ),
                // Entrance wall with wide opening
                front: (
                    <WindowWall
                    position={[0, Y_AXIS / 2, Z_AXIS / 2]}
                    rotation={[0, Math.PI, 0]}
                    dimensions={{
                        width: X_AXIS,
                        height: Y_AXIS,
                        depth: 0.2
                    }}
                    material={{
                        color: '#f0f0f0',
                        texture: greyConcreteTexture,
                        roughness: 1,
                        metalness: 0.1
                    }}
                    windowWidth={4}
                    windowHeight={6}
                />
                )
            },
            ceiling: {
                component: (
                    <CozyA1Ceilling />
                )
            },
            // Artwork configuration for main wall
      mainWallArtworks: [
                {
                    id: '1',
                    artwork: {
                        _id: '1',
                        title: 'Abstract Landscape',
                        description: 'A vibrant abstract representation of a natural landscape.',
                        category: ['abstract', 'landscape'],
                        dimensions: { width: 600, height: 400 },
                        lowResUrl: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=400&q=80",
                        status: 'active',
                        views: 120,
                        price: 2500,
                        artistId: 'artist1'
                    },
                    placement: {
                        position: mainWallResult.positions[0],
                        rotation: mainWallResult.rotations[0]
                    }
                },
                {
                    id: '2',
                    artwork: {
                        _id: '2',
                        title: 'Urban Geometry',
                        description: 'A study in geometric shapes inspired by urban architecture.',
                        category: ['modern', 'geometry'],
                        dimensions: { width: 500, height: 500 },
                        lowResUrl: "https://images.unsplash.com/photo-1460411794035-42aac080490a?w=400&q=80",
                        status: 'active',
                        views: 87,
                        price: 1800,
                        artistId: 'artist2'
                    },
                    placement: {
                        position: mainWallResult.positions[1],
                        rotation: mainWallResult.rotations[1]
                    }
                },
                {
                    id: '3',
                    artwork: {
                        _id: '3',
                        title: 'Serenity',
                        description: 'A calming piece representing inner peace and tranquility.',
                        category: ['abstract', 'minimal'],
                        dimensions: { width: 700, height: 500 },
                        lowResUrl: "https://images.unsplash.com/photo-1552083974-186346191183?w=400&q=80",
                        status: 'active',
                        views: 215,
                        price: 3000,
                        artistId: 'artist1'
                    },
                    placement: {
                        position: mainWallResult.positions[2],
                        rotation: mainWallResult.rotations[2]
                    }
                }
            ],
            // Artwork configuration for left wall
            leftWallArtworks: [
                {
                    id: '4',
                    artwork: {
                        _id: '4',
                        title: 'Composition in Blue',
                        description: 'An exploration of blue tones and their emotional resonance.',
                        category: ['color study', 'abstract'],
                        dimensions: { width: 600, height: 450 },
                        lowResUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&q=80",
                        status: 'active',
                        views: 75,
                        price: 1900,
                        artistId: 'artist3'
                    },
                    placement: {
                        position: leftWallResult.positions[0],
                        rotation: leftWallResult.rotations[0]
                    }
                },
                {
                    id: '5',
                    artwork: {
                        _id: '5',
                        title: 'Forest Dreams',
                        description: 'An impressionist view of a mystical forest scene.',
                        category: ['landscape', 'impressionist'],
                        dimensions: { width: 550, height: 700 },
                        lowResUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80",
                        status: 'active',
                        views: 142,
                        price: 2200,
                        artistId: 'artist2'
                    },
                    placement: {
                        position: leftWallResult.positions[1],
                        rotation: leftWallResult.rotations[1]
                    }
                }
            ],
            // Artwork configuration for right wall
            rightWallArtworks: [
               
             
            ],
            // Center wall artworks
            centerWallArtworks: [
                {
                    id: '9',
                    artwork: {
                        _id: '9',
                        title: 'Circular Motion',
                        description: 'A study of movement and circular patterns in nature.',
                        category: ['kinetic', 'natural'],
                        dimensions: { width: 500, height: 500 },
                        lowResUrl: "https://images.unsplash.com/photo-1501446529957-6226bd447c46?w=400&q=80",
                        status: 'active',
                        views: 97,
                        price: 2100,
                        artistId: 'artist3'
                    },
                    placement: {
                        position: centerWallFrontResult.positions[0],
                        rotation: centerWallFrontResult.rotations[0]
                    }
                },
                {
                    id: '10',
                    artwork: {
                        _id: '10',
                        title: 'Geometric Dreams',
                        description: 'Pure geometric abstraction exploring form and color.',
                        category: ['geometric', 'abstract'],
                        dimensions: { width: 600, height: 600 },
                        lowResUrl: "https://images.unsplash.com/photo-1605106702734-205df224ecce?w=400&q=80",
                        status: 'active',
                        views: 136,
                        price: 2300,
                        artistId: 'artist2'
                    },
                    placement: {
                        position: centerWallBackResult.positions[0],
                        rotation: centerWallBackResult.rotations[0]
                    }
                }
            ]
        }),
        [
            X_AXIS,
            Y_AXIS,
            Z_AXIS,
            mainWallResult,
            leftWallResult,
            rightWallResult,
            centerWallFrontResult,
            centerWallBackResult,
            darkGreyConcreteTexture,
            greyConcreteTexture,
        ]
    );

    const exhibitionModels = useMemo(
        () => [
            <Wall
            key={'center-wall'}
            position={[0, Y_AXIS/4, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            dimensions={{
                width: Z_AXIS / 2,
                height: Y_AXIS / 2,
                depth: 0.15
            }}
            material={{
                color: '#ffffff',
                texture: greyConcreteTexture,
                roughness: 0.9,
                metalness: 0
            }}
            
        />
        ],
        [Y_AXIS, Z_AXIS, greyConcreteTexture]
    );
    const LIGHT_CONFIG = {
        ambient: {
            intensity: COZY_A1_ROOM_CONFIG.LIGHTING.AMBIENT.INTENSITY,
            color: COZY_A1_ROOM_CONFIG.LIGHTING.AMBIENT.COLOR
        }
    }
    return (
        <>
            <Environment near={100} far={100000} files={'/autumn.jpg'} environmentIntensity={0} background/>
            <group>
                <RoomLights config={LIGHT_CONFIG} debug={false} />
                <BaseRoom
                    key="modern-exhibition"
                    position={exhibitionRoom.position}
                    dimensions={{
                        width: X_AXIS,
                        height: Y_AXIS,
                        depth: Z_AXIS
                    }}
                    floor={exhibitionRoom.floor.component}
                    ceiling={exhibitionRoom.ceiling.component}
                    walls={exhibitionRoom.walls}
                >
                    {/* Main wall artworks */}
                    {exhibitionRoom.mainWallArtworks.map((galleryArtwork) => (
                        <ArtworkMesh
                            key={galleryArtwork.id}
                            galleryArtwork={galleryArtwork}
                            session={null}
                        />
                    ))}

                    {/* Left wall artworks */}
                    {exhibitionRoom.leftWallArtworks.map((galleryArtwork) => (
                        <ArtworkMesh
                            key={galleryArtwork.id}
                            galleryArtwork={galleryArtwork}
                            session={null}
                        />
                    ))}

                    {/* Right wall artworks */}
                    {/* {exhibitionRoom.rightWallArtworks.map((galleryArtwork) => (
                        <ArtworkMesh
                            key={galleryArtwork.id}
                            galleryArtwork={galleryArtwork}
                            session={null}
                        />
                    ))} */}

                    {/* Center wall artworks */}
                    {exhibitionRoom.centerWallArtworks.map((galleryArtwork) => (
                        <ArtworkMesh
                            key={galleryArtwork.id}
                            galleryArtwork={galleryArtwork}
                            session={null}
                        />
                    ))}
           
                    {/* addition models */}
                    {exhibitionModels}
                </BaseRoom>
            </group>
        </>
    );
}