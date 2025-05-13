'use client';

import { useState, Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
    PerspectiveCamera,
    KeyboardControls,
    Stats,
    Environment,
    PointerLockControls,
    Preload
} from '@react-three/drei';
import { Physics, usePlane } from '@react-three/cannon';
import { type GalleryTemplateData } from './gallery-template-creator';
import { Button } from '@/components/ui/button';
import { Pause, Eye, EyeOff, Play } from 'lucide-react';
import { Loader } from '@/components/gallery-loader';
import GalleryModel from '@/components/gallery/gallery-model';
import Player from '@/components/gallery/player';
import { Crosshair } from '@/components/gallery/crosshair';
import { GALLERY_CONFIG } from '@/utils/gallery-config';

function Floor() {
    const [ref] = usePlane<THREE.Mesh>(() => ({ 
        rotation: [-Math.PI / 2, 0, 0], 
        position: [0, 0, 0],
        type: 'Static',
        material: { 
            friction: 0.1,
            restitution: 0
        }
    }));
    
    return <mesh ref={ref} visible={false} />;
}

// Camera controls setup
function CameraControls() {
    const { set } = useThree();
    
    const props = {
        maxPolarAngle: Math.PI * 0.85, // Limit looking up
        minPolarAngle: Math.PI * 0.15, // Limit looking down
        pointerSpeed: 0.5,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onUpdate: (controls: any) => {
            set({ controls });
        }
    };
    
    return <PointerLockControls {...props} />;
}

// Fallback component for when model loading fails
function ModelFallback({ templateData }: { templateData: GalleryTemplateData }) {
    const { dimensions, wallThickness, wallHeight } = templateData;
    const halfX = dimensions.xAxis / 2;
    const halfZ = dimensions.zAxis / 2;
    const wallY = wallHeight / 2;

    return (
        <>
            {/* Floor with grid helper */}
            <gridHelper
                args={[
                    Math.max(dimensions.xAxis, dimensions.zAxis),
                    Math.max(dimensions.xAxis, dimensions.zAxis) / 2,
                    "#666666",
                    "#444444"
                ]}
                rotation={[0, 0, 0]}
            />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[dimensions.xAxis, dimensions.zAxis]} />
                <meshStandardMaterial color="#f0f0f0" roughness={0.8} transparent opacity={0.5}/>
            </mesh>

            {/* Walls */}
            <mesh position={[0, wallY, -halfZ]} castShadow receiveShadow>
                <boxGeometry args={[dimensions.xAxis, wallHeight, wallThickness]} />
                <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.5}/>
            </mesh>

            <mesh position={[0, wallY, halfZ]} castShadow receiveShadow>
                <boxGeometry args={[dimensions.xAxis, wallHeight, wallThickness]} />
                <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.5}/>
            </mesh>

            <mesh position={[-halfX, wallY, 0]} castShadow receiveShadow>
                <boxGeometry args={[wallThickness, wallHeight, dimensions.zAxis]} />
                <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.5}/>
            </mesh>

            <mesh position={[halfX, wallY, 0]} castShadow receiveShadow>
                <boxGeometry args={[wallThickness, wallHeight, dimensions.zAxis]} />
                <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.5}/>
            </mesh>
        </>
    );
}

