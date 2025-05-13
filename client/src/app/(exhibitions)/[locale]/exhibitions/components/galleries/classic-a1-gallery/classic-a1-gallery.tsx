// import React, { useMemo } from 'react';
// import { BaseRoom } from '../../base-room';
// import { Wall } from '../../wall';
// import { RoomFloor } from '../../room-floor';
// import { ArtworkMesh } from '../../art-work-mesh';
// import { M2_ROOM_CONFIG } from '@/utils/gallery-config';
// import { calculateWallArtworkPositions } from '@/utils/room-helper';
// import { Vec3 } from '@/types/gallery';
// import { useCloudinaryAsset } from '@/hooks/useCloudinaryAsset';
// import { ARTWORK_URL, TEXTURE_URL } from '@/utils/constants';
// import M2RoomCeilling from './classic--a1-gallery-ceilling';
// import { Environment } from '@react-three/drei';
// import { CurvedPhysicalCollider } from '../../curved-physical-collider';

// export default function ClassicA1Gallery() {
//     const { X_AXIS, Y_AXIS, Z_AXIS } = M2_ROOM_CONFIG.DIMENSION;
//     const roomDimensions = { X_AXIS, Y_AXIS, Z_AXIS };

//     // Calculate positions for all four walls
//     const mainWallResult = calculateWallArtworkPositions({
//         wallType: 'back',
//         wallDimension: X_AXIS,
//         artworkCount: 3,
//         roomDimensions
//     });
//     const frontWallResult = calculateWallArtworkPositions({
//         wallType: 'front',
//         wallDimension: X_AXIS,
//         artworkCount: 1,
//         roomDimensions
//     });
//     const leftWallResult = calculateWallArtworkPositions({
//         wallType: 'left',
//         wallDimension: Z_AXIS,
//         artworkCount: 2,
//         roomDimensions
//     });
//     const rightWallResult = calculateWallArtworkPositions({
//         wallType: 'right',
//         wallDimension: Z_AXIS,
//         artworkCount: 2,
//         roomDimensions
//     });
//     // High-quality textures for modern gallery
//     const polishedConcreteFloor = useCloudinaryAsset(TEXTURE_URL.WHITE_WALL || TEXTURE_URL.FLOOR);
//     const museumWallTexture = useCloudinaryAsset(TEXTURE_URL.WHITE_WALL || TEXTURE_URL.WHITE_WALL);

