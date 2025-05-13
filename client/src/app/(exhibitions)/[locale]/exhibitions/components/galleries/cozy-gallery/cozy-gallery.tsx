// import React, { useMemo } from 'react';
// import { BaseRoom } from '../../base-room';
// import { Wall } from '../../wall';
// import { RoomFloor } from '../../room-floor';
// import { ArtworkMesh } from '../../art-work-mesh';
// import { COZY_A1_ROOM_CONFIG } from '@/utils/gallery-config';
// import { calculateWallArtworkPositions } from '@/utils/room-helper';
// import { Vec3 } from '@/types/gallery';

// // import { GlassCeiling } from './model/glass-ceiling';
// // import { TrackLighting } from './model/track-lighting';
// // import { InformationKiosk } from './model/information-kiosk';
// // import { MinimalistBench } from './model/minimalist-bench';
// // import { LIGHT_PRESETS } from '@/utils/light-config';
// // import { RoomLights } from '../../room-light';
// import { useCloudinaryAsset } from '@/hooks/useCloudinaryAsset';
// import { ARTWORK_URL, TEXTURE_URL } from '@/utils/constants';
// import CozyA1Ceilling from './cozy-gallery-ceilling';
// import { Environment } from '@react-three/drei';
// import { RoomLights } from '../../room-light';
// import { WindowWall } from '../../window-wall';

// export default function CozyGallery() {
//     const { X_AXIS, Y_AXIS, Z_AXIS } = COZY_A1_ROOM_CONFIG.DIMENSION;
//     const roomDimensions = { X_AXIS, Y_AXIS, Z_AXIS };

//     // Calculate positions for all four walls
//     const mainWallResult = calculateWallArtworkPositions({
//     wallType: 'back',
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
//     const centerWallFrontResult = calculateWallArtworkPositions({
//         wallType: 'custom',
//         wallDimension: Z_AXIS / 2,
//         artworkCount: 1,
//         roomDimensions,
//         wallPosition: [0, Y_AXIS/4, 0],
//         wallRotation: [0, Math.PI / 2, 0],
//         offsetDirection: [1, 0, 0],
//         heightPosition: Y_AXIS/4 + 1
//     });
    
//     const centerWallBackResult = calculateWallArtworkPositions({
//         wallType: 'custom',
//         wallDimension: Z_AXIS / 2,
//         artworkCount: 1,
//         roomDimensions,
//         wallPosition: [0, Y_AXIS/4, 0],
//         wallRotation: [0, -Math.PI / 2, 0], 
//         offsetDirection: [-1, 0, 0],
//         heightPosition: Y_AXIS/4 + 1
//     });

//     // High-quality textures for modern gallery
//     const darkGreyConcreteTexture = useCloudinaryAsset(TEXTURE_URL.DARK_GREY_CONCRETE_TEXTURE);
//     const greyConcreteTexture = useCloudinaryAsset(TEXTURE_URL.GREY_CONCRETE_TEXTURE);

