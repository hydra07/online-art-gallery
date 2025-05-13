import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Euler, Quaternion, Camera } from 'three';

export function useSmoothRotation(
	camera: Camera,
	smoothFactor = 0.1 // Điều chỉnh độ mượt, giá trị càng nhỏ càng mượt
) {
	const currentRotation = useRef(new Quaternion());
	const targetRotation = useRef(new Quaternion());
	const euler = useRef(new Euler(0, 0, 0, 'YXZ'));

	useFrame((_, delta) => {
		// Lấy rotation hiện tại của camera
		euler.current.setFromQuaternion(camera.quaternion);

		// Tạo quaternion target từ euler angles
		targetRotation.current.setFromEuler(euler.current);

		// Smooth interpolation giữa rotation hiện tại và target
		currentRotation.current.slerp(
			targetRotation.current,
			smoothFactor * delta * 60
		);

		// Áp dụng rotation mới cho camera
		camera.quaternion.copy(currentRotation.current);
	});
}
