import * as THREE from "three";
import { useCloudinaryAsset } from "@/hooks/useCloudinaryAsset";
import { TEXTURE_URL } from "@/utils/constants";
import { M2_ROOM_CONFIG } from "@/utils/gallery-config";

export default function ClassicA1GalleryCeilling() {
    const { X_AXIS, Y_AXIS, Z_AXIS } = M2_ROOM_CONFIG.DIMENSION;
    const ceilingTexture = useCloudinaryAsset(TEXTURE_URL.CELLING_GYPSUM);

    if (ceilingTexture) {
        // Set texture to repeat instead of stretching
        ceilingTexture.wrapS = THREE.RepeatWrapping;
        ceilingTexture.wrapT = THREE.RepeatWrapping;
        // Adjust the repeat values as needed, here we use fixed values.
        ceilingTexture.repeat.set(15, 15);
        ceilingTexture.needsUpdate = true;
    }

    return (
        <mesh
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, Y_AXIS, 0]}
        >
            <boxGeometry args={[X_AXIS, Z_AXIS, 0.3]} />
            <meshBasicMaterial map={ceilingTexture} color={'#ffffff'}/>
        </mesh>
    );
}