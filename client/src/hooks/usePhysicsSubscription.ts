import { useEffect, useRef } from 'react';
import { PublicApi } from '@react-three/cannon';

/**
 * Hook để theo dõi vận tốc và vị trí của một đối tượng vật lý
 *
 * @param api - PublicApi từ @react-three/cannon để tương tác với đối tượng vật lý
 * @returns Object chứa refs của vận tốc và vị trí hiện tại
 */
export const usePhysicsSubscription = (api: PublicApi) => {
	// Lưu trữ vận tốc hiện tại của đối tượng dưới dạng [x, y, z]
	const velocity = useRef([0, 0, 0]);

	// Lưu trữ vị trí hiện tại của đối tượng dưới dạng [x, y, z]
	const position = useRef([0, 0, 0]);

	useEffect(() => {
		// Đăng ký theo dõi thay đổi vận tốc
		const unsubVelocity = api.velocity.subscribe((v) => {
			velocity.current = v; // Cập nhật giá trị vận tốc mới
		});

		// Đăng ký theo dõi thay đổi vị trí
		const unsubPosition = api.position.subscribe((p) => {
			position.current = p; // Cập nhật giá trị vị trí mới
		});

		// Cleanup function để hủy đăng ký khi component unmount
		return () => {
			unsubVelocity(); // Hủy theo dõi vận tốc
			unsubPosition(); // Hủy theo dõi vị trí
		};
	}, [api]); // Effect chỉ chạy lại khi api thay đổi

	// Trả về refs để truy cập giá trị mới nhất từ bên ngoài
	return { velocity, position };
};
