// 'use client';

// import { GALLERY_REGISTRY, RoomType } from '@/utils/gallery-registry';

// interface RoomSelectorProps {
//   roomId: RoomType;
// }

// export function RoomSelector({ roomId }: RoomSelectorProps) {
//   const Gallery = GALLERY_REGISTRY[roomId];
  
//   if (!Gallery) {
//     console.error(`Room with ID "${roomId}" not found`);
//     return null;
//   }

//   return <Gallery />;
// }