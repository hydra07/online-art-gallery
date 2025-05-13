// src/app/(exhibitions)/[locale]/exhibitions/[linkname]/components/scene.tsx
import { Physics } from '@react-three/cannon';
import { KeyboardControls, PerspectiveCamera, Preload, PointerLockControls, PointerLockControlsProps } from '@react-three/drei';
import { GALLERY_CONFIG } from '@/utils/gallery-config';
import Player from './player';
import { Crosshair } from './crosshair';
import { useThree } from '@react-three/fiber';
import Gallery from './gallery';
import { Exhibition as ExhibitionType } from '@/types/exhibition'; // Renamed import
import { useGalleryConfig } from '@/hooks/use-gallery-config';
import { KEYBOARD_CONTROLS, POINTER_LOCK_CONFIG } from '@/utils/constants';
import { Session } from 'next-auth'; // <-- Import Session type

// --- Update props interface ---
interface SceneProps {
    exhibition: ExhibitionType;
    session: Session | null; // <-- Accept session
}
// --- End update props ---

export default function Scene({ exhibition, session }: SceneProps) { // <-- Use updated props
  const { set } = useThree();
  const galleryConfig = useGalleryConfig(exhibition);

  const pointerLockProps: PointerLockControlsProps = {
    ...POINTER_LOCK_CONFIG,
    onUpdate: (controls) => {
      set({ controls });
    }
  };

  return (
    <KeyboardControls map={KEYBOARD_CONTROLS}>
      <PerspectiveCamera makeDefault position={GALLERY_CONFIG.CAMERA.INITIAL_POSITION} />
      <ambientLight intensity={2} color={'#ffffff'} />
      <Physics gravity={GALLERY_CONFIG.PHYSICS.GRAVITY} defaultContactMaterial={GALLERY_CONFIG.PHYSICS.CONTACT_MATERIAL}>
        <Player />
        {/* Pass session down to Gallery */}
        <Gallery config={galleryConfig} visible={false} session={session} />
      </Physics>
      <Preload all />
      <PointerLockControls {...pointerLockProps} />
      <Crosshair />
    </KeyboardControls>
  );
}
// import { Physics } from '@react-three/cannon';
// import { KeyboardControls, PerspectiveCamera, Preload } from '@react-three/drei';
// import { GALLERY_CONFIG } from '@/utils/gallery-config';
// import Player from './player';
// import { PointerLockControls } from '@react-three/drei';
// import { Crosshair } from './crosshair';
// import { useThree } from '@react-three/fiber';
// import Gallery, { GalleryConfig, GalleryArtwork } from './gallery';
// import { useMemo } from 'react';
// import { Exhibition } from '@/types/exhibition';

// export default function Scene({ exhibition }: { exhibition: Exhibition }) {
//   const { set } = useThree();
//   const pointerLockProps = {
//     maxPolarAngle: Math.PI * 0.7, // Limit looking up
//     minPolarAngle: Math.PI * 0.3, // Limit looking down
//     pointerSpeed: 0.5,
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     onUpdate: (controls: any) => {
//       set({ controls });
//     }
//   };
//   const processedArtworks = useMemo(() => {
//     const artworks: GalleryArtwork[] = [];
//     const placements = exhibition.gallery.artworkPlacements || [];

//     for (const artworkPos of exhibition.artworkPositions) {
//       const index = artworkPos.positionIndex;
//       // Find the corresponding placement using the index
//       if (index >= 0 && index < placements.length) {
//         const placement = placements[index];
//         artworks.push({
//           artwork: artworkPos.artwork,
//           placement: {
//             position: placement.position,
//             rotation: placement.rotation,
//           },
//         });
//       } else {
//         console.warn(`Artwork ${artworkPos.artwork._id} has invalid positionIndex ${index}. Skipping.`);
//         // Optionally, add it at a default position [0, 1.5, 0] or skip it
//       }
//     }
//     return artworks;
//   }, [exhibition.artworkPositions, exhibition.gallery.artworkPlacements]);


//   // Construct the gallery configuration for the Gallery component
//   const galleryConfig: GalleryConfig = useMemo((): GalleryConfig => ({
//     id: exhibition._id,
//     // Use language-specific name if available and logic implemented, otherwise fallback
//     name: exhibition.contents?.find(c => c.languageCode === 'en')?.name || exhibition.contents[0]?.name || 'Default Gallery Name',
//     galleryModel: {
//       // Map directly from the new gallery structure
//       _id: exhibition.gallery._id,
//       name: exhibition.gallery.name,
//       description: exhibition.gallery.description,
//       dimensions: exhibition.gallery.dimensions,
//       wallThickness: exhibition.gallery.wallThickness,
//       // wallHeight might be needed by BaseRoom or other components
//       // check if it exists in exhibition.gallery or use a default
//       wallHeight: exhibition.gallery.wallHeight || 3, // Example fallback
//       modelPath: exhibition.gallery.modelPath,
//       modelPosition: exhibition.gallery.modelPosition,
//       modelRotation: exhibition.gallery.modelRotation,
//       modelScale: exhibition.gallery.modelScale,
//       // Map custom colliders if needed by GalleryModelBase
//       // This requires updating GalleryModelBase to handle the array and new structure
//       customColliders: exhibition.gallery.customColliders,
//       artworkPlacements: exhibition.gallery.artworkPlacements.map(placement => ({
//         position: placement.position,
//         rotation: placement.rotation,
//       })),
//     },
//     // Pass the processed artworks directly
//     artworks: processedArtworks,

//   }), [exhibition, processedArtworks]); // Depend on exhibition and processedArtworks


//   return (
//     <>
//       <KeyboardControls
//         map={[
//           { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
//           { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
//           { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
//           { name: 'right', keys: ['ArrowRight', 'd', 'D'] }
//         ]}
//       >
//         <PerspectiveCamera
//           makeDefault
//           position={GALLERY_CONFIG.CAMERA.INITIAL_POSITION} // Ensure GALLERY_CONFIG is still appropriate
//         />
//         <ambientLight intensity={2} color={'ffffff'} />
//         <Physics
//           gravity={GALLERY_CONFIG.PHYSICS.GRAVITY}
//           defaultContactMaterial={GALLERY_CONFIG.PHYSICS.CONTACT_MATERIAL}
//         >
//           <Player />
//           <Gallery
//             config={galleryConfig}
//             visible={false}
//           />
//         </Physics>

//         <Preload all />
//         <PointerLockControls {...pointerLockProps} />
//         <Crosshair />
//       </KeyboardControls>
//     </>
//   );
// }
