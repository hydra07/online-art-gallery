import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
export function Crosshair() {
	const { size } = useThree();
	return (
		<Html
			center
			transform={false}
			calculatePosition={() => {
				// Tính toán rotation để luôn quay về phía camera
				return [size.width / 2, size.height / 2, 0];
			}}
		>
			<div className='pointer-events-none'>
				<div className='w-4 h-4'>
					<div className='absolute w-4 h-px bg-white top-1/2 left-0'></div>
					<div className='absolute h-4 w-px bg-white left-1/2 top-0'></div>
				</div>
			</div>
		</Html>
	);
}
