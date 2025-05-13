
'use client';

import { useState, Suspense, useEffect, useRef } from 'react'; // Import useRef
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
    PerspectiveCamera,
    KeyboardControls,
    Environment,
    PointerLockControls as DreiPointerLockControls, // Rename to avoid conflict
    Preload
} from '@react-three/drei';
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib'; // Import the type
import { Physics, usePlane } from '@react-three/cannon';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

import { GALLERY_CONFIG } from '@/utils/gallery-config';
import GalleryModel from './gallery-model';
import Player from './player';
import { Loader } from './gallery-loader';
import { Crosshair } from './crosshair';
import { Gallery } from '@/types/new-gallery';

// --- Floor Component (no changes needed) ---
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

// --- Camera controls setup ---
// Store controls instance in a ref to call unlock() imperatively
function CameraControls({ controlsRef }: { controlsRef: React.MutableRefObject<PointerLockControlsImpl | null> }) {
    const { set } = useThree();

    const props = {
        maxPolarAngle: Math.PI * 0.85,
        minPolarAngle: Math.PI * 0.15,
        pointerSpeed: 0.5,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onUpdate: (controls: any) => {
            set({ controls });
            controlsRef.current = controls as PointerLockControlsImpl; // Store the instance
        },
        // Add selector to target the canvas directly if needed, usually not required
        // selector: '#canvas-container' // Example if canvas had this ID
    };

    return <DreiPointerLockControls {...props} />;
}


