'use client';

import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PaymentData, Transaction } from "@/types/payment";
import BaseResponse from '@/types/response';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from "lucide-react";
import React from "react";
import { useForm } from 'react-hook-form';
import { ConfirmationDialog } from '../components/deposit/confirmation_dialog';
import { DepositInfo } from '../components/deposit/deposit_info';
import { TransactionHistory } from '../components/deposit/transaction_history';
import { SectionHeader } from '../components/section_header';
import { walletService } from '../queries';
import { depositSchema } from '../schema';
import {
	depositMethods,
	formatAmount,
	formatCurrency,
	getEnhancedDepositMethods,
	pageVariants,
	presetAmounts,
	UI_CONSTANTS
} from './constants';
// Memoized components to prevent unnecessary re-renders
const MethodIcon = React.memo(({ methodId }: { methodId: string }) => {
	const IconComponent = methodIcons[methodId as keyof typeof methodIcons];
	return IconComponent ? <IconComponent /> : null;
});
MethodIcon.displayName = 'MethodIcon';
const PaymentMethodOption = React.memo(({
	method,
	isSelected,
	disabled,
	onSelect
}: {
	method: ReturnType<typeof getEnhancedDepositMethods>[number],
	isSelected: boolean,
	disabled: boolean,
	onSelect: () => void
}) => {
	return (
		<div
			key={method.id}
			className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${method.isAvailable
				? isSelected
					? 'border-primary bg-primary/5 shadow-sm'
					: 'hover:bg-muted/50 hover:border-muted-foreground/20'
				: 'opacity-60 bg-muted/30 cursor-not-allowed'
				}`}
			onClick={onSelect}
		>
			<RadioGroupItem
				value={method.id}
				id={method.id}
				disabled={disabled}
			/>
			<div className="flex flex-1 items-center">
				<Label
					htmlFor={method.id}
					className="flex items-center gap-3 cursor-pointer w-full"
				>
					<div className="flex items-center justify-center">
						<MethodIcon methodId={method.id} />
					</div>
					{/* {method.logo && (
						<div className="h-10 w-10 rounded-md border bg-white p-1 flex items-center justify-center">
							<Image
								src={method.logo}
								alt={method.name}
								width={30}
								height={30}
								className="h-auto w-auto object-contain"
							/>
						</div>
					)} */}
					<div className="flex-1 ml-2">
						<div className="font-medium text-base flex items-center">
							{method.name}
							{!method.isAvailable && (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Badge variant="outline" className="ml-2 text-xs bg-amber-100 text-amber-800 border-amber-200">
												Coming Soon
											</Badge>
										</TooltipTrigger>
										<TooltipContent>
											This payment method will be available soon
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
						<div className="text-sm text-muted-foreground mt-1">
							{method.description}
						</div>
					</div>
				</Label>
			</div>
		</div>
	);
});
PaymentMethodOption.displayName = 'PaymentMethodOption';
// Memoized amount button component for preset amounts
const AmountButton = React.memo(({
	amount,
	isSelected,
	onClick
}: {
	amount: number,
	isSelected: boolean,
	onClick: () => void
}) => {
	return (
		<Button
			type="button"
			variant={isSelected ? "default" : "outline"}
			className={`h-16 text-lg relative overflow-hidden transition-all ${isSelected
				? "bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white shadow-md"
				: "hover:border-green-400/50 hover:bg-green-50/30"
				}`}
			onClick={onClick}
		>
			<span className="font-medium">{formatAmount(amount)}</span>
			<span className="block text-xs mt-1">VND</span>
			{isSelected && (
				<motion.div
					className="absolute inset-0 bg-white/20"
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1.5, opacity: 0 }}
					transition={{ duration: 0.5 }}
				/>
			)}
		</Button>
	);
});
AmountButton.displayName = 'AmountButton';
// Memoized payment confirmation dialog to prevent re-renders
const PaymentRedirectDialog = React.memo(({
	open,
	onOpenChange,
	paymentData,
	countdown,
	onRedirectNow
}: {
	open: boolean,
	onOpenChange: (open: boolean) => void,
	paymentData: PaymentData | null,
	countdown: number,
	onRedirectNow: () => void
}) => {
	if (!paymentData) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-xl">
						<CheckCircle2 className="h-6 w-6 text-green-500" />
						Deposit Submitted Successfully
					</DialogTitle>
					<DialogDescription>
						Your deposit request has been submitted and you'll be redirected to complete the payment.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Payment Summary */}
					<div className="rounded-lg bg-muted/50 p-4 space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium text-muted-foreground">Amount:</span>
							<span className="font-semibold">
								{formatCurrency(paymentData.amount)}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium text-muted-foreground">Description:</span>
							<span className="font-medium">{paymentData.description}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium text-muted-foreground">Order Code:</span>
							<span className="font-mono text-sm bg-muted py-1 px-2 rounded">{paymentData.orderCode}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium text-muted-foreground">Status:</span>
							<span className="bg-amber-100 text-amber-800 text-xs py-1 px-2 rounded-full font-medium">
								Pending Payment
							</span>
						</div>
					</div>

					{/* Countdown */}
					<div className="text-center space-y-2">
						<p className="text-sm text-muted-foreground">
							You will be redirected to the payment page in:
						</p>
						<div className="text-3xl font-bold text-primary">{countdown}</div>
						<p className="text-xs text-muted-foreground">
							seconds
						</p>
					</div>

					{/* Manual redirect button */}
					<div className="pt-4">
						<Button
							onClick={onRedirectNow}
							className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
								<path d="M15 16H3v5h18v-5h-6" />
								<path d="M7 8v8" />
								<path d="m20 12-6-4v2H3v4h11v2l6-4Z" />
							</svg>
							Continue to Payment Now
						</Button>
						<div className="text-xs text-center text-muted-foreground mt-2">
							Click the button above to proceed to payment gateway immediately
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
});
PaymentRedirectDialog.displayName = 'PaymentRedirectDialog';

export default function DepositPage() {
	const [customAmount, setCustomAmount] = useState('');
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	// Payment confirmation related states
	const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
	const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
	const [countdown, setCountdown] = useState(UI_CONSTANTS.COUNTDOWN_SECONDS);
	const timerRef: React.MutableRefObject<ReturnType<typeof setInterval> | null> = useRef(null);
	// Add pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = UI_CONSTANTS.DEFAULT_PAGE_SIZE;
	const skip = (currentPage - 1) * pageSize;
	const take = pageSize;

	// Memoize enhanced deposit methods to prevent re-calculation
	const enhancedDepositMethods = useMemo(() => getEnhancedDepositMethods(), []);

	// Setup form with resolver
	const form = useForm<{
		amount: number;
		description: string;
		paymentMethod: string;
	}>({
		resolver: zodResolver(depositSchema),
		defaultValues: {
			amount: 0,
			description: '',
			paymentMethod: 'bank'
		}
	});

	// Cleanup timer on component unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	// Transaction data query with optimized settings
	const { data, isLoading, refetch } = useQuery<BaseResponse<Transaction>>({
		queryKey: ['payment', skip, take],
		queryFn: () => walletService.getTransaction(skip, take),
		staleTime: UI_CONSTANTS.STALE_TIME_MS,
		refetchInterval: UI_CONSTANTS.REFETCH_INTERVAL_MS,
	});

	// Handle deposit mutation
	const mutation = useMutation({
		mutationFn: (data: { amount: number; description: string, method?: string }) =>
			walletService.deposit(data.amount, data.description, data.method),
		onSuccess: (response: BaseResponse<PaymentData>) => {
			toast({
				title: 'Deposit Initiated Successfully',
				description: 'Your deposit request has been submitted and is being processed.',
				className: 'bg-green-600 text-white',
			});

			// Set payment data and show confirmation
			setPaymentData(response.data);
			setShowPaymentConfirm(true);

			// Start countdown for redirection
			startRedirectCountdown(response.data.paymentUrl);

			// Reset form
			form.reset();

			// Immediately refetch transaction data after successful deposit
			refetch();
		},
		onError: (error) => {
			toast({
				title: 'Deposit Failed',
				description: 'There was an issue processing your deposit. Please try again.',
				variant: 'destructive',
			});
		}
	});

	// Start countdown timer for payment redirection
	const startRedirectCountdown = useCallback((paymentUrl: string) => {
		// Clear existing timer if any
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		// Reset countdown
		setCountdown(UI_CONSTANTS.COUNTDOWN_SECONDS);

		// Start new timer
		let timer = UI_CONSTANTS.COUNTDOWN_SECONDS;
		timerRef.current = setInterval(() => {
			timer -= 1;
			setCountdown(timer);

			if (timer <= 0) {
				if (timerRef.current) clearInterval(timerRef.current);
				window.location.href = paymentUrl;
			}
		}, 1000);
	}, []);

	// Form submission handler
	const onSubmit = useCallback(() => {
		setShowConfirm(true);
	}, []);

	// Handle confirmation dialog confirmation
	const handleConfirm = useCallback(async () => {
		setLoading(true);
		try {
			const formData = form.getValues();
			await mutation.mutateAsync({
				amount: formData.amount,
				description: formData.description
			});
		} catch (error) {
			// Error handled in mutation.onError
		} finally {
			setLoading(false);
			setShowConfirm(false);
		}
	}, [form, mutation]);

	// Handle immediate redirection
	const handleRedirectNow = useCallback(() => {
		if (paymentData?.paymentUrl) {
			window.location.href = paymentData.paymentUrl;
		}
	}, [paymentData]);

	// Handle custom amount change to prevent negative values
	const handleCustomAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// Only allow non-negative numbers
		if (value === '' || Number(value) >= 0) {
			setCustomAmount(value);
			form.setValue('amount', Number(value) || 0);
		}
	}, [form]);

	// Memoize page change handler
	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className="min-h-screen bg-gradient-to-b from-background to-muted/20"
		>
			<SectionHeader title="Deposit Funds" />

			{/* Main Content */}
			<main className="container max-w-screen-xl mx-auto py-8 px-4">
				<div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
					{/* Left Column - Deposit Form */}
					<div className="space-y-8">
						<Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300">
							<CardHeader className="pb-4 border-b">
								<CardTitle className="flex items-center gap-2 text-2xl">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="h-6 w-6 text-green-500"
									>
										<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
									</svg>
									Deposit Funds
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								<Form {...form}>
									<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
										<FormField
											control={form.control}
											name="amount"
											render={({ field }) => (
												<FormItem className="space-y-4">
													<FormLabel className="flex items-center text-lg font-medium">
														<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
															<circle cx="12" cy="12" r="10" />
															<path d="M12 7v5l3 3" />
														</svg>
														Select Amount
													</FormLabel>
													<FormControl>
														<Tabs defaultValue="preset" className="w-full">
															<TabsList className="grid grid-cols-2">
																<TabsTrigger value="preset" className="flex items-center gap-1">
																	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<rect width="18" height="18" x="3" y="3" rx="2" />
																		<path d="M7 7h10M7 12h10M7 17h10" />
																	</svg>
																	Preset Amounts
																</TabsTrigger>
																<TabsTrigger value="custom" className="flex items-center gap-1">
																	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
																		<path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 8 8 2 0 3.8-.7 5.2-2" />
																		<path d="M12 2v4M12 18v4M4.93 7.93l2.83 2.83M16.24 16.24l2.83 2.83" />
																	</svg>
																	Custom Amount
																</TabsTrigger>
															</TabsList>
															<TabsContent value="preset" className="pt-4">
																<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
																	{presetAmounts.map((presetAmount) => (
																		<AmountButton
																			key={presetAmount}
																			amount={presetAmount}
																			isSelected={field.value === presetAmount}
																			onClick={() => field.onChange(presetAmount)}
																		/>
																	))}
																</div>
															</TabsContent>
															<TabsContent value="custom" className="space-y-4 pt-4">
																<FormLabel className="flex items-center">
																	<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
																		<path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
																		<path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
																		<path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12" />
																		<path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z" />
																	</svg>
																	Enter Amount (VND)
																</FormLabel>
																<div className="relative">
																	<Input
																		type="number"
																		placeholder="Enter deposit amount"
																		className="h-14 text-lg pl-12 pr-16 font-medium"
																		value={customAmount}
																		onChange={handleCustomAmountChange}
																		min="0" // HTML5 validation as extra security
																	/>
																	<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
																		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
																			<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
																		</svg>
																	</div>
																	<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
																		VND
																	</div>
																</div>

																<div className="flex items-center text-xs text-muted-foreground mt-1">
																	<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
																		<circle cx="12" cy="12" r="10" />
																		<path d="M12 16v-4M12 8h.01" />
																	</svg>
																	Minimum deposit amount is 50,000 VND
																</div>
															</TabsContent>
														</Tabs>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="paymentMethod"
											render={({ field }) => (
												<FormItem className="space-y-4">
													<FormLabel className="flex items-center text-lg font-medium">
														<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
															<path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
															<path d="M2 13v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6" />
															<path d="M2 13h20" />
														</svg>
														Select Payment Method
													</FormLabel>
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="grid gap-4"
														>
															{enhancedDepositMethods.map((method) => (
																<PaymentMethodOption
																	key={method.id}
																	method={method}
																	isSelected={field.value === method.id}
																	disabled={!method.isAvailable}
																	onSelect={() => method.isAvailable && field.onChange(method.id)}
																/>
															))}
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center">
														<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
															<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z" />
															<path d="M12 16v-4M12 8h.01" />
														</svg>
														Description (Optional)
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Enter a description for this deposit"
															className="h-12"
															{...field}
														/>
													</FormControl>
													<FormDescription className="flex items-center text-xs mt-1">
														<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
															<path d="m9 5 7 7-7 7" />
														</svg>
														Add a note to help you remember what this deposit is for
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Button
											type="submit"
											className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
											disabled={!form.formState.isValid || form.getValues().amount <= 0}
										>
											<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
												<path d="M10 14 12 12 10 10" />
												<path d="M12 12H3" />
												<path d="M9 18H20A2 2 0 0 0 22 16V8A2 2 0 0 0 20 6H9" />
											</svg>
											Continue to Deposit
										</Button>
									</form>
								</Form>
							</CardContent>
						</Card>

						{/* Transaction History - Pass memoized handler */}
						<TransactionHistory
							transactions={data?.data.transactions}
							totalItems={data?.data.total || 0}
							isLoading={isLoading}
							onPageChange={handlePageChange}
							pageSize={pageSize}
						/>
					</div>

					{/* Right Column - Tips & Info */}
					<DepositInfo />
				</div>
			</main>

			{/* Initial Confirmation Dialog */}
			<ConfirmationDialog
				open={showConfirm}
				onOpenChange={setShowConfirm}
				amount={String(form.getValues().amount)}
				method={form.getValues().paymentMethod}
				depositMethods={depositMethods}
				loading={loading}
				onConfirm={handleConfirm}
			/>

			{/* Payment Redirect Confirmation Dialog - Memoized component */}
			<PaymentRedirectDialog
				open={showPaymentConfirm}
				onOpenChange={setShowPaymentConfirm}
				paymentData={paymentData}
				countdown={countdown}
				onRedirectNow={handleRedirectNow}
			/>
		</motion.div>
	);
}

const methodIcons = {
	bank: (props: { className?: string }) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={props.className || "text-blue-500"}
		>
			<path d="M4 10V18M8 10V18M12 10V18M16 10V18M20 10V18" />
			<path d="M2 20h20M2 8h20M12 4L2 8M22 8L12 4" />
		</svg>
	),
	momo: (props: { className?: string }) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={props.className || "text-pink-500"}
		>
			<path d="M6 2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
			<path d="M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0M14 9a1 1 0 1 0 2 0 1 1 0 1 0-2 0M8 9a1 1 0 1 0 2 0 1 1 0 1 0-2 0M10 14a1 1 0 1 0 2 0 1 1 0 1 0-2 0" />
		</svg>
	),
	credit: (props: { className?: string }) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={props.className || "text-purple-500"}
		>
			<rect width="20" height="14" x="2" y="5" rx="2" />
			<line x1="2" x2="22" y1="10" y2="10" />
		</svg>
	)
};
