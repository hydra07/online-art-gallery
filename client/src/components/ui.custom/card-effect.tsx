'use client';
import React, { useState } from 'react';

const CardWithEffect = ({ children }: { children: React.ReactNode }) => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		});
	};

	return (
		<div
			className='relative bg-[#000] flex-1 rounded-xl border border-white/30 p-4 overflow-hidden'
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{ willChange: 'transform' }}
		>
			{isHovered && (
				<div
					className='pointer-events-none absolute rounded-full'
					style={{
						width: '300px',
						height: '300px',
						top: mousePosition.y - 150,
						left: mousePosition.x - 150,
						background: '#5D2CA8',
						filter: 'blur(100px)',
						transform: 'translate(-0%, -0%)',
						zIndex: 10, // Ensure the effect is on top
						willChange: 'transform, top, left'
					}}
				/>
			)}
			{children}
		</div>
	);
};
export default CardWithEffect;