// --- ModelFallback Component (no changes needed) ---
function ModelFallback({ templateData }: { templateData: Gallery }) {
    // ... (implementation remains the same)
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

// --- GalleryScene Component (no changes needed) ---
function GalleryScene({ templateData, visible = false }: { templateData: Gallery, visible?: boolean }) {
    // ... (implementation remains the same)
    const config = {
        dimension: templateData.dimensions,
        wallThickness: templateData.wallThickness,
        modelPath: templateData.modelPath,
        modelScale: templateData.modelScale,
        modelPosition: templateData.modelPosition,
        modelRotation: templateData.modelRotation,
        customColliders: templateData.customColliders,
    };

    if (!templateData.modelPath) {
        return (
            <>
                <Floor />
                <ModelFallback templateData={templateData} />
            </>
        );
    }

    return (
        <>
            <Floor />
            <GalleryModel config={config} visible={visible} />
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

// --- Main PreviewMode component ---
export default function PreviewMode({
    templateData,
    isActive = true
}: {
    templateData: Gallery,
    isActive?: boolean
}) {
    const [active, setActive] = useState(false);
    const [initialPosition] = useState<[number, number, number]>([0, 1.5, 5]);
    const controlsRef = useRef<PointerLockControlsImpl | null>(null); // Ref for controls instance

    // Function to safely exit pointer lock
    const safeExitPointerLock = () => {
        // Check if controls exist and are locked
        if (controlsRef.current?.isLocked) {
             controlsRef.current.unlock(); // Use the controls' unlock method
        }
        // Fallback or additional check using document API
        if (document.pointerLockElement) {
            try {
                document.exitPointerLock();
            } catch (error) {
                // Log warning if exit fails (might happen if element is already gone)
                console.warn("Attempted to exit pointer lock but failed:", error);
            }
        }
    };

    // Effect to handle changes in the isActive prop from parent
    useEffect(() => {
        if (!isActive) {
            // If the parent component signals inactivity (e.g., modal closing)
            if (active) { // If controls were active internally
                safeExitPointerLock(); // Ensure pointer lock is released
                setActive(false); // Sync internal state
            }
        } else if (!active) {
            // If parent is active, but internal state is not, ensure lock is released
            // (e.g., coming back from pause)
            safeExitPointerLock();
        }
    }, [isActive, active]); // Depend on both props and internal state

    // Effect for component unmount cleanup
    useEffect(() => {
        // Return a cleanup function
        return () => {
            safeExitPointerLock(); // Attempt release on unmount
        };
    }, []); // Empty dependency array ensures this runs only on unmount

    // Handler for entering preview
    const handleEnterPreview = () => {
        if (isActive) { // Only allow activation if the parent allows it
            setActive(true);
            // Pointer lock will be requested by PointerLockControls upon user click inside canvas
        }
    };

    // Handler for pausing (e.g., clicking Pause button)
    const handlePause = () => {
        safeExitPointerLock(); // Release lock when pausing
        setActive(false);
    };


    const instructions = () => (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 text-white p-4">
            <div className="max-w-md text-center flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4">Gallery Preview Mode</h2>
                <p className="mb-2">Controls:</p>
                <ul className="mb-4 text-sm">
                    <li>W, A, S, D - Move around</li>
                    <li>Mouse - Look around</li>
                    <li>ESC - Exit controls (automatic)</li>
                </ul>
                <Button
                    onClick={handleEnterPreview}
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
            {/* Show instructions only if parent is active AND internal state is inactive */}
            {isActive && !active && instructions()}

            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {/* Show Pause button only if parent is active AND internal state is active */}
                {isActive && active && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/80 hover:bg-white"
                        onClick={handlePause} // Use dedicated pause handler
                    >
                        <Pause className="mr-1 h-4 w-4" /> Pause
                    </Button>
                )}
                {/* Debug button removed for clarity */}
            </div>

            <KeyboardControls
                map={[
                    { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
                    { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
                    { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
                    { name: 'right', keys: ['ArrowRight', 'd', 'D'] }
                ]}
            >
                {/* Ensure Canvas only renders if the parent allows it */}
                {isActive && (
                     <Canvas shadows id="preview-canvas"> {/* Optionally give canvas an ID */}
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
                                {/* Player uses internal 'active' state */}
                                {active && <Player />}
                                <GalleryScene templateData={templateData} />
                            </Physics>
                        </Suspense>

                        {/* Controls use internal 'active' state and get the ref */}
                        {active && <CameraControls controlsRef={controlsRef} />}
                        {active && <Crosshair />}
                        <Preload all />
                    </Canvas>
                )}
            </KeyboardControls>
        </div>
    );
}

// 'use client';

// import { useState, Suspense, useEffect } from 'react';
// import { Canvas, useThree } from '@react-three/fiber';
// import * as THREE from 'three';
// import {
//     PerspectiveCamera,
//     KeyboardControls,
//     Environment,
//     PointerLockControls,
//     Preload
// } from '@react-three/drei';
// import { Physics, usePlane } from '@react-three/cannon';
// import { Button } from '@/components/ui/button';
// import { Pause, Play } from 'lucide-react';

// import { GALLERY_CONFIG } from '@/utils/gallery-config';
// import GalleryModel from './gallery-model';
// import Player from './player';
// import { Loader } from './gallery-loader';
// import { Crosshair } from './crosshair';
// import { Gallery } from '@/types/new-gallery';

// function Floor() {
//     const [ref] = usePlane<THREE.Mesh>(() => ({ 
//         rotation: [-Math.PI / 2, 0, 0], 
//         position: [0, 0, 0],
//         type: 'Static',
//         material: { 
//             friction: 0.1,
//             restitution: 0
//         }
//     }));
    
//     return <mesh ref={ref} visible={false} />;
// }

// // Camera controls setup
// function CameraControls() {
//     const { set } = useThree();
    
//     const props = {
//         maxPolarAngle: Math.PI * 0.85, // Limit looking up
//         minPolarAngle: Math.PI * 0.15, // Limit looking down
//         pointerSpeed: 0.5,
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         onUpdate: (controls: any) => {
//             set({ controls });
//         }
//     };
    
//     return <PointerLockControls {...props} />;
// }

// // Fallback component for when model loading fails
// function ModelFallback({ templateData }: { templateData: Gallery }) {
//     const { dimensions, wallThickness, wallHeight } = templateData;
//     const halfX = dimensions.xAxis / 2;
//     const halfZ = dimensions.zAxis / 2;
//     const wallY = wallHeight / 2;

//     return (
//         <>
//             {/* Floor with grid helper */}
//             <gridHelper
//                 args={[
//                     Math.max(dimensions.xAxis, dimensions.zAxis),
//                     Math.max(dimensions.xAxis, dimensions.zAxis) / 2,
//                     "#666666",
//                     "#444444"
//                 ]}
//                 rotation={[0, 0, 0]}
//             />

//             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
//                 <planeGeometry args={[dimensions.xAxis, dimensions.zAxis]} />
//                 <meshStandardMaterial color="#f0f0f0" roughness={0.8} transparent opacity={0.5}/>
//             </mesh>

//             {/* Walls */}
//             <mesh position={[0, wallY, -halfZ]} castShadow receiveShadow>
//                 <boxGeometry args={[dimensions.xAxis, wallHeight, wallThickness]} />
//                 <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.5}/>
//             </mesh>

//             <mesh position={[0, wallY, halfZ]} castShadow receiveShadow>
//                 <boxGeometry args={[dimensions.xAxis, wallHeight, wallThickness]} />
//                 <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.5}/>
//             </mesh>

//             <mesh position={[-halfX, wallY, 0]} castShadow receiveShadow>
//                 <boxGeometry args={[wallThickness, wallHeight, dimensions.zAxis]} />
//                 <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.5}/>
//             </mesh>

//             <mesh position={[halfX, wallY, 0]} castShadow receiveShadow>
//                 <boxGeometry args={[wallThickness, wallHeight, dimensions.zAxis]} />
//                 <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.5}/>
//             </mesh>
//         </>
//     );
// }

// // Transform templateData into a format compatible with GalleryModel
// function GalleryScene({ templateData, visible = false }: { templateData: Gallery, visible?: boolean }) {
//     // Convert templateData to the format expected by GalleryModel
//     const config = {
//         dimension: templateData.dimensions,
//         wallThickness: templateData.wallThickness,
//         modelPath: templateData.modelPath,
//         modelScale: templateData.modelScale,
//         modelPosition: templateData.modelPosition,
//         modelRotation: templateData.modelRotation,
//         customColliders: templateData.customColliders,
//     };

//     // If there's no modelPath, render a fallback
//     if (!templateData.modelPath) {
//         return (
//             <>
//                 <Floor /> {/* Add floor physics plane */}
//                 <ModelFallback templateData={templateData} />
//             </>
//         );
//     }

//     return (
//         <>
//             <Floor /> {/* Add floor physics plane */}
//             <GalleryModel config={config} visible={visible} />

//             {/* Add ambient and direct lighting */}
//             <ambientLight intensity={0.5} />
//             <directionalLight
//                 position={[10, 10, 5]}
//                 intensity={0.8}
//                 castShadow
//                 shadow-mapSize={[2048, 2048]}
//             />
//             <directionalLight position={[-10, 10, -5]} intensity={0.5} />
//         </>
//     );
// }
// // Main preview component
// export default function PreviewMode({ 
//     templateData, 
//     isActive = true // New prop to control when component should be fully active
//   }: { 
//     templateData: Gallery,
//     isActive?: boolean 
//   }) {
//       const [active, setActive] = useState(false);
//     //   const [showDebug, setShowDebug] = useState(false);
//       const [initialPosition] = useState<[number, number, number]>([0, 1.5, 5]);
      
//       // Reset active state when isActive prop changes
//       useEffect(() => {
//           if (!isActive && active) {
//               setActive(false);
//           }
//       }, [isActive, active]);
      
//       // Safely handle pointer lock when component unmounts or becomes inactive
//       useEffect(() => {
//           return () => {
//               // Clean up pointer lock when component unmounts
//               if (document.pointerLockElement) {
//                   try {
//                       document.exitPointerLock();
//                   } catch (error) {
//                       console.error("Failed to exit pointer lock on unmount:", error);
//                   }
//               }
//           };
//       }, []);
  
//       // Instructions for controls
//       const instructions = () => (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 text-white p-4">
//               <div className="max-w-md text-center">
//                   <h2 className="text-xl font-bold mb-4">Gallery Preview Mode</h2>
//                   <p className="mb-2">Controls:</p>
//                   <ul className="mb-4 text-sm">
//                       <li>W, A, S, D - Move around</li>
//                       <li>Mouse - Look around</li>
//                       <li>ESC - Exit controls</li>
//                   </ul>
//                   <Button 
//                       onClick={() => {
//                           if (isActive) {
//                               setActive(true);
//                           }
//                       }} 
//                       className="flex items-center gap-2"
//                       disabled={!isActive}
//                   >
//                       <Play className="h-4 w-4" /> Enter Preview
//                   </Button>
//               </div>
//           </div>
//       );
  
//       return (
//           <div className="relative w-full h-full">
//               {!active && instructions()}
  
//               <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
//                   {active && (
//                       <Button
//                           variant="outline"
//                           size="sm"
//                           className="bg-white/80 hover:bg-white"
//                           onClick={() => setActive(false)}
//                       >
//                           <Pause className="mr-1 h-4 w-4" /> Pause
//                       </Button>
//                   )}
// {/*   
//                   <Button
//                       variant="outline"
//                       size="sm"
//                       className="bg-white/80 hover:bg-white"
//                       onClick={() => setShowDebug(!showDebug)}
//                   >
//                       {showDebug ? <EyeOff className="mr-1 h-4 w-4" /> : <Eye className="mr-1 h-4 w-4" />}
//                       {showDebug ? 'Hide Debug' : 'Show Debug'}
//                   </Button> */}
//               </div>
  
//               <KeyboardControls
//                   map={[
//                       { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
//                       { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
//                       { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
//                       { name: 'right', keys: ['ArrowRight', 'd', 'D'] }
//                   ]}
//               >
//                   <Canvas shadows>
//                       {/* {showDebug && <Stats />} */}
  
//                       <PerspectiveCamera
//                           makeDefault
//                           position={initialPosition}
//                           fov={75}
//                       />
  
//                       <Suspense fallback={<Loader />}>
//                           <Environment preset="warehouse" />
//                           <Physics 
//                               gravity={GALLERY_CONFIG?.PHYSICS?.GRAVITY || [0, -30, 0]}
//                               defaultContactMaterial={GALLERY_CONFIG?.PHYSICS?.CONTACT_MATERIAL || {
//                                   friction: 0.1,
//                                   restitution: 0.1
//                               }}
//                           >
//                               {active && isActive && <Player />}
//                               <GalleryScene templateData={templateData}/>
//                           </Physics>
//                       </Suspense>
  
//                       {active && isActive && <CameraControls />}
//                       {active && isActive && <Crosshair />}
//                       <Preload all />
//                   </Canvas>
//               </KeyboardControls>
//           </div>
//       );
//   }

// src/app/(exhibitions)/[locale]/exhibitions/components/preview-mode.tsx