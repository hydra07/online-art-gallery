'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Check, CreditCard } from 'lucide-react';
import { BANK_OPTIONS } from './withdrawal_form';

interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    amount: string;
    selectedBank: string;
    accountNumber: string;
    currentBalance: number;
    onConfirm: () => void;
    loading: boolean;
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    amount,
    selectedBank,
    accountNumber,
    currentBalance,
    onConfirm,
    loading
}: ConfirmationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='border-primary/20 sm:max-w-[425px]'>
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2 text-blue-500'>
                            <CreditCard className='h-6 w-6' />
                            Confirm Withdrawal
                        </DialogTitle>
                        <DialogDescription>
                            Please verify your withdrawal details
                        </DialogDescription>
                    </DialogHeader>

                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div className='text-muted-foreground font-medium'>
                                Amount:
                            </div>
                            <div className='font-semibold text-blue-500'>
                                {Number(amount).toLocaleString()} VND
                            </div>

                            <div className='text-muted-foreground font-medium'>
                                Bank:
                            </div>
                            <div className='font-semibold'>
                                {BANK_OPTIONS.find(b => b.id === selectedBank)?.name}
                            </div>

                            <div className='text-muted-foreground font-medium'>
                                Account:
                            </div>
                            <div className='font-semibold'>
                                {accountNumber}
                            </div>

                            <div className='text-muted-foreground font-medium'>
                                Remaining Balance:
                            </div>
                            <div className='font-semibold'>
                                {Math.max(0, currentBalance - Number(amount)).toLocaleString()} VND
                            </div>
                        </div>
                    </div>

                    <DialogFooter className='gap-2'>
                        <Button
                            variant='outline'
                            onClick={() => onOpenChange(false)}
                            className='flex-1 border-blue-500/20 hover:bg-blue-500/10'
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={loading}
                            className='flex-1 bg-green-600 hover:bg-green-700 text-white'
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: 'linear'
                                    }}
                                    className='h-5 w-5'
                                >
                                    <Check className='h-5 w-5' />
                                </motion.div>
                            ) : (
                                'Confirm Withdrawal'
                            )}
                        </Button>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
