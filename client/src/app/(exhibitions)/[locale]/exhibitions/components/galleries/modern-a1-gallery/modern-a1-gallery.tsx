// import React, { useMemo } from 'react';
// import { BaseRoom } from '../../base-room';
// import { ArtworkMesh } from '../../art-work-mesh';
// import { MODERN_A1_GALLERY_CONFIG } from '@/utils/gallery-config';
// import { calculateWallArtworkPositions } from '@/utils/room-helper';
// import { Vec3 } from '@/types/gallery';
// import { ARTWORK_URL } from '@/utils/constants';
// import GalleryModel from '../../gallery-model';

// const MODEL_GALLERY_CONFIG = {
//     dimension: {
//         xAxis: MODERN_A1_GALLERY_CONFIG.DIMENSION.X_AXIS,
//         yAxis: MODERN_A1_GALLERY_CONFIG.DIMENSION.Y_AXIS,
//         zAxis: MODERN_A1_GALLERY_CONFIG.DIMENSION.Z_AXIS,
//     },
//     wallThickness: 0.2,
//     modelPath: "/modern-a1-gallery.glb",
//     modelScale: 3,
// } as const;

// export default function ModernA1Gallery() {
//     const { X_AXIS, Y_AXIS, Z_AXIS } = MODERN_A1_GALLERY_CONFIG.DIMENSION;
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
//         [frontWallResult.positions, frontWallResult.rotations, leftWallResult.positions, leftWallResult.rotations, mainWallResult.positions, mainWallResult.rotations, rightWallResult.positions, rightWallResult.rotations]
//     );

//     // Exhibition-specific features and furniture
//     const exhibitionFeatures = useMemo(
//         () => [
//             <GalleryModel
//                 key="modern-a1-gallery-model"
//                 config={MODEL_GALLERY_CONFIG}
//                 visible={false}
//             />,
           


//         ], []
//     );
//     return (
//         <>
//             {/* <Environment preset='warehouse' /> */}
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