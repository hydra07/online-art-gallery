import { Vec3 } from "@/types/gallery";

/**
 * Calculates artwork positions for any wall in a room, including interior divider walls
 * @param options Configuration options for wall artwork positioning
 * @returns Array of positions and rotations for artworks
 */
export function calculateWallArtworkPositions(
  options: {
    // Standard wall types OR custom for arbitrary walls
    wallType: 'front' | 'back' | 'left' | 'right' | 'custom';
    // Wall dimension (width/length of the wall)
    wallDimension: number;
    // Number of artworks to place on the wall
    artworkCount: number;
    // Room dimensions
    roomDimensions: { xAxis: number; yAxis: number; zAxis: number };
    // Wall offset (distance from wall surface)
    wallOffset?: number;
    // Height position for artworks
    heightPosition?: number;
    // For custom walls only: wall position
    wallPosition?: Vec3;
    // For custom walls only: wall rotation in radians
    wallRotation?: Vec3;
    // For custom walls only: direction vector for artwork offset
    offsetDirection?: Vec3;
  }
): { positions: Vec3[], rotations: Vec3[] } {
  const {
    wallType,
    wallDimension,
    artworkCount,
    roomDimensions,
    wallOffset = 0.15,
    heightPosition = 4,
    wallPosition = [0, 0, 0],
    wallRotation = [0, 0, 0],
    offsetDirection = [0, 0, 1]  // Default offset direction is along positive Z
  } = options;
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { xAxis, yAxis, zAxis } = roomDimensions;
  const spacing = wallDimension / (artworkCount + 1);

  // Calculate base positions along wall
  const basePositions = Array.from({ length: artworkCount }, (_, i) => {
    const position = spacing * (i + 1) - wallDimension / 2;
    return position;
  });

  let positions: Vec3[] = [];
  let rotations: Vec3[] = [];

  // Handle standard wall types
  if (wallType !== 'custom') {
    switch (wallType) {
      case 'back':
        positions = basePositions.map(pos => [pos, heightPosition, -zAxis / 2 + wallOffset] as Vec3);
        rotations = Array(artworkCount).fill([0, 0, 0] as Vec3);
        break;
      case 'front':
        positions = basePositions.map(pos => [pos, heightPosition, zAxis / 2 - wallOffset] as Vec3);
        rotations = Array(artworkCount).fill([0, Math.PI, 0] as Vec3);
        break;
      case 'left':
        positions = basePositions.map(pos => [-xAxis / 2 + wallOffset, heightPosition, pos] as Vec3);
        rotations = Array(artworkCount).fill([0, Math.PI / 2, 0] as Vec3);
        break;
      case 'right':
        positions = basePositions.map(pos => [xAxis / 2 - wallOffset, heightPosition, pos] as Vec3);
        rotations = Array(artworkCount).fill([0, -Math.PI / 2, 0] as Vec3);
        break;
    }
    return { positions, rotations };
  }

  // Handle custom wall (e.g., interior divider walls)
  // For custom walls, artworks should have the same rotation as the wall
  positions = basePositions.map(pos => {
    // Position along primary axis based on wall orientation
    let primaryAxisValue: number;
    let secondaryAxisValue: number;
    
    if (Math.abs(Math.sin(wallRotation[1])) > Math.abs(Math.cos(wallRotation[1]))) {
      // Wall runs along Z axis
      primaryAxisValue = pos;
      secondaryAxisValue = wallPosition[0];
      
      // Calculate position with proper offset from wall
      return [
        secondaryAxisValue + offsetDirection[0] * wallOffset,
        heightPosition,
        wallPosition[2] + primaryAxisValue
      ] as Vec3;
    } else {
      // Wall runs along X axis
      primaryAxisValue = pos;
      secondaryAxisValue = wallPosition[2];
      
      // Calculate position with proper offset from wall
      return [
        wallPosition[0] + primaryAxisValue,
        heightPosition,
        secondaryAxisValue + offsetDirection[2] * wallOffset
      ] as Vec3;
    }
  });

  // Set all artwork rotations to match the wall rotation
  rotations = Array(artworkCount).fill([...wallRotation] as Vec3);

  return { positions, rotations };
}
export const getCloudinaryModelUrl = (modelPath: string): string => {
	// if (!CLOUDINARY_CLOUD_NAME) {
	//   throw new Error('CLOUDINARY_CLOUD_NAME is not defined');
	// }

	// Error: Could not load https://res.cloudinary.com/djvlldzih/image/upload/gallery/models/glass_window_2.glb: fetch for "https://res.cloudinary.com/djvlldzih/image/upload/gallery/models/glass_window_2.glb"
	// responded with 404:
	//https://res.cloudinary.com/djvlldzih/image/upload/v1738856859/gallery/models/glass_window_2.glb
	return modelPath;
};