//     // Modern exhibition room configuration
//     const exhibitionRoom = useMemo(
//         () => ({
//             position: [0, 0, 0] as Vec3,
//             // Gallery grey floor
//             floor: {
//                 component: (
//                     <RoomFloor
//                         position={[0, 0, 0]}
//                         colliderPosition={[0, 0, 0]}
//                         args={[X_AXIS, Z_AXIS, 0.1]}
//                         material={{
//                             texture: darkGreyConcreteTexture,
//                             color: '#9C9C9C',
//                             roughness: 0.8, // Polished finish
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
//                             texture: greyConcreteTexture,
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
//                             texture: greyConcreteTexture,
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
//                             texture: greyConcreteTexture,
//                             roughness: 0.9,
//                             metalness: 0
//                         }}
//                     />
//                 ),
//                 // Entrance wall with wide opening
//                 front: (
//                     <WindowWall
//                     position={[0, Y_AXIS / 2, Z_AXIS / 2]}
//                     rotation={[0, Math.PI, 0]}
//                     dimensions={{
//                         width: X_AXIS,
//                         height: Y_AXIS,
//                         depth: 0.2
//                     }}
//                     material={{
//                         color: '#f0f0f0',
//                         texture: greyConcreteTexture,
//                         roughness: 1,
//                         metalness: 0.1
//                     }}
//                     windowWidth={4}
//                     windowHeight={6}
//                 />
//                 )
//             },
//             ceiling: {
//                 component: (
//                     <CozyA1Ceilling />
//                 )
//             },
//             // Artwork configuration for main wall
//             mainWallArtworks: [
//                 {
//                     id: 1,
//                     url: ARTWORK_URL.ARTWORK_1,
//                     position: mainWallResult.positions[0],
//                     rotation: mainWallResult.rotations[0],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 },
//                 {
//                     id: 2,
//                     url: ARTWORK_URL.ARTWORK_2,
//                     position: mainWallResult.positions[1],
//                     rotation: mainWallResult.rotations[1],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 },
//                 {
//                     id: 3,
//                     url: ARTWORK_URL.ARTWORK_3,
//                     position: mainWallResult.positions[2],
//                     rotation: mainWallResult.rotations[2],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 }
//             ],
//             // Artwork configuration for left wall
//             leftWallArtworks: [
//                 {
//                     id: 4,
//                     url: ARTWORK_URL.ARTWORK_2,
//                     position: leftWallResult.positions[0],
//                     rotation: leftWallResult.rotations[0],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 },
//                 {
//                     id: 5,
//                     url: ARTWORK_URL.ARTWORK_3,
//                     position: leftWallResult.positions[1],
//                     rotation: leftWallResult.rotations[1],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 }
//             ],
//             // Artwork configuration for right wall
//             rightWallArtworks: [
//                 {
//                     id: 6,
//                     url: ARTWORK_URL.ARTWORK_4,
//                     position: rightWallResult.positions[0],
//                     rotation: rightWallResult.rotations[0],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 },
//                 {
//                     id: 7,
//                     url: ARTWORK_URL.ARTWORK_3,
//                     position: rightWallResult.positions[1],
//                     rotation: rightWallResult.rotations[1],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 }
//             ],
//             frontWallArtworks: [
//                 {
//                     id: 8,
//                     url: ARTWORK_URL.ARTWORK_1,
//                     position: frontWallResult.positions[0],
//                     rotation: frontWallResult.rotations[0],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 }
//             ],
//             centerWallArtworks: [
//                 {
//                     id: 9,
//                     url: ARTWORK_URL.ARTWORK_4,
//                     position: centerWallFrontResult.positions[0],
//                     rotation: centerWallFrontResult.rotations[0],
//                     frame: { color: '#121212', thickness: 0.05 }
//                 },
//                 {
//                     id: 10,
//                     url: ARTWORK_URL.ARTWORK_2,
//                     position: centerWallBackResult.positions[0],
//                     rotation: centerWallBackResult.rotations[0],
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
//             centerWallFrontResult,
//             centerWallBackResult,
//             darkGreyConcreteTexture,
//             greyConcreteTexture,
//         ]
//     );

//     const exhibitionModels = useMemo(
//         () => [
//             <Wall
//             key={'center-wall'}
//             position={[0, Y_AXIS/4, 0]}
//             rotation={[0, -Math.PI / 2, 0]}
//             dimensions={{
//                 width: Z_AXIS / 2,
//                 height: Y_AXIS / 2,
//                 depth: 0.15
//             }}
//             material={{
//                 color: '#ffffff',
//                 texture: greyConcreteTexture,
//                 roughness: 0.9,
//                 metalness: 0
//             }}
            
//         />
//         ],
//         [Y_AXIS, Z_AXIS, greyConcreteTexture]
//     );
//     const LIGHT_CONFIG = {
//         ambient: {
//             intensity: COZY_A1_ROOM_CONFIG.LIGHTING.AMBIENT.INTENSITY,
//             color: COZY_A1_ROOM_CONFIG.LIGHTING.AMBIENT.COLOR
//         }
//     }
//     return (
//         <>
//             <Environment near={100} far={100000} files={'/autumn.jpg'} environmentIntensity={0} background/>
//             <group>
//                 <RoomLights config={LIGHT_CONFIG} debug={false} />
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
//                     {/* {exhibitionRoom.frontWallArtworks.map((artwork) => (
//                         <ArtworkMesh
//                             key={artwork.id}
//                             artwork={artwork}
//                         />
//                     ))} */}

//                     {/* Center wall artworks */}
//                     {exhibitionRoom.centerWallArtworks.map((artwork) => (
//                         <ArtworkMesh
//                             key={artwork.id}
//                             artwork={artwork}
//                         />
//                     ))}

//                     {/* addition models */}
//                     {exhibitionModels}
//                 </BaseRoom>
//             </group>
//         </>
//     );
// }