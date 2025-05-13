'use client';
import { Vec3 } from '@/types/gallery';
import { useMemo } from 'react';
import { useEffect } from 'react';
import { Mesh } from 'three';
import { useBox } from '@react-three/cannon';
import { useCloudinaryGLTF } from '@/hooks/useCloudinaryGLTF';
import { MODEL_URL } from '@/utils/constants';

interface StairLowPolyProps {
	position?: Vec3;
	scale?: Vec3;
	rotation?: Vec3;
}

export function StairLowPoly({
	position = [6.6, 0, 13],
	scale,
	rotation
}: StairLowPolyProps) {
	const { scene } = useCloudinaryGLTF(MODEL_URL.STAIR_LOW_POLY);
	const clonedScene = useMemo(() => scene.clone(), [scene]);

	// Tạo một series các collision box cho từng phần của cầu thang
	const [stairBase] = useBox(() => ({
		type: 'Static',
		position: [position[0], position[1] + 1.5, position[2]], // Điều chỉnh độ cao
		rotation: [Math.PI * 0.25, 0, 0], // Giảm góc nghiêng xuống 45 độ
		args: [4, 0.2, 20], // Tăng chiều dài để phủ toàn bộ cầu thang
		material: {
			friction: 0.3, // Giảm ma sát để di chuyển mượt hơn
			restitution: 0
		}
	}));

	// Thêm các collision box phụ để tạo bậc thang
	const numberOfSteps = 12;
	const stepHeight = 0.4; // Giảm chiều cao mỗi bậc

	const steps = Array.from({ length: numberOfSteps }).map((_, index) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [stepRef] = useBox(() => ({
			type: 'Static',
			position: [
				position[0],
				position[1] + index * stepHeight,
				position[2] - index * 0.5 // Điều chỉnh khoảng cách theo chiều Z
			],
			rotation: [Math.PI * 0.25, 0, 0], // Góc nghiêng giống base
			args: [4, 0.1, 0.8], // Tăng chiều dài mỗi bậc
			material: {
				friction: 0.3, // Giảm ma sát để di chuyển mượt hơn
				restitution: 0
			}
		}));
		return stepRef;
	});

	useEffect(() => {
		clonedScene.traverse(
			(child: { castShadow: boolean; receiveShadow: boolean }) => {
				if (child instanceof Mesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			}
		);
	}, [clonedScene]);

	return (
		<group>
			<primitive
				object={clonedScene}
				position={position}
				scale={scale}
				rotation={rotation}
			/>
			{/* Collision boxes */}
			{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
			<mesh ref={stairBase as any} visible={true}>
				<meshBasicMaterial
					color='red'
					opacity={0.5}
					transparent={true}
				/>
			</mesh>
			{steps.map((stepRef, index) => (
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				<mesh key={index} ref={stepRef as any} visible={true}>
					<meshBasicMaterial
						color='blue'
						opacity={0.5}
						transparent={true}
					/>
				</mesh>
			))}
		</group>
	);
}
