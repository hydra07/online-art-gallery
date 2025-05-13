import { Texture } from 'three';
import { Gallery } from './new-gallery';
import { Object3D } from 'three';
import { Vector3 } from 'three';

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
	type?: 'Static' | 'Dynamic' | 'Kinematic';
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

export interface GalleryTemplateData {
	id?: string;
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
	modelScale: number;
	modelRotation: [number, number, number];
	modelPosition: [number, number, number];
	previewImage: string;
	// planImage: string;
	isPremium: boolean;
	customColliders: ColliderConfig[];
	// Add artwork positions configuration
	artworkPlacements: {
	  position: [number, number, number];
	  rotation: [number, number, number];
	}[];
  }


export type ColliderConfig = BoxColliderConfig | CurvedColliderConfig;
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

export type ControlsType = Object3D & {
	isLocked: boolean;
	connect: () => void;
	disconnect: () => void;
	dispose: () => void;
	getDirection: (direction: Vector3) => Vector3;
	moveForward: (distance: number) => void;
	moveRight: (distance: number) => void;
	lock: () => void;
	unlock: () => void;
  };
  