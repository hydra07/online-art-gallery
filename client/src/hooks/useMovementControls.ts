import { useEffect, useCallback, useState } from 'react';
import { INITIAL_MOVEMENT_STATE, MOVEMENT_KEYS } from '@/utils/constants';
import { Keys } from '@/types/gallery';

/**
 * Hook quản lý trạng thái các phím di chuyển
 *
 * @returns Keys - Object chứa trạng thái của các phím di chuyển (forward, backward, left, right)
 */
export const useMovementControls = () => {
	// Khởi tạo state lưu trạng thái các phím, mặc định tất cả đều false
	const [keys, setKeys] = useState<Keys>(INITIAL_MOVEMENT_STATE);

	// Callback xử lý khi có thay đổi trạng thái phím (nhấn/thả)
	const handleKeyChange = useCallback(
		(event: KeyboardEvent, isPressed: boolean) => {
			// Lấy key mapping tương ứng từ mã phím
			const key = MOVEMENT_KEYS[event.code];
			if (key) {
				// Cập nhật state với trạng thái mới của phím
				setKeys((prev) => ({ ...prev, [key]: isPressed }));
			}
		},
		[] // Không có dependencies vì callback không phụ thuộc state/props nào
	);

	// Effect đăng ký các event listener để theo dõi sự kiện bàn phím
	useEffect(() => {
		// Handler cho sự kiện nhấn phím - đặt trạng thái thành true
		const handleKeyDown = (event: KeyboardEvent) =>
			handleKeyChange(event, true);

		// Handler cho sự kiện thả phím - đặt trạng thái thành false
		const handleKeyUp = (event: KeyboardEvent) =>
			handleKeyChange(event, false);

		// Đăng ký các event listener
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		// Cleanup function để gỡ bỏ event listener khi component unmount
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [handleKeyChange]); // Effect chạy lại khi handleKeyChange thay đổi

	// Trả về object chứa trạng thái hiện tại của các phím
	return keys;
};
