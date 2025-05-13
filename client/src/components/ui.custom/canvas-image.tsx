import { cn } from '@/lib/utils';
import { memo, useEffect, useRef } from 'react';

interface CanvasImageProps {
	src: string;
	width?: number;
	height?: number;
	className?: string;
	watermark?: WatermarkOptions | null;
}

interface WatermarkOptions {
	text: string;
	color?: string;
	font?: string;
	style?: 'circular' | 'diagonal';
	position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
	radius?: number; // percentage of smallest dimension
	textStyle?: 'inside' | 'along'; // text placement style
}

function CanvasImage({
	src,
	width = 500,
	height = 500,
	className = '',
	watermark = {
		text: 'PROTECTED IMAGE',
		color: '#fff20cd9',
		font: 'Arial',
		style: 'circular',
		position: 'bottomRight',
		radius: 0.1,
		textStyle: 'along'
	}
}: CanvasImageProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imageRef = useRef<HTMLImageElement>();

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext('2d');

		if (!canvas || !ctx) return;
		if (!canvas || !ctx) return;

		const image = new Image();
		imageRef.current = image;
		image.crossOrigin = 'Anonymous';

		image.onload = () => {
			// Tính toán tỷ lệ khung hình của ảnh gốc
			const originalAspectRatio = image.width / image.height;

			// Tính toán kích thước mới dựa trên width được cấp
			let newWidth = width;
			let newHeight = Math.round(width / originalAspectRatio);

			// Nếu ảnh gốc nhỏ hơn width được cấp, scale up để match width được cấp
			if (image.width < width) {
				newWidth = width;
				newHeight = Math.round(width / originalAspectRatio);
			}

			// Cập nhật kích thước canvas
			canvas.width = newWidth;
			canvas.height = newHeight;

			// Vẽ ảnh với kích thước mới
			ctx.drawImage(image, 0, 0, newWidth, newHeight);

			if (watermark) {
				ctx.save();

				// Calculate dimensions
				const circleRadius =
					Math.min(newWidth, newHeight) * (watermark.radius || 0.1);
				const padding = 20;

				// Calculate position based on watermark.position
				let centerX = newWidth - circleRadius - padding;
				let centerY = newHeight - circleRadius - padding;

				switch (watermark.position) {
					case 'bottomLeft':
						centerX = circleRadius + padding;
						break;
					case 'topRight':
						centerY = circleRadius + padding;
						break;
					case 'topLeft':
						centerX = circleRadius + padding;
						centerY = circleRadius + padding;
						break;
				}
				switch (watermark.position) {
					case 'bottomLeft':
						centerX = circleRadius + padding;
						break;
					case 'topRight':
						centerY = circleRadius + padding;
						break;
					case 'topLeft':
						centerX = circleRadius + padding;
						centerY = circleRadius + padding;
						break;
				}

				// Draw circle outline
				ctx.beginPath();
				ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
				ctx.strokeStyle = watermark.color || 'rgba(255, 0, 0, 0.6)';
				ctx.lineWidth = 2;
				ctx.stroke();
				// Draw circle outline
				ctx.beginPath();
				ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
				ctx.strokeStyle = watermark.color || 'rgba(255, 0, 0, 0.6)';
				ctx.lineWidth = 2;
				ctx.stroke();

				// Configure text style
				ctx.font = `${circleRadius * 0.2}px ${
					watermark.font || 'Arial'
				}`;
				ctx.fillStyle = watermark.color || 'rgba(255, 0, 0, 0.6)';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				// Configure text style
				ctx.font = `${circleRadius * 0.2}px ${
					watermark.font || 'Arial'
				}`;
				ctx.fillStyle = watermark.color || 'rgba(255, 0, 0, 0.6)';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';

				if (watermark.textStyle === 'inside') {
					ctx.save();
					ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
					const textWidth = ctx.measureText(watermark.text).width;
					ctx.fillRect(
						centerX - textWidth / 2 - 10,
						centerY - circleRadius * 0.1,
						textWidth + 20,
						circleRadius * 0.3
					);
					ctx.restore();

					ctx.fillStyle =
						watermark.color || 'rgba(255, 255, 255, 0.9)';
					ctx.fillText(watermark.text, centerX, centerY);
				} else {
					watermark.text.split('').forEach((char, i) => {
						const angle =
							(i / watermark.text.length) * 2 * Math.PI -
							Math.PI / 2;
						ctx.save();
						ctx.translate(
							centerX + (circleRadius - 10) * Math.cos(angle),
							centerY + (circleRadius - 10) * Math.sin(angle)
						);
						ctx.rotate(angle + Math.PI / 2);

						ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
						const charWidth = ctx.measureText(char).width;
						ctx.fillRect(
							-charWidth / 2,
							-circleRadius * 0.1,
							charWidth,
							circleRadius * 0.3
						);

						ctx.fillStyle =
							watermark.color || 'rgba(255, 255, 255, 0.9)';
						ctx.fillText(char, 0, 0);
						ctx.restore();
					});
				}

				ctx.restore();
			}
		};
		image.src = src;

		const preventDownload = (e: MouseEvent) => {
			e.preventDefault();
			return false;
		};
		canvas.addEventListener('contextmenu', preventDownload);
		canvas.addEventListener('dragstart', preventDownload);

		return () => {
			canvas.removeEventListener('contextmenu', preventDownload);
			canvas.removeEventListener('dragstart', preventDownload);
		};
	}, [src, width, height, watermark]);

	return (
		<div className='p-1 rounded-sm'>
			<canvas
				className={cn(className)}
				ref={canvasRef}
				style={{
					// width: '100%',
					width: 'auto',
					height: 'auto',
					maxWidth: '100%',
					userSelect: 'none',
					pointerEvents: 'none'
				}}
			/>
		</div>
	);
}

export default memo(CanvasImage);
