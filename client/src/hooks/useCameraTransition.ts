import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import gsap from 'gsap';
import { useCameraStore } from '@/store/cameraStore';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { Vector3, Euler, Matrix4 } from 'three';

export function useCameraTransition() {
  const { camera, scene } = useThree();
  const { controls } = useThree<{ controls: PointerLockControls }>();
  const { targetPosition, setIsLocked } = useCameraStore();

  useEffect(() => {
    if (!targetPosition) {
      // Reset camera when target is null
      if (controls) {
        controls.enabled = true;
        controls.lock();
      }
      setIsLocked(false);
      return;
    }

    // Lock controls during transition
    if (controls) {
      controls.enabled = false;
      controls.unlock();
    }
    setIsLocked(true);

    // Find the clicked artwork in the scene to get its rotation
    let artworkRotation = new Euler(0, 0, 0);
    const viewDistance = 2.5; // Distance from artwork
    
    // Try to find the artwork object in the scene
    scene.traverse((object) => {
      if (object.type === 'Group' && object.position.distanceTo(targetPosition) < 0.1) {
        // Found the artwork group, use its rotation
        artworkRotation = object.rotation;
      }
    });

    // Calculate normal vector based on rotation
    // For a plane, the normal is typically along the z-axis (0,0,1)
    // We need to transform this normal by the artwork's rotation matrix
    const normalVector = new Vector3(0, 0, 1);
    const rotationMatrix = new Matrix4().makeRotationFromEuler(artworkRotation);
    normalVector.applyMatrix4(rotationMatrix);
    
    // Calculate optimal viewing position - move in the direction of the normal
    const viewPosition = targetPosition.clone().addScaledVector(normalVector, viewDistance);
    viewPosition.y += 0.2; // Slight elevation for better viewing

    const tl = gsap.timeline({
      onComplete: () => {
        if (controls) {
          controls.enabled = false;
          controls.unlock();
        }
      }
    });

    // Camera movement animation
    tl.to(camera.position, {
      x: viewPosition.x,
      y: viewPosition.y,
      z: viewPosition.z,
      duration: 1.5,
      ease: 'power3.inOut',
      onUpdate: () => {
        // Always look directly at the artwork
        camera.lookAt(targetPosition);
      }
    });

    return () => {
      if (tl) {
        tl.kill();
        tl.clear();
      }
    };
  }, [targetPosition, camera, controls, setIsLocked, scene]);
}