'use client';

import { PhoneInput } from '@/components/ui.custom/phone-input';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { signInSchema } from '../schema';
function AuthForm() {
	const [isSignIn, setIsSignIn] = useState<boolean>(true);
	const signInForm = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			name: '',
			phone: '',
			password: '',
			confirmPassword: ''
		}
	});

	const loginForm = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			phone: '',
			password: ''
		}
	});
	const onSignInSubmit = signInForm.handleSubmit(async (data) => {
		// console.log(data);
		await signIn('phone', {
			phone: data.phone,
			password: data.password,
			name: data.name
		});
	});
	const onLoginSubmit = loginForm.handleSubmit(async (data) => {
		await signIn('phone', { phone: data.phone, password: data.password });
	});
	const onGoogleLogin = async () => {
		await signIn('google');
	};
	const toggleForm = () => {
		setIsSignIn(!isSignIn);
	};
	return (
		<div
			className='flex items-center min-h-screen bg-cover bg-center p-4 sm:p-6 md:p-8 lg:p-12'
			style={{
				backgroundImage:
					"url('/placeholder.svg?height=1080&width=1920')"
			}}
		>
			<div className='absolute inset-0 bg-black opacity-50'></div>
			<motion.div
				initial={{ opacity: 0, x: -50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.8, ease: 'easeOut' }}
				className='z-10 w-full max-w-md'
			>
				<Card className='bg-white bg-opacity-80 backdrop-blur-md'>
					<CardHeader>
						<CardTitle>{isSignIn ? 'Sign In' : 'Login'}</CardTitle>
						<CardDescription>
							{isSignIn
								? 'Create a new account'
								: 'Login to your existing account'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<AnimatePresence mode='wait' initial={false}>
							<motion.form
								key={isSignIn ? 'signin' : 'login'}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{
									duration: 0.5,
									ease: 'easeInOut'
								}}
								onSubmit={
									isSignIn ? onSignInSubmit : onLoginSubmit
								}
							>
								{isSignIn && (
									<div className='flex flex-col space-y-1.5 mb-4'>
										<Label htmlFor='name'>Name</Label>
										<Input
											id='name'
											{...signInForm.register('name')}
											className='bg-white bg-opacity-50'
										/>
										{signInForm.formState.errors.name && (
											<p className='text-sm text-red-500'>
												{
													signInForm.formState.errors
														.name.message
												}
											</p>
										)}
									</div>
								)}
								<div className='flex flex-col space-y-1.5 mb-4'>
									<Label htmlFor='phone'>Phone Number</Label>
									<PhoneInput
										id='phone'
										{...(isSignIn
											? signInForm.register('phone')
											: loginForm.register('phone'))}
										className='bg-white bg-opacity-50'
									/>
									{(isSignIn
										? signInForm.formState.errors.phone
										: loginForm.formState.errors.phone) && (
										<p className='text-sm text-red-500'>
											{isSignIn
												? signInForm.formState.errors
														.phone?.message
												: loginForm.formState.errors
														.phone?.message}
										</p>
									)}
								</div>
								<div className='flex flex-col space-y-1.5 mb-4'>
									<Label htmlFor='password'>Password</Label>
									<Input
										id='password'
										type='password'
										{...(isSignIn
											? signInForm.register('password')
											: loginForm.register('password'))}
										className='bg-white bg-opacity-50'
									/>
									{(isSignIn
										? signInForm.formState.errors.password
										: loginForm.formState.errors
												.password) && (
										<p className='text-sm text-red-500'>
											{isSignIn
												? signInForm.formState.errors
														.password?.message
												: loginForm.formState.errors
														.password?.message}
										</p>
									)}
								</div>
								{isSignIn && (
									<div className='flex flex-col space-y-1.5 mb-4'>
										<Label htmlFor='confirmPassword'>
											Confirm Password
										</Label>
										<Input
											id='confirmPassword'
											type='password'
											{...signInForm.register(
												'confirmPassword'
											)}
											className='bg-white bg-opacity-50'
										/>
										{signInForm.formState.errors
											.confirmPassword && (
											<p className='text-sm text-red-500'>
												{
													signInForm.formState.errors
														.confirmPassword.message
												}
											</p>
										)}
									</div>
								)}
								<Button className='w-full mt-4' type='submit'>
									{isSignIn ? 'Sign In' : 'Login'}
								</Button>
							</motion.form>
						</AnimatePresence>
						<div className='relative my-4'>
							<div className='absolute inset-0 flex items-center'>
								<span className='w-full border-t' />
							</div>
							<div className='relative flex justify-center text-xs uppercase'>
								<span className='bg-white bg-opacity-80 px-2 text-muted-foreground'>
									Or continue with
								</span>
							</div>
						</div>
						<Button
							variant='outline'
							className='w-full bg-white bg-opacity-50'
							onClick={onGoogleLogin}
						>
							<FcGoogle className='mr-2 h-4 w-4' />
							Login with Google
						</Button>
					</CardContent>
					<CardFooter>
						<Button
							variant='link'
							className='w-full transition-colors duration-300 ease-in-out hover:text-primary'
							onClick={toggleForm}
						>
							{isSignIn
								? 'Already have an account? Login'
								: 'Need an account? Sign In'}
						</Button>
					</CardFooter>
				</Card>
			</motion.div>
		</div>
	);
}
export default AuthForm;
