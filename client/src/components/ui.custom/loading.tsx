'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
	size?: number;
	color?: string;
	fullPage?: boolean;
	isLoading?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = 40,
	color = '#3498db',
	fullPage = false,
	isLoading = true
}) => {
	if (!isLoading) return null;

	const spinner = (
		<motion.div
			initial={{ rotate: 0 }}
			animate={{ rotate: 360 }}
			// transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
			style={{
				width: size,
				height: size,
				border: '4px solid gray',
				borderTop: `4px solid ${color}`,
				borderRadius: '50%',
				animation: 'spin 1s linear infinite'
			}}
		/>
	);

	if (fullPage) {
		return (
			<div className='fixed inset-0 flex justify-center items-center bg-white bg-opacity-80'>
				{spinner}
			</div>
		);
	}

	return spinner;
};

interface LoadingProps {
	error?: Error | null;
	timedOut?: boolean;
	pastDelay?: boolean;
	retry?: () => void;
}

const LoadingComponent: React.FC<LoadingProps> = ({
	error,
	timedOut,
	pastDelay,
	retry
}) => {
	// Hiển thị thông báo lỗi
	if (error) {
		return (
			<div className='fixed inset-0 flex flex-col items-center justify-center p-4 space-y-4'>
				<motion.p
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='text-red-500'
				>
					Error loading component
				</motion.p>
				{retry && (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={retry}
						className='px-4 py-2 bg-blue-500 text-white rounded'
					>
						Retry
					</motion.button>
				)}
			</div>
		);
	}

	// Hiển thị thông báo khi quá thời gian tải
	if (timedOut) {
		return (
			<div className='fixed inset-0 flex flex-col items-center justify-center p-4 space-y-4'>
				<motion.p
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='text-yellow-500'
				>
					Taking a long time...
				</motion.p>
				{retry && (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={retry}
						className='px-4 py-2 bg-blue-500 text-white rounded'
					>
						Retry
					</motion.button>
				)}
			</div>
		);
	}

	// Hiển thị loader sau khi delay
	if (pastDelay) {
		return (
			<div className='fixed inset-0 flex flex-col items-center justify-center p-4 space-y-4'>
				<LoadingSpinner size={60} color='#3498db' />
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					className='text-gray-500'
				>
					Loading...
				</motion.p>
			</div>
		);
	}

	return null;
};

export { LoadingSpinner, LoadingComponent };
