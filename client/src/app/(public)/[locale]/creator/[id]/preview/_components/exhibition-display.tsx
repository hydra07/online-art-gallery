'use client'
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, PointerLockControls, Preload } from "@react-three/drei";
import { Suspense, useState, useCallback } from "react";
import { Physics } from "@react-three/cannon";
import { GalleryPreviewLoader } from "@/app/(public)/[locale]/about/components/gallery-preview-loader";
import { GALLERY_CONFIG } from "@/utils/gallery-config";
import Player from "@/app/(exhibitions)/[locale]/exhibitions/components/player";
import { Exhibition as ExhibitionType } from "@/types/exhibition";
import { Crosshair } from "@/app/(exhibitions)/[locale]/exhibitions/components/crosshair";
import Gallery from "@/app/(exhibitions)/[locale]/exhibitions/components/gallery";
import { useGalleryConfig } from "@/hooks/use-gallery-config";


export function ExhibitionDisplay({ exhibition }: { exhibition: ExhibitionType }) {
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsPointerLocked(true);
  }, []);

    const galleryConfig = useGalleryConfig(exhibition);
  

  return (
    <div className="relative w-full h-full mx-auto "
      onClick={handleCanvasClick}
    >
      <Canvas
        camera={{ position: [0, 2, 5], fov: 75 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#f0f0f0']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={<GalleryPreviewLoader />}>
          <color attach="background" args={["#f0f0f0"]} />
          <PerspectiveCamera
            makeDefault
            position={GALLERY_CONFIG.CAMERA.INITIAL_POSITION}
          />
          <Environment preset="apartment" />
          {/* <Light /> */}

          <Physics
            gravity={GALLERY_CONFIG.PHYSICS.GRAVITY}
            defaultContactMaterial={GALLERY_CONFIG.PHYSICS.CONTACT_MATERIAL}
          >
            <Player />
            <Gallery
              config={galleryConfig} // Pass the new config
              visible={false} // Or control visibility as needed
              session={null}
            />
          </Physics>

          <Preload all />
          {isPointerLocked && (
            <PointerLockControls
              maxPolarAngle={Math.PI * 0.7}
              minPolarAngle={Math.PI * 0.3}
              pointerSpeed={0.1}
              onLock={() => setIsPointerLocked(true)}
              onUnlock={() => setIsPointerLocked(false)}
            />
          )}
          <Crosshair />
        </Suspense>
      </Canvas>
    </div>
  );
}