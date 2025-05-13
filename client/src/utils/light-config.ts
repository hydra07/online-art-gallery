	import { Vec3 } from '@/types/gallery';

export interface LightConfig {
	ambient?: {
		intensity: number;
		color: string;
	};
	directional?: {
		position: Vec3;
		intensity: number;
		color: string;
		castShadow?: boolean;
		shadow?: {
			mapSize: {
				width: number;
				height: number;
			};
			camera: {
				near: number;
				far: number;
				top: number;
				bottom: number;
				left: number;
				right: number;
			};
		};
	};
	spots?: Array<{
		position: Vec3;
		intensity: number;
		color: string;
		angle?: number;
		penumbra?: number;
		castShadow?: boolean;
	}>;
	points?: Array<{
		position: Vec3;
		intensity: number;
		color: string;
		distance?: number;
		decay?: number;
	}>;
	hemisphere?: {
		intensity: number;
		color: string;
		groundColor: string;
	};
}

export const LIGHT_PRESETS = {
	MODERN: {
		ambient: {
			intensity: 0.7,
			color: '#ffffff'
		},
		directional: {
			position: [0, 15, 0] as Vec3,
			intensity: 1.5,
			color: '#ffffff',
			castShadow: false
		},
		spots: [
			{
				position: [0, 15, 0] as Vec3,
				intensity: 1.2,
				color: '#ffffff',
				angle: Math.PI / 2,
				penumbra: 1,
				castShadow: false
			}
		],
		points: [
			{
				position: [0, 10, 0] as Vec3,
				intensity: 1.0,
				color: '#ffffff',
				distance: 30,
				decay: 1
			}
		]
	},
	GALLERY: {
		ambient: {
			intensity: 0.3,
			color: '#ffffff'
		},
		directional: {
			position: [0, 5, 0] as Vec3,
			intensity: 0.8,
			color: '#ffffff',
			
		},
	// 	spots: [
	// 		{
	// 			position: [0, 10, 0] as Vec3,
	// 			intensity: 0.8,
	// 			color: '#ffffff',
	// 			angle: Math.PI / 4,
	// 			penumbra: 0.3,
	// 			castShadow: true
	// 		}
	// 	],
	// 	points: [
	// 		{
	// 			position: [-8, 6, -15] as Vec3,
	// 			intensity: 0.6,
	// 			color: '#ffeeb3',
	// 			distance: 20,
	// 			decay: 2
	// 		},
	// 		{
	// 			position: [8, 6, -15] as Vec3,
	// 			intensity: 0.6,
	// 			color: '#ffeeb3',
	// 			distance: 20,
	// 			decay: 2
	// 		},
	// 		{
	// 			position: [-10, 5, 0] as Vec3,
	// 			intensity: 0.4,
	// 			color: '#b3d9ff',
	// 			distance: 15,
	// 			decay: 2
	// 		},
	// 		{
	// 			position: [-10, 5, -10] as Vec3,
	// 			intensity: 0.4,
	// 			color: '#b3d9ff',
	// 			distance: 15,
	// 			decay: 2
	// 		}
	// 	],
	// 	hemisphere: {
	// 		intensity: 0.3,
	// 		color: '#ffffff',
	// 		groundColor: '#444444'
	// 	}
	}
};
