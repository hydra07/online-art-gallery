import { Vec3 } from '@/types/gallery';

export const GALLERY_CONFIG = {
	LIGHTING: {
		AMBIENT_INTENSITY: 0.5,
		DIRECTIONAL_INTENSITY: 1,
		SHADOW_MAP_SIZE: 2048
	},
	PHYSICS: {
		GRAVITY: [0, -30, 0] as Vec3,
		CONTACT_MATERIAL: {
			friction: 0.1,
			restitution: 0.1
		}
	},
	CAMERA: {
		FOV: 85,
		INITIAL_POSITION: [10, 2, 5] as Vec3
	},
	ROOM: {
		X_AXIS: 20, // X_AXIS
		Y_AXIS: 10, // Y_AXIS
		Z_AXIS: 40 // Z_AXIS
	},
	MODELS: {
		SPIRAL_STAIR: {
			POSITION: [5, 0, 5],
			SCALE: 310
		},
		DC_STAIR: {
			POSITION: [13, 0, 0] as Vec3,
			SCALE: [2.5, 3.5, 2.5] as Vec3,
			ROTATION: [0, Math.PI + 0.1, 0] as Vec3
		},
		GLASS_WINDOWS: {
			POSITIONS: [[0.3, 0, -4.5] as Vec3, [10.3, 0, -4.5] as Vec3],
			SCALE: [5, 4.9, 3.5] as Vec3,
			ROTATION: [0, Math.PI / 2, 0] as Vec3
		},
		GLASS_WINDOWS_2: {
			POSITIONS: [5, -0.4, 0.15] as Vec3,
			SCALE: [1, 3.7, 1.2] as Vec3,
			ROTATION: [0, 0, 0] as Vec3
		},
		HOUSE_PLANT: {
			POSITION: [8, 0, 0],
			SCALE: 1
		},
		BIRCH_TREE: {
			POSITION: [0, 0, 6.5] as Vec3,
			SCALE: 1.3,
			ROTATION: [0, 0, 0] as Vec3
		},
		RAILING: {
			POSITIONS: [[-0.2, 0, 0] as Vec3, [-7.2, 0, 0] as Vec3],
			SCALE: [1.1, 0.7, 0.7] as Vec3,
			ROTATION: [0, 0, 0] as Vec3
		},
		STAIR_LOW_POLY: {
			POSITION: [6.6, 0, 7] as Vec3,
			SCALE: [3, 3.6, 3] as Vec3,
			ROTATION: [0, Math.PI * 2, 0] as Vec3
		}
	},
	ARTWORKS: {
		WALL_Z_POSITION: -9.8,
		VERTICAL_POSITION: 3
	},

};

export const MODERN_A1_GALLERY_CONFIG = {
	DIMENSION: {
		X_AXIS: 18.8, // X_AXIS
		Y_AXIS: 14, // Y_AXIS
		Z_AXIS: 30 // Z_AXIS
	},
}


export const MODERN_A2_GALLERY_CONFIG = {
	DIMENSION: {
		X_AXIS: 40, // X_AXIS
		Y_AXIS: 40, // Y_AXIS
		Z_AXIS: 40 // Z_AXIS
	},
}


export const M2_ROOM_CONFIG = {
	DIMENSION: {
		X_AXIS: 30, // X_AXIS
		Y_AXIS: 10, // Y_AXIS
		Z_AXIS: 40 // Z_AXIS
	},
	LIGHTING: {
		AMBIENT: {
			INTENSITY: 0.3,
			COLOR: '#ffffff'
		}
	},
};

export const COZY_A1_ROOM_CONFIG = {
	DIMENSION: {
		X_AXIS: 20, // X_AXIS
		Y_AXIS: 10, // Y_AXIS
		Z_AXIS: 30 // Z_AXIS
	},
	LIGHTING: {
		AMBIENT: {
			INTENSITY: 4,
			COLOR: '#ffffff'
		}
	},
};