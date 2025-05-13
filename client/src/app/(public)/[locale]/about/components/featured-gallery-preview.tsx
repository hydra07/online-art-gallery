'use client'
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, PointerLockControls, Preload } from "@react-three/drei";
import { Suspense, useState, useCallback } from "react";
import { Physics } from "@react-three/cannon";
import Image from "next/image";
import { GalleryPreviewLoader } from "./gallery-preview-loader";
import { GALLERY_CONFIG } from "@/utils/gallery-config";
import { Crosshair } from "../../../../(exhibitions)/[locale]/exhibitions/components/crosshair";
import Player from "../../../../(exhibitions)/[locale]/exhibitions/components/player";
import CozyGallery from "./cozy-room";

export function FeaturedGalleryPreview() {
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsPointerLocked(true);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto"
      onClick={handleCanvasClick}
    >

      <Image
        src="https://res.cloudinary.com/djvlldzih/image/upload/v1739338527/gallery/monitor-frame.png"
        alt="Monitor Frame"
        width={1920}
        height={1080}
        className="w-full h-auto relative z-20"
      />
      <div
        className="absolute top-[5.5%] left-[3.5%] right-[3.5%] bottom-[20%] overflow-hidden"
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
              <CozyGallery />
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
    </div>
  );
}