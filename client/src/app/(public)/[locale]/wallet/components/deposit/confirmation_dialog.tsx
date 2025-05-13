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
import { Check } from 'lucide-react';

interface DepositMethod {
    id: string;
    name: string;
    logo: string;
    description: string;
}

interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    amount: string;
    method: string;
    depositMethods: DepositMethod[];
    loading: boolean;
    onConfirm: () => void;
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    amount,
    method,
    depositMethods,
    loading,
    onConfirm
}: ConfirmationDialogProps) {
    const selectedMethod = depositMethods.find(m => m.id === method);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='border-primary/20 sm:max-w-[425px]'>
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2 text-green-500'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            Confirm Deposit
                        </DialogTitle>
                        <DialogDescription>
                            Please verify your deposit details
                        </DialogDescription>
                    </DialogHeader>

                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div className='text-muted-foreground font-medium'>
                                Amount:
                            </div>
                            <div className='font-semibold text-green-500'>
                                {Number(amount).toLocaleString()} VND
                            </div>

                            <div className='text-muted-foreground font-medium'>
                                Method:
                            </div>
                            <div className='font-semibold'>
                                {selectedMethod?.name}
                            </div>

                            <div className='text-muted-foreground font-medium'>
                                Processing Time:
                            </div>
                            <div className='font-semibold'>
                                Instant
                            </div>
                        </div>
                    </div>

                    <DialogFooter className='gap-2'>
                        <Button
                            variant='outline'
                            onClick={() => onOpenChange(false)}
                            className='flex-1 border-green-500/20 hover:bg-green-500/10'
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
                                'Confirm Deposit'
                            )}
                        </Button>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