// Transform templateData into a format compatible with GalleryModel
function GalleryScene({ templateData, visible = false }: { templateData: GalleryTemplateData, visible?: boolean }) {
    // Convert templateData to the format expected by GalleryModel
    const config = {
        dimension: templateData.dimensions,
        wallThickness: templateData.wallThickness,
        modelPath: templateData.modelPath,
        modelScale: templateData.modelScale,
        modelPosition: templateData.modelPosition,
        modelRotation: templateData.modelRotation,
        customColliders: templateData.customColliders,
    };

    // If there's no modelPath, render a fallback
    if (!templateData.modelPath) {
        return (
            <>
                <Floor /> {/* Add floor physics plane */}
                <ModelFallback templateData={templateData} />
            </>
        );
    }

    // Custom colliders from the template

    return (
        <>
            <Floor /> {/* Add floor physics plane */}
            <GalleryModel config={config} visible={visible} />

            {/* Add ambient and direct lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={0.8}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <directionalLight position={[-10, 10, -5]} intensity={0.5} />
        </>
    );
}
// Main preview component
export default function PreviewMode({ 
    templateData, 
    isActive = true // New prop to control when component should be fully active
  }: { 
    templateData: GalleryTemplateData,
    isActive?: boolean 
  }) {
      const [active, setActive] = useState(false);
      const [showDebug, setShowDebug] = useState(false);
      const [initialPosition] = useState<[number, number, number]>([0, 1.5, 5]);
      
      // Reset active state when isActive prop changes
      useEffect(() => {
          if (!isActive && active) {
              setActive(false);
          }
      }, [isActive, active]);
      
      // Safely handle pointer lock when component unmounts or becomes inactive
      useEffect(() => {
          return () => {
              // Clean up pointer lock when component unmounts
              if (document.pointerLockElement) {
                  try {
                      document.exitPointerLock();
                  } catch (error) {
                      console.error("Failed to exit pointer lock on unmount:", error);
                  }
              }
          };
      }, []);
  
      // Instructions for controls
      const instructions = () => (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 text-white p-4">
              <div className="max-w-md text-center">
                  <h2 className="text-xl font-bold mb-4">Gallery Preview Mode</h2>
                  <p className="mb-2">Controls:</p>
                  <ul className="mb-4 text-sm">
                      <li>W, A, S, D - Move around</li>
                      <li>Mouse - Look around</li>
                      <li>ESC - Exit controls</li>
                  </ul>
                  <Button 
                      onClick={() => {
                          if (isActive) {
                              setActive(true);
                          }
                      }} 
                      className="flex items-center gap-2"
                      disabled={!isActive}
                  >
                      <Play className="h-4 w-4" /> Enter Preview
                  </Button>
              </div>
          </div>
      );
  
      return (
          <div className="relative w-full h-full">
              {!active && instructions()}
  
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                  {active && (
                      <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80 hover:bg-white"
                          onClick={() => setActive(false)}
                      >
                          <Pause className="mr-1 h-4 w-4" /> Pause
                      </Button>
                  )}
  
                  <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/80 hover:bg-white"
                      onClick={() => setShowDebug(!showDebug)}
                  >
                      {showDebug ? <EyeOff className="mr-1 h-4 w-4" /> : <Eye className="mr-1 h-4 w-4" />}
                      {showDebug ? 'Hide Debug' : 'Show Debug'}
                  </Button>
              </div>
  
              <KeyboardControls
                  map={[
                      { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
                      { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
                      { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
                      { name: 'right', keys: ['ArrowRight', 'd', 'D'] }
                  ]}
              >
                  <Canvas shadows>
                      {showDebug && <Stats />}
  
                      <PerspectiveCamera
                          makeDefault
                          position={initialPosition}
                          fov={75}
                      />
  
                      <Suspense fallback={<Loader />}>
                          <Environment preset="warehouse" />
                          <Physics 
                              gravity={GALLERY_CONFIG?.PHYSICS?.GRAVITY || [0, -30, 0]}
                              defaultContactMaterial={GALLERY_CONFIG?.PHYSICS?.CONTACT_MATERIAL || {
                                  friction: 0.1,
                                  restitution: 0.1
                              }}
                          >
                              {active && isActive && <Player />}
                              <GalleryScene templateData={templateData} visible={showDebug} />
                          </Physics>
                      </Suspense>
  
                      {active && isActive && <CameraControls />}
                      {active && isActive && <Crosshair />}
                      <Preload all />
                  </Canvas>
              </KeyboardControls>
          </div>
      );
  }