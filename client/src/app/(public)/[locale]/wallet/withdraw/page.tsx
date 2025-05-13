'use client';

import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { walletService } from '../queries';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { WithdrawForm, withdrawSchema } from '@/types/withdraw';
import { zodResolver } from '@hookform/resolvers/zod';
import bankRequestService from '@/service/bank-request';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "../deposit/constants";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { AlertCircle, ArrowRight, Wallet, CreditCard, CheckCircle2, Loader2, Building, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WithdrawalPage() {
    const { toast } = useToast();
    const [selectedPresetAmount, setSelectedPresetAmount] = useState<number | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [withdrawalStep, setWithdrawalStep] = useState(1);
    const [otherBankSelected, setOtherBankSelected] = useState(false);
    const router = useRouter();
    const [isComplete, setIsComplete] = useState(false);
    
    // Vietnamese banks list
    const vietnameseBanks = [
        "Vietcombank", 
        "BIDV", 
        "Agribank", 
        "Techcombank", 
        "VPBank", 
        "MBBank", 
        "ACB", 
        "Sacombank", 
        "TPBank", 
        "VIB", 
        "HDBank", 
        "OCB", 
        "SHB", 
        "SeABank", 
        "Eximbank", 
        "MSB", 
        "LienVietPostBank", 
        "VietinBank", 
        "Bac A Bank", 
        "PVcomBank"
    ];
    
    const form = useForm<WithdrawForm>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            bankName: '',
            bankAccountName: '',
            idBankAccount: '',
            amount: 0
        }
    });
    
    const { data, error, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['wallet'],
        queryFn: () => walletService.getWallet(),
        placeholderData: (previousData: unknown) => previousData,
        refetchOnWindowFocus: true
    });
    
    const currentBalance = data?.data?.balance || 0;
    const limitWithdraw = 100000000;
    const totalWithdrawals = data?.data?.totalWithdrawInDay || 0;
    const remainingWithdrawalLimit = limitWithdraw - totalWithdrawals;
    const presetAmounts = [500000, 1000000, 2000000, 5000000, 10000000];

    const mutation = useMutation({
        mutationFn: (data: WithdrawForm) => bankRequestService.createWithdrawRequest(data),
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Withdrawal request has been created successfully',
            });
            setWithdrawalStep(3);
            setIsComplete(true);
            // Don't reset form immediately to show details on success screen
            setTimeout(() => {
                form.reset();
                setSelectedPresetAmount(null);
                refetch();
            }, 500);
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: 'Unable to create withdrawal request',
                variant: 'destructive',
            });
            setWithdrawalStep(1);
            setShowConfirmation(false);
        }
    });
    
    const validateForm = () => {
        if (totalWithdrawals >= limitWithdraw) {
            toast({
                title: 'Daily Limit Reached',
                description: 'You have reached your daily withdrawal limit',
                variant: 'destructive',
            });
            return false;
        }
        
        const amount = form.getValues('amount');
        
        if (Number(amount) > currentBalance) {
            toast({
                title: 'Insufficient Balance',
                description: 'Withdrawal amount cannot exceed current balance',
                variant: 'destructive',
            });
            return false;
        }
        
        if (Number(amount) <= 0) {
            toast({
                title: 'Invalid Amount',
                description: 'Please enter an amount greater than 0',
                variant: 'destructive',
            });
            return false;
        }
        
        return true;
    };

    const handleProceedToConfirmation = async () => {
        const valid = await form.trigger();
        if (valid && validateForm()) {
            setShowConfirmation(true);
            setWithdrawalStep(2);
        }
    };
    
    const handleConfirm = () => {
        const values = form.getValues();
        mutation.mutate(values);
    };
    
    const handleCancel = () => {
        setShowConfirmation(false);
        setWithdrawalStep(1);
    };

    const handlePresetAmountClick = (amount: number) => {
        setSelectedPresetAmount(amount);
        form.setValue('amount', amount);
    };

    // Handle bank selection change
    const handleBankChange = (value: string) => {
        if (value === "other") {
            setOtherBankSelected(true);
            form.setValue("bankName", "");
        } else {
            setOtherBankSelected(false);
            form.setValue("bankName", value);
        }
    };
    
    if (isLoading) {
        return (
            <div className="container mx-auto py-20 flex justify-center items-center min-h-[60vh]">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg text-muted-foreground">Loading your wallet information...</p>
                </motion.div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-10 max-w-2xl">
            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Link href="/wallet" className="flex items-center mb-6 text-primary hover:text-primary/80 hover:translate-x-[-4px] transition-all duration-200">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    <span className="font-medium">Back to Wallet</span>
                </Link>
            </motion.div>
            
            {/* Progress Indicator */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                        <motion.div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${withdrawalStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                            animate={{ 
                                scale: withdrawalStep === 1 ? 1.1 : 1,
                                boxShadow: withdrawalStep === 1 ? '0 0 0 4px rgba(var(--primary), 0.2)' : 'none' 
                            }}
                        >
                            {withdrawalStep > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                        </motion.div>
                        <span className="text-sm mt-2 font-medium">Details</span>
                    </div>
                    <div className="h-1 flex-1 mx-2 bg-muted overflow-hidden">
                        <motion.div 
                            className="h-full bg-primary" 
                            initial={{ width: 0 }}
                            animate={{ width: withdrawalStep >= 2 ? "100%" : "0%" }}
                            transition={{ duration: 0.5 }}
                        ></motion.div>
                    </div>
                    <div className="flex flex-col items-center">
                        <motion.div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${withdrawalStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                            animate={{ 
                                scale: withdrawalStep === 2 ? 1.1 : 1,
                                boxShadow: withdrawalStep === 2 ? '0 0 0 4px rgba(var(--primary), 0.2)' : 'none' 
                            }}
                        >
                            {withdrawalStep > 2 ? <CheckCircle2 className="h-5 w-5" /> : "2"}
                        </motion.div>
                        <span className="text-sm mt-2 font-medium">Confirm</span>
                    </div>
                    <div className="h-1 flex-1 mx-2 bg-muted overflow-hidden">
                        <motion.div 
                            className="h-full bg-primary" 
                            initial={{ width: 0 }}
                            animate={{ width: withdrawalStep >= 3 ? "100%" : "0%" }}
                            transition={{ duration: 0.5 }}
                        ></motion.div>
                    </div>
                    <div className="flex flex-col items-center">
                        <motion.div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${withdrawalStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                            animate={{ 
                                scale: withdrawalStep === 3 ? 1.1 : 1,
                                boxShadow: withdrawalStep === 3 ? '0 0 0 4px rgba(var(--primary), 0.2)' : 'none' 
                            }}
                        >
                            {isComplete ? <CheckCircle2 className="h-5 w-5" /> : "3"}
                        </motion.div>
                        <span className="text-sm mt-2 font-medium">Complete</span>
                    </div>
                </div>
            </motion.div>
            
            {/* Wallet Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <Card className="mb-6 shadow-md hover:shadow-lg transition-all duration-300 border-primary/10 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-primary" />
                            <CardTitle className="text-2xl">Wallet Balance</CardTitle>
                        </div>
                        <CardDescription>Current amount in your account</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <motion.p 
                            className="text-3xl font-bold text-primary"
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {formatCurrency(currentBalance)}
                        </motion.p>
                        {remainingWithdrawalLimit < limitWithdraw && (
                            <p className="text-sm text-muted-foreground mt-2 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                                Daily withdrawal limit remaining: {formatCurrency(remainingWithdrawalLimit)}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
            
            {/* Content based on step */}
            <AnimatePresence mode="wait">
                {withdrawalStep === 3 && isComplete ? (
                    /* Success/Completion Screen */
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card className="shadow-md border-primary/10 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-200/50">
                                <div className="flex flex-col items-center text-center pb-2">
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 260, 
                                            damping: 20,
                                            delay: 0.2 
                                        }}
                                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                                    >
                                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                                    </motion.div>
                                    <CardTitle className="text-2xl text-green-700">Withdrawal Successful</CardTitle>
                                    <CardDescription className="text-green-600">
                                        Your withdrawal request has been submitted successfully
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 pb-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm border-b pb-4 border-muted">
                                        <p className="font-medium text-muted-foreground">Bank Name:</p>
                                        <p>{form.getValues('bankName')}</p>
                                        
                                        <p className="font-medium text-muted-foreground">Account Holder:</p>
                                        <p>{form.getValues('bankAccountName')}</p>
                                        
                                        <p className="font-medium text-muted-foreground">Account Number:</p>
                                        <p>{form.getValues('idBankAccount')}</p>
                                        
                                        <p className="font-medium text-muted-foreground pt-2 border-t">Amount to Withdraw:</p>
                                        <p className="font-semibold text-primary pt-2 border-t">{formatCurrency(form.getValues('amount'))}</p>
                                        
                                        <p className="font-medium text-muted-foreground">Current Balance:</p>
                                        <p>{formatCurrency(currentBalance)}</p>
                                        
                                        <p className="font-medium text-muted-foreground">New Balance After Withdrawal:</p>
                                        <p>{formatCurrency(currentBalance - form.getValues('amount'))}</p>
                                    </div>
                                    
                                    <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
                                        <AlertCircle className="h-4 w-4 text-blue-500" />
                                        <AlertTitle>Processing Time</AlertTitle>
                                        <AlertDescription className="text-blue-700">
                                            Your withdrawal request is now being processed. This typically takes 1-3 business days.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center pt-2 pb-6 px-6">
                                <Button 
                                    onClick={() => router.push('/wallet')}
                                    className="py-5 px-8 text-md font-medium"
                                >
                                    Return to Wallet
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ) : (
                    /* Withdrawal Form Card (Steps 1-2) */
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-primary/10 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                                <div className="flex items-center gap-2">
                                    <Building className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-2xl">
                                        {withdrawalStep === 1 ? "Withdraw Money" : "Confirm Withdrawal"}
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    {withdrawalStep === 1 
                                        ? "Enter your details to withdraw money to your bank account"
                                        : "Please review your withdrawal request details"
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {currentBalance <= 0 && (
                                    <Alert variant="destructive" className="mb-6">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Insufficient Balance</AlertTitle>
                                        <AlertDescription>
                                            Your wallet balance is not enough to make a withdrawal
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {totalWithdrawals >= limitWithdraw && (
                                    <Alert variant="destructive" className="mb-6">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Withdrawal Limit Exceeded</AlertTitle>
                                        <AlertDescription>
                                            You have reached your daily withdrawal limit
                                        </AlertDescription>
                                    </Alert>
                                )}
                                
                                <AnimatePresence mode="wait">
                                    {!showConfirmation ? (
                                        <motion.div
                                            key="form-details"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Form {...form}>
                                                <form className="space-y-5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="bankName"
                                                            render={({ field }) => (
                                                                <FormItem className="flex flex-col">
                                                                    <FormLabel className="font-medium flex items-center gap-1.5">
                                                                        <Building className="h-4 w-4 text-primary" />
                                                                        Bank Name
                                                                    </FormLabel>
                                                                    <Select 
                                                                        onValueChange={handleBankChange}
                                                                        defaultValue={field.value || ""}
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger className="focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 border-muted">
                                                                                <SelectValue placeholder="Select your bank" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {vietnameseBanks.map(bank => (
                                                                                <SelectItem key={bank} value={bank}>
                                                                                    {bank}
                                                                                </SelectItem>
                                                                            ))}
                                                                            <SelectItem value="other">Other (specify)</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {otherBankSelected && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, height: 0 }}
                                                                            animate={{ opacity: 1, height: 'auto' }}
                                                                            exit={{ opacity: 0, height: 0 }}
                                                                        >
                                                                            <Input
                                                                                className="mt-2 focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 border-muted"
                                                                                placeholder="Enter bank name"
                                                                                {...field}
                                                                            />
                                                                        </motion.div>
                                                                    )}
                                                                    <FormDescription>
                                                                        Select your bank from the list or choose "Other"
                                                                    </FormDescription>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        
                                                        <FormField
                                                            control={form.control}
                                                            name="bankAccountName"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="font-medium flex items-center gap-1.5">
                                                                        <CreditCard className="h-4 w-4 text-primary" />
                                                                        Account Holder Name
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input 
                                                                            placeholder="Enter account holder name" 
                                                                            {...field} 
                                                                            className="focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 border-muted"
                                                                        />
                                                                    </FormControl>
                                                                    <FormDescription>
                                                                        As it appears on your bank account
                                                                    </FormDescription>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    
                                                    <FormField
                                                        control={form.control}
                                                        name="idBankAccount"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="font-medium flex items-center gap-1.5">
                                                                    <CreditCard className="h-4 w-4 text-primary" />
                                                                    Account Number
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input 
                                                                        placeholder="Enter account number" 
                                                                        {...field} 
                                                                        className="focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 border-muted"
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    Your bank account number (no spaces)
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    
                                                    <FormField
                                                        control={form.control}
                                                        name="amount"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="font-medium flex items-center gap-1.5">
                                                                    <Wallet className="h-4 w-4 text-primary" />
                                                                    Withdrawal Amount
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input 
                                                                        type="number" 
                                                                        placeholder="Enter amount to withdraw" 
                                                                        {...field} 
                                                                        onChange={(e) => {
                                                                            field.onChange(Number(e.target.value));
                                                                            setSelectedPresetAmount(null);
                                                                        }}
                                                                        className="focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 border-muted"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                                <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-muted-foreground mt-1.5 gap-1">
                                                                    <span className="flex items-center">
                                                                        <Wallet className="h-3.5 w-3.5 mr-1" />
                                                                        Available: {formatCurrency(currentBalance)}
                                                                    </span>
                                                                    {remainingWithdrawalLimit < limitWithdraw && (
                                                                        <span className="flex items-center">
                                                                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                                                            Daily limit: {formatCurrency(remainingWithdrawalLimit)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div>
                                                        <p className="text-sm font-medium mb-2 flex items-center">
                                                            <Wallet className="h-4 w-4 mr-1.5 text-primary" />
                                                            Quick amount selection:
                                                        </p>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                            {presetAmounts.map((amount) => (
                                                                <Button 
                                                                    key={amount}
                                                                    type="button"
                                                                    variant={selectedPresetAmount === amount ? "default" : "outline"}
                                                                    onClick={() => handlePresetAmountClick(amount)}
                                                                    disabled={amount > currentBalance || totalWithdrawals >= limitWithdraw}
                                                                    className="transition-all hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                                                                >
                                                                    {formatCurrency(amount)}
                                                                </Button>
                                                            ))}
                                                            {currentBalance > 0 && (
                                                                <Button 
                                                                    type="button"
                                                                    variant={selectedPresetAmount === currentBalance ? "default" : "outline"}
                                                                    onClick={() => handlePresetAmountClick(currentBalance)}
                                                                    disabled={totalWithdrawals >= limitWithdraw}
                                                                    className="transition-all hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                                                                >
                                                                    Max ({formatCurrency(currentBalance)})
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <Separator className="my-4" />
                                                </form>
                                            </Form>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="confirm-details"
                                            className="space-y-6"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Alert variant="default" className="bg-primary/5 border-primary/20">
                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                                <AlertTitle>Confirm Your Withdrawal</AlertTitle>
                                                <AlertDescription>
                                                    Please verify the information below before confirming
                                                </AlertDescription>
                                            </Alert>
                                            
                                            <div className="space-y-4">
                                                <div className="rounded-md border border-muted p-4 bg-muted/5">
                                                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                                                        <p className="font-medium text-muted-foreground">Bank Name:</p>
                                                        <p className="font-medium">{form.getValues('bankName')}</p>
                                                        
                                                        <p className="font-medium text-muted-foreground">Account Holder:</p>
                                                        <p className="font-medium">{form.getValues('bankAccountName')}</p>
                                                        
                                                        <p className="font-medium text-muted-foreground">Account Number:</p>
                                                        <p className="font-medium">{form.getValues('idBankAccount')}</p>
                                                        
                                                        <p className="font-medium text-muted-foreground pt-2 border-t">Amount to Withdraw:</p>
                                                        <p className="font-semibold text-primary pt-2 border-t">{formatCurrency(form.getValues('amount'))}</p>
                                                        
                                                        <p className="font-medium text-muted-foreground">Current Balance:</p>
                                                        <p className="font-medium">{formatCurrency(currentBalance)}</p>
                                                        
                                                        <p className="font-medium text-muted-foreground">New Balance After Withdrawal:</p>
                                                        <p className="font-medium">{formatCurrency(currentBalance - form.getValues('amount'))}</p>
                                                    </div>
                                                </div>
                                                
                                                <Alert className="bg-blue-50 border-blue-200">
                                                    <AlertCircle className="h-4 w-4 text-blue-600" />
                                                    <AlertTitle className="text-blue-800">Processing Time</AlertTitle>
                                                    <AlertDescription className="text-blue-700">
                                                        Withdrawal requests are typically processed within 1-3 business days.
                                                    </AlertDescription>
                                                </Alert>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6 px-6">
                                {!showConfirmation ? (
                                    <Button 
                                        type="button" 
                                        className="w-full py-6 text-lg font-medium group"
                                        disabled={isLoading || currentBalance <= 0 || totalWithdrawals >= limitWithdraw}
                                        onClick={handleProceedToConfirmation}
                                    >
                                        Continue to Review 
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                ) : (
                                    <>
                                        <Button 
                                            variant="outline" 
                                            className="w-full sm:w-1/2 py-6 text-lg font-medium"
                                            onClick={handleCancel}
                                            disabled={mutation.isPending}
                                        >
                                            <ArrowLeft className="mr-2 h-5 w-5" />
                                            Go Back
                                        </Button>
                                        <Button 
                                            type="button" 
                                            className="w-full sm:w-1/2 py-6 text-lg font-medium"
                                            disabled={mutation.isPending}
                                            onClick={handleConfirm}
                                        >
                                            {mutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Confirm Withdrawal
                                                    <CheckCircle2 className="ml-2 h-5 w-5" />
                                                </>
                                            )}
                                        </Button>
                                    </>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}