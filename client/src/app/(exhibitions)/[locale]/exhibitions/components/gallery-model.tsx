"use client";
import { useGLTF } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import * as THREE from "three";
import { useMemo } from "react";
import { Collider } from "./collider";
import { CustomCollider, Vec3 } from "@/types/new-gallery";

interface Dimensions {
  xAxis: number;
  yAxis: number;
  zAxis: number;
}

interface GalleryConfig {
  dimension: Dimensions;
  wallThickness: number;
  modelPath: string;
  modelScale: number;
  modelPosition: Vec3;
  modelRotation: Vec3;
  customColliders?: CustomCollider[];
}

interface GalleryModelProps {
  config: GalleryConfig;
  visible?: boolean;
}

export default function GalleryModel({
  config,
  visible = false,
}: GalleryModelProps) {

  const { scene } = useGLTF(config.modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const { xAxis, yAxis, zAxis } = config.dimension;
  const { wallThickness, modelScale, modelPosition, modelRotation } = config;

  const halfX = xAxis / 2;
  const halfZ = zAxis / 2;
  const wallY = yAxis / 2;

  const [ref] = usePlane<THREE.Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction: 0 },
  }));

  const walls = useMemo(() => {
    const baseWalls: CustomCollider[] = [
      //back wall
      { shape: "box", position: [0, wallY, -halfZ], rotation: [0, 0, 0], args: [xAxis, yAxis, wallThickness] },
      //front wall
      { shape: "box", position: [0, wallY, halfZ], rotation: [0, 0, 0], args: [xAxis, yAxis, wallThickness] },
      //left wall
      { shape: "box", position: [-halfX, wallY, 0], rotation: [0, 0, 0], args: [wallThickness, yAxis, zAxis] },
      //right wall
      { shape: "box", position: [halfX, wallY, 0], rotation: [0, 0, 0], args: [wallThickness, yAxis, zAxis] },
    ];

 

    return baseWalls;
  }, [wallY, halfZ, halfX, xAxis, yAxis, zAxis, wallThickness]);

  const allColliders = useMemo(() => {
    const customColliders = config.customColliders || [];
    return [...walls, ...customColliders];
  }
  , [walls, config.customColliders]);


  return (
    <>
      <mesh ref={ref} visible={visible} />
      <primitive object={clonedScene} scale={modelScale} position={modelPosition} rotation={modelRotation}/>
      {allColliders.map((collider, index) => (
        <Collider key={`collider-${index}`} {...collider} visible={visible} />
      ))}
    </>
  );
}
