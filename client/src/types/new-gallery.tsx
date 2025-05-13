export type Vec3 = [number, number, number];

export interface Dimension {
    xAxis: number;
    yAxis: number;
    zAxis: number;
}

export interface ArtworkPlacement {
    position: Vec3;
    rotation: Vec3;
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


export type CustomCollider = BoxColliderConfig | CurvedColliderConfig;


export interface Gallery {
    _id: string;
    name: string;
    description?: string;
    dimensions: Dimension;
    wallThickness: number;
    wallHeight: number; // Added based on old type, check if present in new API
    modelPath: string;
    modelScale: number;
    modelRotation: Vec3;
    modelPosition: Vec3;
    previewImage?: string;
    // planImage?: string;
    isPremium?: boolean;
    isActive?: boolean;
    customColliders: CustomCollider[];
    artworkPlacements: ArtworkPlacement[];
}

