// import React from 'react';
// import GalleryModelBase, { GalleryModelConfig } from '../../gallery-model-base';
// import { MODERN_A2_GALLERY_CONFIG } from '@/utils/gallery-config';

// export const MODERN_A2_MODEL: GalleryModelConfig = {
//   id: 'modern-a2',
//   name: 'Modern A2 Gallery',
//   description: 'A modern gallery space with open floor plan',
//   dimension: {
//     xAxis: MODERN_A2_GALLERY_CONFIG.DIMENSION.X_AXIS,
//     yAxis: MODERN_A2_GALLERY_CONFIG.DIMENSION.Y_AXIS,
//     zAxis: MODERN_A2_GALLERY_CONFIG.DIMENSION.Z_AXIS,
//   },
//   wallThickness: 0.2,
//   modelPath: '/modern-a2-gallery.glb',
//   modelScale: 4,
//   customCollider: {
//     shape: 'box',
//     args: [4, 4, 4] as [number, number, number],
//     position: [0, 1.5, 0] as [number, number, number]
//   }
// };

// interface ModernA2ModelProps {
//   visible?: boolean;
// }

// export default function ModernA2Model({ visible = false }: ModernA2ModelProps) {
//   return <GalleryModelBase model={MODERN_A2_MODEL} visible={visible} />;
// }