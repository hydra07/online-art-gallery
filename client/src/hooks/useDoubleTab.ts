'use client';
import { useDoubleTap } from 'use-double-tap';
import React, { useState } from 'react';

export function useCustomDoubleTap(
	onDoubleTap: (event: React.TouchEvent | React.MouseEvent) => void
) {
	const [tapped, setTapped] = useState(false);

	const bind = useDoubleTap(
		(event: React.TouchEvent | React.MouseEvent) => {
			setTapped(true);
			onDoubleTap(event);
			setTimeout(() => setTapped(false), 300);
		},
		300,
		{
			onSingleTap: () => {
				// Xử lý single tap nếu cần
			}
		}
	);

	return { bind, tapped };
}
