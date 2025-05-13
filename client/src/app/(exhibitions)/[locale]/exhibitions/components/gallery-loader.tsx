'use client';
import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';

export function Loader() {
	const [dots, setDots] = useState('.');
	
	useEffect(() => {
		const interval = setInterval(() => {
			setDots(prevDots => {
				if (prevDots.length >= 3) return '.';
				return prevDots + '.';
			});
		}, 500);
		
		return () => clearInterval(interval);
	}, []);

	return (
		<Html center>
			<div className='bg-black/50 text-white p-4 rounded-lg shadow-xl text-center'>
				{/* <div className='text-lg font-bold mb-2'>Loading Gallery</div> */}
				<div className='my-4'>
					<div className='inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
				</div>
				<div className='text-sm mt-2'>
					Loading{dots}
				</div>
			</div>
		</Html>
	);
}
