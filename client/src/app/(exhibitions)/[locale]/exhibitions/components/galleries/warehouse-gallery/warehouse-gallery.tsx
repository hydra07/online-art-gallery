// import React, { useMemo } from 'react';
// import { BaseRoom } from '../../base-room';
// import { Wall } from '../../wall';
// import { RoomFloor } from '../../room-floor';
// import { DoorWall } from '../../door-wall';
// import { ArtworkMesh } from '../../art-work-mesh';
// import { GALLERY_CONFIG } from '@/utils/gallery-config';
// import { calculateWallArtworkPositions } from '@/utils/room-helper';
// import { Vec3 } from '@/types/gallery';

// import GlassWindow from '../../model/glass-window';

// import GLASS_WINDOWS_2 from '../../model/glass-window-2';
// import { Railing } from '../../model/railing';
// import { StairLowPoly } from '../../model/stair_low_poly';
// import { LIGHT_PRESETS } from '@/utils/light-config';
// import { RoomLights } from '../../room-light';
// import { useCloudinaryAsset } from '@/hooks/useCloudinaryAsset';
// import { ARTWORK_URL, TEXTURE_URL } from '@/utils/constants';
// import { Environment } from '@react-three/drei';

// export default function WareHouseRoom() {
//     const { X_AXIS, Y_AXIS, Z_AXIS } = GALLERY_CONFIG.ROOM;
//     const roomDimensions = { X_AXIS, Y_AXIS, Z_AXIS };
    
//     // Calculate positions for artworks on different walls
//     const backWallResult = calculateWallArtworkPositions({
//         wallType: 'back',
//         wallDimension: X_AXIS,
//         artworkCount: 2,
//         roomDimensions
//     });
//     const leftWallResult = calculateWallArtworkPositions({
//         wallType: 'left',
//         wallDimension: Z_AXIS,
//         artworkCount: 1,
//         roomDimensions
//     });
    
//     // For second floor
//     const secondFloorBackWallResult = calculateWallArtworkPositions({
//         wallType: 'back',
//         wallDimension: X_AXIS,
//         artworkCount: 2,
//         roomDimensions
//     });

//     const defaultFloorTexture = useCloudinaryAsset(TEXTURE_URL.FLOOR);
//     const defaultWallTexture = useCloudinaryAsset(TEXTURE_URL.WHITE_WALL);

//     // Room configurations
//     const rooms = useMemo(
//         () => [
//             {
//                 position: [0, 0, 0] as Vec3,
//                 color: '#f0f0f0',
//                 floor: {
//                     component: (
//                         <RoomFloor
//                             position={[0, 0, 0]}
//                             colliderPosition={[0, 0, 0]}
//                             args={[X_AXIS, Z_AXIS, 0.2]}
//                             material={{
//                                 texture: defaultFloorTexture,
//                                 color: '#f0f0f0',
//                                 roughness: 1
//                             }}
//                         />
//                     )
//                 },
//                 walls: {
//                     back: (
//                         <Wall
//                             position={[0, Y_AXIS / 2, -Z_AXIS / 2]}
//                             dimensions={{
//                                 width: X_AXIS,
//                                 height: Y_AXIS,
//                                 depth: 0.2
//                             }}
//                             material={{
//                                 color: '#f0f0f0',
//                                 texture: defaultWallTexture,
//                                 roughness: 1,
//                                 metalness: 0.1
//                             }}
//                         />
//                     ),
//                     left: (
//                         <Wall
//                             position={[-X_AXIS / 2, Y_AXIS / 2, 0]}
//                             rotation={[0, Math.PI / 2, 0]}
//                             dimensions={{
//                                 width: Z_AXIS,
//                                 height: Y_AXIS,
//                                 depth: 0.2
//                             }}
//                             material={{
//                                 color: '#f0f0f0',
//                                 texture: defaultWallTexture,
//                                 roughness: 1,
//                                 metalness: 0.1
//                             }}
//                         />
//                     ),
//                     right: (
//                         <DoorWall
//                             dimensions={{
//                                 width: X_AXIS,
//                                 height: Y_AXIS,
//                                 length: Z_AXIS
//                             }}
//                             material={{
//                                 color: '#f0f0f0',
//                                 texture: defaultWallTexture
//                             }}
//                         />
//                     )
//                 },
//                 artworks: [
//                     {
//                         id: 1,
//                         url: ARTWORK_URL.ARTWORK_1,
//                         position: backWallResult.positions[0],
//                         rotation: backWallResult.rotations[0]
//                     },
//                     {
//                         id: 2,
//                         url: ARTWORK_URL.ARTWORK_2,
//                         position: backWallResult.positions[1],
//                         rotation: backWallResult.rotations[1]
//                     },
//                     {
//                         id: 5,
//                         url: ARTWORK_URL.ARTWORK_3,
//                         position: leftWallResult.positions[0],
//                         rotation: leftWallResult.rotations[0]
//                     }
//                 ]
//             },
//             // Second floor configuration
//             {
//                 position: [0, Y_AXIS, 0] as Vec3,
//                 color: '#f0f0f0',
//                 floor: {
//                     component: (
//                         <RoomFloor
//                             position={[0, 0, -Z_AXIS / 4]}
//                             colliderPosition={[0, Y_AXIS - 1.5, -Z_AXIS / 4]}
//                             args={[X_AXIS, Z_AXIS / 2, 0.05]}
//                             material={{
//                                 texture: defaultFloorTexture,
//                                 color: '#f0f0f0',
//                                 roughness: 1
//                             }}
//                         />
//                     )
//                 },
//                 walls: {
//                     back: (
//                         <Wall
//                             position={[0, Y_AXIS / 2, -Z_AXIS / 2]}
//                             dimensions={{
//                                 width: X_AXIS,
//                                 height: Y_AXIS,
//                                 depth: 0.2
//                             }}
//                             material={{
//                                 color: '#f0f0f0',
//                                 texture: defaultWallTexture,
//                                 roughness: 1,
//                                 metalness: 0.1
//                             }}
//                         />
//                     ),
//                     left: (
//                         <Wall
//                             position={[-X_AXIS / 2, Y_AXIS / 2, 0]}
//                             rotation={[0, Math.PI / 2, 0]}
//                             dimensions={{
//                                 width: Z_AXIS,
//                                 height: Y_AXIS,
//                                 depth: 0.2
//                             }}
//                             material={{
//                                 color: '#f0f0f0',
//                                 texture: defaultWallTexture,
//                                 roughness: 1,
//                                 metalness: 0.1
//                             }}
//                         />
//                     ),
//                     right: (
//                         <DoorWall
//                             dimensions={{
//                                 width: X_AXIS,
//                                 height: Y_AXIS,
//                                 length: Z_AXIS
//                             }}
//                             material={{
//                                 color: '#f0f0f0',
//                                 texture: defaultWallTexture
//                             }}
//                         />
//                     )
//                 },
//                 ceiling: {
//                     component: (
//                         <mesh
//                             castShadow
//                             rotation={[Math.PI / 2, 0, 0]}
//                             position={[0, Y_AXIS, 0]}
//                             receiveShadow
//                         >
//                             <boxGeometry args={[X_AXIS, Z_AXIS, 0.5]} />
//                             <meshStandardMaterial
//                                 color='#f0f0f0'
//                                 roughness={1}
//                             />
//                         </mesh>
//                     )
//                 },
//                 artworks: [
//                     {
//                         id: 3,
//                         url: ARTWORK_URL.ARTWORK_3,
//                         position: secondFloorBackWallResult.positions[0],
//                         rotation: secondFloorBackWallResult.rotations[0]
//                     },
//                     {
//                         id: 4,
//                         url: ARTWORK_URL.ARTWORK_4,
//                         position: secondFloorBackWallResult.positions[1],
//                         rotation: secondFloorBackWallResult.rotations[1]
//                     }
//                 ]
//             }
//         ],
//         [
//             X_AXIS,
//             Y_AXIS,
//             Z_AXIS,
//             backWallResult,
//             leftWallResult,
//             secondFloorBackWallResult,
//             defaultFloorTexture,
//             defaultWallTexture
//         ]
//     );

