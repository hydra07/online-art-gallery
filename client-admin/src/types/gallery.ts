import { Texture } from 'three';

export type Vec3 = [number, number, number];

export type Keys = {
	forward: boolean;
	backward: boolean;
	left: boolean;
	right: boolean;
};

export type KeyMap = {
	[key: string]: keyof Keys;
};

export interface Position3D {
	x: number;
	y: number;
	z: number;
}

export interface Dimensions {
	width: number;
	height: number;
	length: number;
}

export interface MaterialProps {
	color?: string;
	texture?: Texture;
	roughness?: number;
	metalness?: number;
}

export interface WallDimensions {
	width: number;
	height: number;
	length?: number;
}

export interface WallMaterial {
	color: string;
	texture?: Texture;
	roughness?: number;
	metalness?: number;
}

export interface WallProps {
	position: Vec3;
	rotation?: Vec3;
	dimensions: WallDimensions;
	material: WallMaterial;
}

export interface DoorWallProps {
	roomDimensions: {
		width: number;
		height: number;
		length: number;
	};
	material: WallMaterial;
}

export interface BaseColliderConfig {
	position: Vec3;
	rotation: Vec3;
	visible?: boolean;
}

export interface BoxColliderConfig extends BaseColliderConfig {
	shape: 'box';
	args: Vec3;
}

export interface CurvedColliderConfig extends BaseColliderConfig {
	shape: 'curved';
	radius: number;
	height: number;
	segments?: number;
	arc?: number;
}

export interface ExhibitionType {
  id: string;
  name: string;
  title: string;
  author: string;
  date: string;
  description: string;
  thumbnail: string;
  backgroundImage: string;
  galleryModel: {
	id: string;
	name: string;
	description: string;
	dimension: {
	  xAxis: number;
	  yAxis: number;
	  zAxis: number;
	};
	wallThickness: number;
	wallHeight: number;
	modelPath: string;
	modelPosition: Vec3;
	modelRotation: Vec3;
	modelScale: number;
	customCollider?: {
	  shape: 'box';
	  args: Vec3;
	  position: Vec3;
	};
  };
  walls: {
	back?: {
	  artworkCount: number;
	  artworks: Array<{ 
		id: string; 
		url: string;
		positionIndex?: number;  // Thêm positionIndex
		position?: Vec3;
		rotation?: Vec3;
	  }>;
	};
	front?: {
	  artworkCount: number;
	  artworks: Array<{ 
		id: string; 
		url: string;
		position?: Vec3;
		rotation?: Vec3;
	  }>;
	};
	left?: {
	  artworkCount: number;
	  artworks: Array<{ 
		id: string; 
		url: string;
		position?: Vec3;
		rotation?: Vec3;
	  }>;
	};
	right?: {
	  artworkCount: number;
	  artworks: Array<{ 
		id: string; 
		url: string;
		position?: Vec3;
		rotation?: Vec3;
	  }>;
	};
  };
}

export interface Gallery {
	_id: string;
	name: string;
	description: string;
	dimensions: {
		xAxis: number;
		yAxis: number;
		zAxis: number;
	};
	wallThickness: number;
	wallHeight: number;
	modelPath: string;
	modelPosition: Vec3;
	modelRotation: Vec3;
	modelScale: number;
	previewImage: string;
	// planImage: string;
	isPremium: boolean;
	isActive: boolean;
	artworkPlacements: ArtworkPlacement[];
	customColliders: CustomCollider[];
}
export interface ArtworkPlacement {
    position: Vec3;
    rotation: Vec3;
}
export type CustomCollider = BoxColliderConfig | CurvedColliderConfig;

export type GetGalleriesResponse = {
	galleries: Gallery[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		pages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
};


export type GalleryRequestResponse = {
	gallery: Gallery;
}