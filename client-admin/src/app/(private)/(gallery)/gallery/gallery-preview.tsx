'use client';

import React, { Suspense, useContext, useMemo } from 'react';
import { usePlane } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import * as THREE from 'three';

// --- Context Placeholder (Keep your actual context import) ---
// Assuming GalleryTemplateContext provides data as before
import { GalleryTemplateContext } from './gallery-template-creator'; // Adjust import path if needed

// --- Helper Components (GLTF Loading, Fallbacks - No changes needed here) ---

function GLTFModel({ path, scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }: { path: string; scale?: number; rotation?: [number, number, number]; position?: [number, number, number] }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene.clone()} scale={[scale, scale, scale]} rotation={rotation} position={position} />;
}

function ModelFallback({ scale = 1, position = [0, 0, 0] }: { scale?: number; position?: [number, number, number] }) {
  return (
    <mesh scale={[scale, scale, scale]} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function LoadingPlaceholder({ scale = 1, position = [0, 0, 0] }: { scale?: number; position?: [number, number, number] }) {
  return (
    <mesh scale={[scale, scale, scale]} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial wireframe color="gray" />
    </mesh>
  );
}

function Model({ path, scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }: {
  path: string;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}) {
  const isValidPath = useMemo(() => Boolean(path && path.trim()), [path]);

  if (!isValidPath) {
    console.warn("No model path provided or path is invalid for Model component.");
    return null;
  }

  return (
    <ErrorBoundary fallback={<ModelFallback scale={scale} position={position} />} onError={(error) => console.error(`Error loading model from ${path}:`, error)}>
      <Suspense fallback={<LoadingPlaceholder scale={scale} position={position} />}>
        <GLTFModel path={path} scale={scale} rotation={rotation} position={position} />
      </Suspense>
    </ErrorBoundary>
  );
}

// --- NEW: Artwork Position Visualizer Component ---
// This component renders a single artwork position placeholder.
// It receives the pre-calculated materials array as a prop.
function ArtworkPositionVisualizer({ artwork, materials }: {
  artwork: { position: [number, number, number]; rotation: [number, number, number]; };
  materials: THREE.Material[]; // Expects an array of 6 materials
}) {
  // Basic validation
  if (!artwork || materials.length !== 6) {
    console.error("Invalid props for ArtworkPositionVisualizer");
    return null;
  }

  return (
    <mesh
      position={artwork.position}
      rotation={artwork.rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 0.05]} />
      {/* Apply materials using primitive and attach */}
      {/* We map over the received materials array */}
      {materials.map((material, index) => (
        <primitive
          key={index} // Use index as key since material order is fixed
          object={material}
          attach={`material-${index}`} // material-0, material-1, ... material-5
        />
      ))}
    </mesh>
  );
}


// --- Main Scene Component (Refactored) ---
export default function GalleryPreview({ showColliders }: { showColliders: boolean }) {
  const { templateData } = useContext(GalleryTemplateContext);
  const {
    dimensions = { xAxis: 10, zAxis: 10 },
    wallThickness = 0.1,
    wallHeight = 3,
    modelPath,
    modelScale = 1,
    modelRotation = [0, 0, 0],
    modelPosition = [0, 0, 0],
    customColliders = [],
    artworkPlacements: rawArtworkPlacements
  } = templateData || {};

  const halfX = dimensions.xAxis / 2;
  const halfZ = dimensions.zAxis / 2;
  const wallY = wallHeight / 2;

  const artworkPlacements = useMemo(() => rawArtworkPlacements || [], [rawArtworkPlacements]);

  // --- Define Materials at the Top Level using useMemo ---
  const artworkFrontMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 'lightgreen', side: THREE.DoubleSide, transparent: true, opacity: 0.75
  }), []);
  const artworkBackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 'salmon', side: THREE.DoubleSide, transparent: true, opacity: 0.75
  }), []);
  const artworkSideMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 'gold', side: THREE.DoubleSide, transparent: true, opacity: 0.75
  }), []);

  // Memoize the array of materials in the correct order
  // Order: +X, -X, +Y, -Y, +Z (Front), -Z (Back)
  const artworkBoxMaterials = useMemo(() => [
    artworkSideMaterial,    // Right
    artworkSideMaterial,    // Left
    artworkSideMaterial,    // Top
    artworkSideMaterial,    // Bottom
    artworkFrontMaterial,   // Front
    artworkBackMaterial     // Back
  ], [artworkFrontMaterial, artworkBackMaterial, artworkSideMaterial]); // Dependencies are the materials themselves
  // --- End Material Definition ---


  // Floor plane (physics)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [floorRef] = usePlane<THREE.Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0], material: { friction: 0.1 }
  }));

  return (
    <>
      {/* Floor Helper Grid */}
      <gridHelper
        args={[Math.max(dimensions.xAxis, dimensions.zAxis) * 1.5, Math.max(dimensions.xAxis, dimensions.zAxis) * 1.5 / 2, "#666666", "#444444"]}
        position={[0, 0.01, 0]}
      />

      {/* Basic Walls (only if no model) */}
      <>
        {/* Back wall */}
        <mesh position={[0, wallY, -halfZ]} castShadow receiveShadow>
          <boxGeometry args={[dimensions.xAxis, wallHeight, wallThickness]} />
          <meshStandardMaterial color="#f0f0f0" transparent opacity={0.5} />
        </mesh>
        {/* Front wall */}
        <mesh position={[0, wallY, halfZ]} castShadow receiveShadow>
          <boxGeometry args={[dimensions.xAxis, wallHeight, wallThickness]} />
          <meshStandardMaterial color="#f0f0f0" transparent opacity={0.5} />
        </mesh>
        {/* Left wall */}
        <mesh position={[-halfX, wallY, 0]} castShadow receiveShadow>
          <boxGeometry args={[wallThickness, wallHeight, dimensions.zAxis]} />
          <meshStandardMaterial color="#f0f0f0" transparent opacity={0.5} />
        </mesh>
        {/* Right wall */}
        <mesh position={[halfX, wallY, 0]} castShadow receiveShadow>
          <boxGeometry args={[wallThickness, wallHeight, dimensions.zAxis]} />
          <meshStandardMaterial color="#f0f0f0" transparent opacity={0.5} />
        </mesh>
      </>

      {/* Custom colliders */}
      {showColliders && customColliders.map((collider, index) => {
        const pos = collider.position || [0, 0, 0];
        const rot = collider.rotation || [0, 0, 0];
        if (collider.shape === 'box') {
          const args = collider.args || [1, 1, 1];
          return (
            <mesh key={`collider-box-${index}`} position={pos} rotation={rot}>
              <boxGeometry args={args} />
              <meshStandardMaterial color="blue" transparent opacity={0.3} />
            </mesh>
          );
        } else if (collider.shape === 'curved') {
          const radius = collider.radius || 1;
          const height = collider.height || wallHeight;
          const segments = collider.segments || 32;
          const arc = collider.arc || Math.PI * 2;
          return (
            <mesh key={`collider-curved-${index}`} position={pos} rotation={rot}>
              <cylinderGeometry args={[radius, radius, height, segments, 1, true, 0, arc]} />
              <meshStandardMaterial
                color="purple"
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        }
        return null;
      })}

      {/* --- Render Artwork Positions using the new Component --- */}
      {/* We pass the memoized materials array to each instance */}
      {showColliders && artworkPlacements.map((artwork, index) => (
        <ArtworkPositionVisualizer
          key={`artwork-vis-${index}`} // Key goes on the component instance in the list
          artwork={artwork}
          materials={artworkBoxMaterials} // Pass the memoized materials array
        />
      ))}
      {/* --- End Artwork Position Rendering --- */}


      {/* Load 3D model */}
      {modelPath && (
        <Model path={modelPath} scale={modelScale} rotation={modelRotation} position={modelPosition} />
      )}
    </>
  );
}