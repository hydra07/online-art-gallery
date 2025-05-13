'use client';
import { cn } from '@/lib/utils';
import React, { useRef } from 'react';

interface DivWithEffectProps {
	children: React.ReactNode;
	color?: string;
	background?: string;
	className?: string;
}
function DivWithEffect({
	children,
	color,
	className = ''
}: DivWithEffectProps) {
	const effectRef = useRef<HTMLDivElement | null>(null);
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (effectRef.current) {
			const rect = e.currentTarget.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			effectRef.current.style.transform = `translate(${x - 150}px, ${
				y - 150
			}px)`;
		}
	};
	return (
		<div
			className={cn('overflow-hidden relative', className)}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => {
				if (effectRef.current) {
					effectRef.current.style.opacity = '1';
				}
			}}
			onMouseLeave={() => {
				if (effectRef.current) {
					effectRef.current.style.opacity = '0';
				}
			}}
			style={{ position: 'relative', overflow: 'hidden' }}
		>
			<div
				ref={effectRef}
				className='pointer-events-none absolute rounded-full transition-opacity duration-300'
				style={{
					width: '300px',
					height: '300px',
					background: color || '#5D2CA8',
					filter: 'blur(100px)',
					opacity: '0',
					transform: 'translate(-150px, -150px)',
					willChange: 'transform, opacity',
					zIndex: 10
				}}
			/>
			{children}
		</div>
	);
}

// export default memo(DivWithEffect);
export default DivWithEffect;
