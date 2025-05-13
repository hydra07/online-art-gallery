// import { OrbitControls } from '@react-three/drei';
// import { Canvas, useThree } from '@react-three/fiber';
// import { useEffect, useState } from 'react';
// import * as THREE from 'three';

// interface ArtCanvasProps {
// 	url: string;
// 	width?: number;
// 	height?: number;
// }

// const Frame = ({
// 	imageSrc,
// 	width,
// 	height
// }: {
// 	imageSrc: string;
// 	width?: number;
// 	height?: number;
// }) => {
// 	const [texture, setTexture] = useState<THREE.Texture | null>(null);
// 	const [loading, setLoading] = useState(true);

// 	useEffect(() => {
// 		const loader = new THREE.TextureLoader();
// 		// Reset trạng thái khi URL thay đổi
// 		setLoading(true);
// 		setTexture(null);

// 		loader.load(
// 			imageSrc,
// 			(loadedTexture) => {
// 				// Cải thiện chất lượng texture
// 				loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
// 				loadedTexture.magFilter = THREE.LinearFilter;
// 				loadedTexture.anisotropy = Math.min(
// 					16,
// 					new THREE.WebGLRenderer().capabilities.getMaxAnisotropy()
// 				);

// 				// Đảm bảo texture được resize phù hợp
// 				const canvas = document.createElement('canvas');
// 				const context = canvas.getContext('2d');
// 				const img = new Image();
// 				img.onload = () => {
// 					// Resize texture nếu quá lớn
// 					const maxSize = 2048; // Kích thước tối đa
// 					const scale = Math.min(
// 						1,
// 						maxSize / Math.max(img.width, img.height)
// 					);

// 					canvas.width = img.width * scale;
// 					canvas.height = img.height * scale;
// 					context?.drawImage(img, 0, 0, canvas.width, canvas.height);

// 					loadedTexture.image = img;
// 					loadedTexture.needsUpdate = true;

// 					setTexture(loadedTexture);
// 					setLoading(false);
// 				};
// 				img.src = imageSrc;
// 			},
// 			// Theo dõi tiến trình load
// 			(progress) => {
// 				console.log('Loading progress:', progress);
// 			},
// 			(error) => {
// 				console.error('Error loading texture:', error);
// 				setLoading(false);
// 			}
// 		);

// 		return () => {
// 			// Dọn dẹp texture khi component unmount
// 			texture?.dispose();
// 		};
// 	}, [imageSrc]);

// 	return (
// 		<>
// 			{/* Khung ảnh */}
// 			<mesh position={[0, 0, -0.1]}>
// 				<boxGeometry args={[width || 4.2, height || 3.2, 0.1]} />
// 				<meshStandardMaterial color='#8b4513' />
// 			</mesh>

// 			{/* Ảnh */}
// 			{texture && !loading && (
// 				<mesh>
// 					<planeGeometry args={[width || 4, height || 3]} />
// 					<meshStandardMaterial
// 						map={texture}
// 						toneMapped={false}
// 						transparent={true} // Hỗ trợ ảnh trong suốt
// 					/>
// 				</mesh>
// 			)}

// 			{/* Placeholder khi đang load */}
// 			{loading && (
// 				<mesh>
// 					<planeGeometry args={[width || 4, height || 3]} />
// 					<meshStandardMaterial color='#f0f0f0' />
// 				</mesh>
// 			)}
// 		</>
// 	);
// };

// const AutoCamera = ({ width, height }: { width: number; height: number }) => {
// 	const { camera, size } = useThree();

// 	useEffect(() => {
// 		if (camera instanceof THREE.PerspectiveCamera) {
// 			// Tính toán kích thước và tỷ lệ
// 			const aspectRatio = width / height;
// 			const canvasAspectRatio = size.width / size.height;

// 			let finalWidth = width;
// 			let finalHeight = height;

// 			// Điều chỉnh kích thước để phù hợp với canvas
// 			if (canvasAspectRatio > aspectRatio) {
// 				finalWidth = height * canvasAspectRatio;
// 			} else {
// 				finalHeight = width / canvasAspectRatio;
// 			}

// 			// Tính toán khoảng cách camera
// 			const maxDimension = Math.max(finalWidth, finalHeight);
// 			const distance =
// 				maxDimension / (2 * Math.tan((camera.fov * Math.PI) / 360));

// 			// Đặt vị trí camera
// 			camera.position.set(0, 0, distance * 1.2);
// 			camera.lookAt(0, 0, 0);
// 			camera.near = 0.1; // Điều chỉnh near plane
// 			camera.far = distance * 3; // Điều chỉnh far plane
// 			camera.updateProjectionMatrix();
// 		}
// 	}, [camera, width, height, size]);

// 	return null;
// };

// const ArtCanvas = ({ url, width = 400, height = 500 }: ArtCanvasProps) => {
// 	console.log(`ArtCanvas: ${url}, ${width}, ${height}`);
// 	return (
// 		<Canvas
// 			camera={{ position: [0, 0, 8], fov: 50 }}
// 			gl={{
// 				antialias: true,
// 				powerPreference: 'high-performance',
// 				// Thêm các cài đặt để cải thiện chất lượng render
// 				pixelRatio: Math.min(window.devicePixelRatio, 2) // Giới hạn pixel ratio để tránh hiệu năng quá mức
// 				// shadowMap: {
// 				// 	enabled: true,
// 				// 	type: THREE.PCFSoftShadowMap // Sử dụng shadow map mềm mại hơn
// 				// }
// 			}}
// 			// Thêm props để kiểm soát render
// 			frameloop='demand' // Chỉ render khi có thay đổi
// 			performance={{ min: 0.5 }} // Điều chỉnh hiệu năng
// 		>
// 			{/* Ánh sáng */}
// 			<ambientLight intensity={1} />
// 			<directionalLight
// 				position={[5, 10, 7]}
// 				intensity={1.5}
// 				castShadow
// 				shadow-mapSize-width={1024}
// 				shadow-mapSize-height={1024}
// 			/>
// 			<pointLight position={[10, 10, 10]} intensity={1} />

// 			{/* Tự động căn chỉnh camera */}
// 			<AutoCamera width={width} height={height} />

// 			{/* Khung ảnh */}
// 			<Frame imageSrc={url} width={width} height={height} />

// 			{/* Điều khiển xoay/phóng to/thu nhỏ */}
// 			<OrbitControls
// 				enableDamping={true}
// 				dampingFactor={0.05}
// 				enablePan={false} // Vô hiệu hóa di chuyển
// 				maxPolarAngle={Math.PI / 2} // Giới hạn góc quay
// 				minDistance={width} // Khoảng cách nhỏ nhất
// 				maxDistance={width * 3} // Khoảng cách lớn nhất
// 			/>
// 		</Canvas>
// 	);
// };
// export default ArtCanvas;
