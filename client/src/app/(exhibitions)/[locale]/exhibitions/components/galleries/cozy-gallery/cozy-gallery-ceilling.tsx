// import {RepeatWrapping} from "three";
import { useCloudinaryAsset } from "@/hooks/useCloudinaryAsset";
import { TEXTURE_URL } from "@/utils/constants";
import { COZY_A1_ROOM_CONFIG } from "@/utils/gallery-config";

export default function CozyA1Ceilling() {
    const { X_AXIS, Y_AXIS, Z_AXIS } = COZY_A1_ROOM_CONFIG.DIMENSION;
    const ceilingTexture = useCloudinaryAsset(TEXTURE_URL.WHITE_WALL);

    // if (ceilingTexture) {
    //     // Set texture to repeat instead of stretching
    //     ceilingTexture.wrapS = RepeatWrapping;
    //     ceilingTexture.wrapT = RepeatWrapping;
    //     // Adjust the repeat values as needed, here we use fixed values.
    //     ceilingTexture.repeat.set(15, 15);
    //     ceilingTexture.needsUpdate = true;
    // }

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