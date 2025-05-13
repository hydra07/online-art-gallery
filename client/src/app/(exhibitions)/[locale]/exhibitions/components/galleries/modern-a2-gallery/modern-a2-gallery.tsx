// import React, { useMemo } from 'react';
// import { BaseRoom } from '../../base-room';
// import { ArtworkMesh } from '../../art-work-mesh';
// import { MODERN_A2_GALLERY_CONFIG } from '@/utils/gallery-config';
// import { calculateWallArtworkPositions } from '@/utils/room-helper';
// import { Vec3 } from '@/types/gallery';
// import { ARTWORK_URL } from '@/utils/constants';
// import GalleryModel from '../../gallery-model';

// /*  Todo
//     - props artworks {id, url, position}
//     - props room {dimensions, ambientLight}
    
// */

// const MODEL_GALLERY_CONFIG = {
//     dimension: {
//         xAxis: MODERN_A2_GALLERY_CONFIG.DIMENSION.X_AXIS,
//         yAxis: MODERN_A2_GALLERY_CONFIG.DIMENSION.Y_AXIS,
//         zAxis: MODERN_A2_GALLERY_CONFIG.DIMENSION.Z_AXIS,
//     },
//     wallThickness: 0.2,
//     wallHeight: 3,
//     modelPath: "/modern-a2-gallery.glb",
//     modelScale: 4,
//     customCollider: {
//         shape: 'box',
//         args: [4,4,4] as [number, number, number],
//         position: [0, 1.5, 0] as [number, number, number]
//     },
// } as const;

// export default function ModernA2Gallery() {
//     const { X_AXIS, Y_AXIS, Z_AXIS } = MODERN_A2_GALLERY_CONFIG.DIMENSION;
//     const roomDimensions = { X_AXIS, Y_AXIS, Z_AXIS };

//     // Calculate positions for all four walls
//     const mainWallResult = calculateWallArtworkPositions({
//         wallType: 'back',
//         wallDimension: X_AXIS,
//         artworkCount: 3,
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

//     // Modern exhibition room configuration
//     const exhibitionRoom = useMemo(
//         () => ({
//             position: [0, 0, 0] as Vec3,
//             color: '#fcfcfc', // Gallery white
//             // Artwork configuration for main wall
//             mainWallArtworks: [
//                 {
//                     id: '1',
//                     url: ARTWORK_URL.ARTWORK_1,
//                     position: mainWallResult.positions[0],
//                     rotation: mainWallResult.rotations[0],

//                 },
//                 {
//                     id: '2',
//                     url: ARTWORK_URL.ARTWORK_2,
//                     position: mainWallResult.positions[1],
//                     rotation: mainWallResult.rotations[1],

//                 },
//                 {
//                     id: '3',
//                     url: ARTWORK_URL.ARTWORK_3,
//                     position: mainWallResult.positions[2],
//                     rotation: mainWallResult.rotations[2],

//                 }
//             ],
//             // Artwork configuration for left wall
//             leftWallArtworks: [
//                 {
//                     id: '4',
//                     url: ARTWORK_URL.ARTWORK_2,
//                     position: leftWallResult.positions[0],
//                     rotation: leftWallResult.rotations[0],

//                 },
//                 {
//                     id: '5',
//                     url: ARTWORK_URL.ARTWORK_3,
//                     position: leftWallResult.positions[1],
//                     rotation: leftWallResult.rotations[1],

//                 }
//             ],
//             // Artwork configuration for right wall
//             rightWallArtworks: [
//                 {
//                     id: '6',
//                     url: ARTWORK_URL.ARTWORK_4,
//                     position: rightWallResult.positions[0],
//                     rotation: rightWallResult.rotations[0],

//                 },
//                 {
//                     id: '7',
//                     url: ARTWORK_URL.ARTWORK_3,
//                     position: rightWallResult.positions[1],
//                     rotation: rightWallResult.rotations[1],
//                 }
//             ]
//         }),
//         [leftWallResult.positions, leftWallResult.rotations, mainWallResult.positions, mainWallResult.rotations, rightWallResult.positions, rightWallResult.rotations]
//     );

//     // Exhibition-specific features and furniture
//     const exhibitionFeatures = useMemo(
//         () => [
//             <GalleryModel
//                 key={'modern-a2-gallery-model'}
//                 config={MODEL_GALLERY_CONFIG}
//                 visible={false}
//             />
//         ],[]
//     );

//     return (
//         <>
//             <group>
//                 <BaseRoom
//                     key="moderna-a2-exhibition"
//                     position={exhibitionRoom.position}
//                     dimensions={{
//                         width: X_AXIS,
//                         height: Y_AXIS,
//                         depth: Z_AXIS
//                     }}
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

//                     {/* Exhibition models */}
//                     {exhibitionFeatures}
//                 </BaseRoom>
//             </group>
//         </>
//     );
// }