//     // Modern exhibition room configuration
//     const exhibitionRoom = useMemo(
//         () => ({
//             position: [0, 0, 0] as Vec3,
//             color: '#fcfcfc', // Gallery white
//             floor: {
//                 component: (
//                     <RoomFloor
//                         position={[0, 0, 0]}
//                         colliderPosition={[0, 0, 0]}
//                         args={[X_AXIS, Z_AXIS, 0.1]}
//                         material={{
//                             texture: polishedConcreteFloor,
//                             color: '#f8f8f8',
//                             roughness: 0.3, // Polished finish
//                             //   metalness: 0.05
//                         }}
//                     />
//                 )
//             },
//             walls: {
//                 // Main exhibition wall (back)
//                 back: (
//                     <Wall
//                         position={[0, Y_AXIS / 2, -Z_AXIS / 2]}
//                         dimensions={{
//                             width: X_AXIS,
//                             height: Y_AXIS,
//                             depth: 0.15
//                         }}
//                         material={{
//                             color: '#ffffff',
//                             texture: museumWallTexture,
//                             roughness: 0.9, // Matte finish ideal for art display
//                             metalness: 0
//                         }}
//                     />
//                 ),
//                 // Left exhibition wall
//                 left: (
//                     <Wall
//                         position={[-X_AXIS / 2, Y_AXIS / 2, 0]}
//                         rotation={[0, Math.PI / 2, 0]}
//                         dimensions={{
//                             width: Z_AXIS,
//                             height: Y_AXIS,
//                             depth: 0.15
//                         }}
//                         material={{
//                             color: '#ffffff',
//                             texture: museumWallTexture,
//                             roughness: 0.9,
//                             metalness: 0
//                         }}
//                     />
//                 ),
//                 // Right exhibition wall
//                 right: (
//                     <Wall
//                         position={[X_AXIS / 2, Y_AXIS / 2, 0]}
//                         rotation={[0, -Math.PI / 2, 0]}
//                         dimensions={{
//                             width: Z_AXIS,
//                             height: Y_AXIS,
//                             depth: 0.15
//                         }}
//                         material={{
//                             color: '#ffffff',
//                             texture: museumWallTexture,
//                             roughness: 0.9,
//                             metalness: 0
//                         }}
//                     />
//                 ),
//                 // Entrance wall with wide opening
//                 front: (
//                     <Wall
//                         position={[0, Y_AXIS / 2, Z_AXIS / 2]}
//                         dimensions={{
//                             width: X_AXIS,
//                             height: Y_AXIS,
//                             depth: 0.15
//                         }}
//                         material={{
//                             color: '#ffffff',
//                             texture: museumWallTexture,
//                             roughness: 0.9, // Matte finish ideal for art display
//                             metalness: 0
//                         }}
//                     />
//                 )
//             },
//             ceiling: {
//                 component: (
//                     <M2RoomCeilling />
//                 )
//             },
//             // Artwork configuration for main wall
//             mainWallArtworks: [
//                 {
//                     id: '1',
//                     url: ARTWORK_URL.ARTWORK_1,
//                     position: mainWallResult.positions[0],
//                     rotation: mainWallResult.rotations[0],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 },
//                 {
//                     id: '2',
//                     url: ARTWORK_URL.ARTWORK_2,
//                     position: mainWallResult.positions[1],
//                     rotation: mainWallResult.rotations[1],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 },
//                 {
//                     id: '3',
//                     url: ARTWORK_URL.ARTWORK_3,
//                     position: mainWallResult.positions[2],
//                     rotation: mainWallResult.rotations[2],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 }
//             ],
//             // Artwork configuration for left wall
//             leftWallArtworks: [
//                 {
//                     id: '4',
//                     url: ARTWORK_URL.ARTWORK_2,
//                     position: leftWallResult.positions[0],
//                     rotation: leftWallResult.rotations[0],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 },
//                 {
//                     id: '5',
//                     url: ARTWORK_URL.ARTWORK_3,
//                     position: leftWallResult.positions[1],
//                     rotation: leftWallResult.rotations[1],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 }
//             ],
//             // Artwork configuration for right wall
//             rightWallArtworks: [
//                 {
//                     id: '6',
//                     url: ARTWORK_URL.ARTWORK_4,
//                     position: rightWallResult.positions[0],
//                     rotation: rightWallResult.rotations[0],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 },
//                 {
//                     id: '7',
//                     url: ARTWORK_URL.ARTWORK_3,
//                     position: rightWallResult.positions[1],
//                     rotation: rightWallResult.rotations[1],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 }
//             ],
//             frontWallArtworks: [
//                 {
//                     id: '8',
//                     url: ARTWORK_URL.ARTWORK_1,
//                     position: frontWallResult.positions[0],
//                     rotation: frontWallResult.rotations[0],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 }
//             ]
//         }),
//         [
//             X_AXIS,
//             Y_AXIS,
//             Z_AXIS,
//             mainWallResult,
//             leftWallResult,
//             rightWallResult,
//             frontWallResult,
//             polishedConcreteFloor,
//             museumWallTexture
//         ]
//     );

//     // Exhibition-specific features and furniture
//     const exhibitionFeatures = useMemo(
//         () => [
//             <CurvedPhysicalCollider
//             key="modern-a1-gallery-collider"
//             position={[0, 1.5, 0]}
//             rotation={[0, Math.PI / 2, 0]}
//             radius={2}
//             height={3}
//             arc={Math.PI} // Half circle
//             segments={16}
//             visible={true}
//         />
//         ],
//         []
//     );

//     return (
//         <>
//             <Environment preset='warehouse' environmentIntensity={.6} />
//             <group>
//                 {/* <RoomLights config={exhibitionLighting} /> */}
//                 <BaseRoom
//                     key="modern-exhibition"
//                     position={exhibitionRoom.position}
//                     dimensions={{
//                         width: X_AXIS,
//                         height: Y_AXIS,
//                         depth: Z_AXIS
//                     }}
//                     floor={exhibitionRoom.floor.component}
//                     ceiling={exhibitionRoom.ceiling.component}
//                     walls={exhibitionRoom.walls}
//                 >
//                     {/* Main wall artworks */}
//                     {exhibitionRoom.mainWallArtworks.map((artwork) => (
//                         <ArtworkMesh
//                             key={artwork.id}
//                             artwork={artwork}
//                         />
//                     ))}

//                     {/* Left wall artworks */}
//                     {exhibitionRoom.leftWallArtworks.map((artwork) => (
//                         <ArtworkMesh
//                             key={artwork.id}
//                             artwork={artwork}
//                         />
//                     ))}

//                     {/* Right wall artworks */}
//                     {exhibitionRoom.rightWallArtworks.map((artwork) => (
//                         <ArtworkMesh
//                             key={artwork.id}
//                             artwork={artwork}
//                         />
//                     ))}

//                     {/* Front wall artworks */}
//                     {exhibitionRoom.frontWallArtworks.map((artwork) => (
//                         <ArtworkMesh
//                             key={artwork.id}
//                             artwork={artwork}
//                         />
//                     ))}

//                     {/* Exhibition features and furniture */}
//                     {exhibitionFeatures}
//                 </BaseRoom>
//             </group>
//         </>
//     );
// }