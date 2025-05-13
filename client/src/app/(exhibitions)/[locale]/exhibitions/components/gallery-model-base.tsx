import React from 'react';
import GalleryModel from './gallery-model';
import { Gallery } from '@/types/new-gallery';
import { BoxColliderConfig } from '@/types/gallery';



interface GalleryModelBaseProps {
  model: Gallery;
  visible?: boolean;
}

export default function GalleryModelBase({ model, visible = false }: GalleryModelBaseProps) {
  const galleryModelComponentConfig = {
    dimension: model.dimensions,
    wallThickness: model.wallThickness,
    wallHeight: model.wallHeight, // Pass height if needed
    modelPath: model.modelPath,
    modelPosition: model.modelPosition,
    modelRotation: model.modelRotation,
    modelScale: model.modelScale,
    // --- Handle Colliders ---
    // Option 1: Pass the whole array if GalleryModel supports it
    customColliders: model.customColliders,

    // Option 2: Take the first collider if GalleryModel expects one (or none)
    // customCollider: model.customColliders && model.customColliders.length > 0
    //     ? {
    //         // Map the fields from NewCustomCollider to what GalleryModel expects
    //         shape: model.customColliders[0].shape,
    //         ...(model.customColliders[0].shape === 'box' && {
    //             args: (model.customColliders[0] as BoxColliderConfig).args,
    //         }),
    //         position: model.customColliders[0].position,
    //         rotation: model.customColliders[0].rotation,
    //         // Add radius, height etc. if needed based on shape
    //         ...(model.customColliders[0].shape === 'curved' && {
    //             // Add properties for non-box shapes based on your NewCustomCollider definition
    //             radius: model.customColliders[0].radius,
    //             height: model.customColliders[0].height,
    //             segments: model.customColliders[0].segments,
    //             arc: model.customColliders[0].arc,
    //         })
    //     }
    //     : undefined, // Pass undefined if no colliders exist

     // Add any other transformations needed for GalleryModel
};
  return (
    <GalleryModel
      key={`gallery-model-${model._id}`}
      config={galleryModelComponentConfig}
      visible={visible}
    />
  );
}