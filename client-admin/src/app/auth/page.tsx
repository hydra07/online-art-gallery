// src/app/auth/page.tsx
'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import useAuthClient from '@/hooks/useAuth-client'; // Dùng đúng đường dẫn

export default function AuthPage() {
	const { user, status } = useAuthClient();
	const router = useRouter();

	// Chuyển hướng nếu đã đăng nhập
	if (status === 'authenticated' && user) {
		router.push('/dashboard');
		return null;
	}

	const handleSignIn = async () => {
		await signIn('google', { callbackUrl: '/dashboard' });
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: 'easeOut' }
		}
	};

	const buttonVariants = {
		hover: {
			scale: 1.05,
			boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
			transition: { duration: 0.2 }
		},
		tap: { scale: 0.95 }
	};

	const svgVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.6, ease: 'easeOut' }
		}
	};

	const cursorVariants = {
		hover: {
			scale: 1.2,
			rotate: 10,
			transition: { duration: 0.3 }
		}
	};

	return (
		<div className="h-screen w-screen flex items-center justify-center p-4 bg-gray-50 overflow-hidden">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="w-full max-w-sm"
			>
				<Card className="shadow-md border-0">
					<CardHeader className="py-4 text-center">
						{/* SVG phức tạp hơn: Một admin với laptop */}
						<motion.svg
							variants={svgVariants}
							initial="hidden"
							animate="visible"
							width="180"
							height="180"
							viewBox="0 0 180 180"
							className="mx-auto mb-4"
						>
							{/* Laptop */}
							<motion.rect
								x="40"
								y="80"
								width="100"
								height="60"
								rx="8"
								fill="none"
								stroke="#4B5EAA"
								strokeWidth="4"
								initial={{ pathLength: 0 }}
								animate={{ pathLength: 1 }}
								transition={{ duration: 1, ease: 'easeInOut' }}
							/>
							<motion.rect
								x="50"
								y="90"
								width="80"
								height="40"
								fill="#E5E7EB"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.8, duration: 0.5 }}
							/>
							{/* Người (đầu) */}
							<motion.circle
								cx="90"
								cy="50"
								r="20"
								fill="none"
								stroke="#4B5EAA"
								strokeWidth="4"
								initial={{ pathLength: 0 }}
								animate={{ pathLength: 1 }}
								transition={{ duration: 0.8, ease: 'easeInOut' }}
							/>
							{/* Thân người */}
							<motion.path
								d="M 90 70 V 90"
								fill="none"
								stroke="#4B5EAA"
								strokeWidth="4"
								initial={{ pathLength: 0 }}
								animate={{ pathLength: 1 }}
								transition={{ duration: 0.6, delay: 0.2, ease: 'easeInOut' }}
							/>
							{/* Tay trái */}
							<motion.path
								d="M 90 80 L 60 100"
								fill="none"
								stroke="#4B5EAA"
								strokeWidth="4"
								initial={{ pathLength: 0 }}
								animate={{ pathLength: 1 }}
								transition={{ duration: 0.6, delay: 0.4, ease: 'easeInOut' }}
							/>
							{/* Tay phải */}
							<motion.path
								d="M 90 80 L 120 100"
								fill="none"
								stroke="#4B5EAA"
								strokeWidth="4"
								initial={{ pathLength: 0 }}
								animate={{ pathLength: 1 }}
								transition={{ duration: 0.6, delay: 0.4, ease: 'easeInOut' }}
							/>
							{/* Chi tiết nhỏ: con trỏ */}
							<motion.path
								d="M 100 110 L 110 120 L 105 115 Z"
								fill="#4B5EAA"
								variants={cursorVariants}
								whileHover="hover"
								initial={{ y: 0 }}
								animate={{ y: [0, -5, 0] }}
								transition={{ repeat: Infinity, duration: 1.5 }}
							/>
						</motion.svg>
						<CardTitle className="text-xl font-semibold text-gray-800">
							Admin Login
						</CardTitle>
					</CardHeader>
					<CardContent className="pb-6">
						<motion.div
							variants={buttonVariants}
							whileHover="hover"
							whileTap="tap"
						>
							<Button
								onClick={handleSignIn}
								variant="outline"
								className="w-full flex items-center justify-center gap-2
                  border-gray-300 hover:bg-gray-50 text-gray-800
                  py-5 rounded-md transition-colors duration-200 cursor-pointer"
							>
								<FcGoogle className="w-5 h-5" />
								<span>Sign in with Google</span>
							</Button>
						</motion.div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}