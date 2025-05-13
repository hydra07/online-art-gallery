import { Keys, KeyMap } from '@/types/gallery';

export const MOVEMENT_KEYS: KeyMap = {
	KeyW: 'forward',
	KeyS: 'backward',
	KeyA: 'right',
	KeyD: 'left'
};

export const INITIAL_MOVEMENT_STATE: Keys = {
	forward: false,
	backward: false,
	left: false,
	right: false
};

export const PHYSICS_CONFIG = {
	mass: 1, // khối lượng
	type: 'Dynamic', // đối tượng động, có thể di chuyển và bị tác động bởi lực.
	fixedRotation: true, // không bị xoay khi va chạm
	linearDamping: 0.97, // giảm tốc độ tuyến tính
	material: {
		friction: 0.1 // ma sát
	}
};

export const MODEL_URL = {
	GLASS_WINDOW:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1738857010/gallery/models/glass_window.glb',
	GLASS_WINDOW_2:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1738856859/gallery/models/glass_window_2.glb',
	STAIR_LOW_POLY:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1738857020/gallery/models/stair_low_poly.glb',
	RAILING:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1738914705/gallery/models/railing.glb'
};

export const TEXTURE_URL = {
	FLOOR: 'https://res.cloudinary.com/djvlldzih/image/upload/v1738915226/gallery/textures/floor.jpg',
	PINE_WOOD_TEXTURE:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1738915216/gallery/textures/wooden-parquet-floor.jpg',
	BRICK_WALL:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1738916166/gallery/textures/brick-wall.jpg',
	WHITE_WALL:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1738916278/gallery/textures/white-wall.jpg',
	WHITE_DECORATIVE_CELLING: 
		'https://res.cloudinary.com/djvlldzih/image/upload/v1740022250/gallery/textures/white-decorative-faux-tin-ceiling.jpg',
	CELLING_GYPSUM:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1740888096/gallery/textures/celling-gypsum.jpg',
	DARK_GREY_CONCRETE_TEXTURE:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1740925014/gallery/textures/broken-grey-texture.jpg',
	GREY_CONCRETE_TEXTURE:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1740924207/gallery/textures/grey-concrete-texture.webp'
};

export const ARTWORK_URL = {
	ARTWORK_1:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1738856841/gallery/arts/tmcxe54fk5sf7u3q3lgs.jpg',
	ARTWORK_2:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1738856841/gallery/arts/duuorbwn2xz2luyuzpl1.jpg',
	ARTWORK_3:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1738856841/gallery/arts/tz8nc5z131qr0cvrsyeb.jpg',
	ARTWORK_4:
		'https://res.cloudinary.com/djvlldzih/image/upload/v1738856840/gallery/arts/kh68mg65vfhoqbuy0clg.jpg'
};
