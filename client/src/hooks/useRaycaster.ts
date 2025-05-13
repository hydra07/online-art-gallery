// Hook useRaycaster dùng để phát hiện sự tương tác giữa tia (ray) từ camera và mesh object
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2, Mesh } from 'three';
import { useCallback, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';

// Props interface định nghĩa các tham số đầu vào cho hook
interface UseRaycasterProps {
	meshRef: React.RefObject<Mesh>; // Tham chiếu đến mesh cần kiểm tra va chạm
	onIntersect?: () => void; // Callback khi có va chạm
	onMiss?: () => void; // Callback khi không có va chạm
	debounceTime?: number; // Thời gian debounce (ms)
}

export function useRaycaster({
	meshRef,
	onIntersect,
	onMiss,
	debounceTime = 100 // Mặc định 100ms
}: UseRaycasterProps) {
	// Lấy camera từ Three.js context
	const { camera } = useThree();

	// Khởi tạo raycaster và điểm trung tâm màn hình (0,0)
	// useMemo để tránh tạo lại object mỗi lần render
	const raycaster = useMemo(() => new Raycaster(), []);
	const center = useMemo(() => new Vector2(0, 0), []);

	// Hàm kiểm tra va chạm giữa tia và mesh
	const checkIntersection = useCallback(() => {
		if (!meshRef.current) return; // Kiểm tra mesh tồn tại

		// Thiết lập tia từ camera qua điểm trung tâm màn hình
		raycaster.setFromCamera(center, camera);

		// Kiểm tra va chạm với mesh
		const intersects = raycaster.intersectObjects([meshRef.current], true);

		// Gọi callback tương ứng
		if (intersects.length > 0) {
			onIntersect?.(); // Có va chạm
		} else {
			onMiss?.(); // Không có va chạm
		}
	}, [meshRef, camera, onIntersect, onMiss, raycaster, center]);

	// Tạo phiên bản debounce của hàm kiểm tra
	// Tránh gọi quá nhiều lần trong thời gian ngắn
	const debouncedCheckIntersection = useMemo(
		() =>
			debounce(checkIntersection, debounceTime, {
				leading: true, // Gọi ngay lần đầu
				trailing: true, // Gọi lần cuối
				maxWait: debounceTime * 2 // Thời gian chờ tối đa
			}),
		[checkIntersection, debounceTime]
	);

	// Đăng ký sự kiện click và cleanup
	useEffect(() => {
		window.addEventListener('click', debouncedCheckIntersection);

		// Cleanup khi unmount
		return () => {
			window.removeEventListener('click', debouncedCheckIntersection);
			debouncedCheckIntersection.cancel(); // Hủy debounce
		};
	}, [debouncedCheckIntersection]);

	// Add back the return statement
	return { checkIntersection, debouncedCheckIntersection };
}