//     const firstFloorModels = useMemo(
//         () => [
//             <StairLowPoly
//                 key='stair'
//                 position={GALLERY_CONFIG.MODELS.STAIR_LOW_POLY.POSITION}
//                 scale={GALLERY_CONFIG.MODELS.STAIR_LOW_POLY.SCALE}
//                 rotation={GALLERY_CONFIG.MODELS.STAIR_LOW_POLY.ROTATION}
//             />,
//             ...GALLERY_CONFIG.MODELS.GLASS_WINDOWS.POSITIONS.map(
//                 (pos, index) => (
//                     <GlassWindow
//                         key={`window_${index}`}
//                         position={pos}
//                         rotation={GALLERY_CONFIG.MODELS.GLASS_WINDOWS.ROTATION}
//                         scale={GALLERY_CONFIG.MODELS.GLASS_WINDOWS.SCALE}
//                     />
//                 )
//             ),
//             <GLASS_WINDOWS_2
//                 key='glass-window-2'
//                 position={GALLERY_CONFIG.MODELS.GLASS_WINDOWS_2.POSITIONS}
//                 rotation={GALLERY_CONFIG.MODELS.GLASS_WINDOWS_2.ROTATION}
//                 scale={GALLERY_CONFIG.MODELS.GLASS_WINDOWS_2.SCALE}
//             />
//         ],
//         []
//     );

//     const secondFloorModels = useMemo(
//         () => [
//             <GLASS_WINDOWS_2
//                 key='glass-window-2'
//                 position={GALLERY_CONFIG.MODELS.GLASS_WINDOWS_2.POSITIONS}
//                 rotation={GALLERY_CONFIG.MODELS.GLASS_WINDOWS_2.ROTATION}
//                 scale={GALLERY_CONFIG.MODELS.GLASS_WINDOWS_2.SCALE}
//             />,
//             ...GALLERY_CONFIG.MODELS.RAILING.POSITIONS.map((pos, index) => (
//                 <Railing
//                     key={`railing_${index}`}
//                     position={pos}
//                     rotation={GALLERY_CONFIG.MODELS.RAILING.ROTATION}
//                     scale={GALLERY_CONFIG.MODELS.RAILING.SCALE}
//                 />
//             ))
//         ],
//         []
//     );

//     return (
//         <>
//             <Environment near={100} far={100000} preset='forest' background/>
//             <group>
//                 <RoomLights config={LIGHT_PRESETS.GALLERY} />
//                 {rooms.map((room, index) => (
//                     <BaseRoom
//                         key={`floor${index + 1}`}
//                         position={room.position}
//                         dimensions={{
//                             width: X_AXIS,
//                             height: Y_AXIS,
//                             depth: Z_AXIS
//                         }}
//                         floor={room.floor.component}
//                         ceiling={room.ceiling?.component}
//                         walls={room.walls}
//                     >
//                         {/* Artworks */}
//                         {room.artworks.map((artwork) => (
//                             <ArtworkMesh key={artwork.id} artwork={artwork} />
//                         ))}

//                         {/* Models */}
//                         {index === 0 ? firstFloorModels : secondFloorModels}
//                     </BaseRoom>
//                 ))}
//             </group>
//         </>
//     );
// }