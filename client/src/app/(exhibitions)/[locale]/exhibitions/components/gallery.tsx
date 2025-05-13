// src/app/(exhibitions)/[locale]/exhibitions/[linkname]/components/gallery.tsx
import React from 'react';
import { BaseRoom } from './base-room';
import { ArtworkMesh } from './art-work-mesh'; // Adjusted path assuming structure
import GalleryModelBase from './gallery-model-base';
import { Gallery as GalleryType } from '@/types/new-gallery';
import { ExhibitionArtwork } from '@/types/exhibition';
import { Session } from 'next-auth'; // <-- Import Session type

// Interface for GalleryArtwork (remains the same)
export interface GalleryArtwork {
  exhibitionId?: string;
  artwork: ExhibitionArtwork;
  placement: {
    position: number[];
    rotation: number[];
  };
  likes?: {
    userIds: string[];
    count: number;
  };
}

// Interface for GalleryConfig (remains the same)
export interface GalleryConfig {
  id: string;
  name: string;
  galleryModel: GalleryType;
  artworks: GalleryArtwork[];
}

// --- Update props interface ---
interface GalleryComponentProps { // Renamed to avoid conflict with type name
  config: GalleryConfig;
  visible?: boolean;
  children?: React.ReactNode;
  session: Session | null; // <-- Accept session
}
// --- End update props ---

export default function Gallery({ config, visible = false, children, session }: GalleryComponentProps) { // <-- Use updated props
  const { xAxis, yAxis, zAxis } = config.galleryModel.dimensions;
  return (
    <>
      <group>
        <BaseRoom
          key={`exhibition-${config.id}`}
          position={[0, 0, 0]}
          dimensions={{ width: xAxis, height: yAxis, depth: zAxis }}
        >
          {/* Pass session down to each ArtworkMesh */}
          {config.artworks.map(artworkItem => (
            <ArtworkMesh
              key={`artwork-${artworkItem.artwork._id}`}
              galleryArtwork={artworkItem}
              session={session} // <-- Pass session here
            />
          ))}
          {/* End passing session */}

          <GalleryModelBase model={config.galleryModel} visible={visible} />
          {children}
        </BaseRoom>
      </group>
    </>
  );
}