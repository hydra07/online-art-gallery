import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';
import { Artwork } from '@/types/marketplace';

interface PurchaseConfirmProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    artwork: Artwork;
    userBalance: number;
    onConfirm: () => void;
    isProcessing: boolean;
}

const PurchaseConfirm: React.FC<PurchaseConfirmProps> = ({
    open,
    onOpenChange,
    artwork,
    userBalance,
    onConfirm,
    isProcessing
}) => {
    const insufficientFunds = userBalance < artwork.price;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-black border border-white/20 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận mua tranh</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/80">
                        <div className="space-y-4 my-4">
                            <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                                <h3 className="font-medium mb-1">{artwork.title}</h3>
                                <p className="text-sm text-white/70">Nghệ sĩ: {artwork.artistId?.name || 'Không xác định'}</p>
                                <p className="text-xl font-bold mt-2">${artwork.price?.toLocaleString()}</p>
                            </div>
                            
                            <div className="bg-white/5 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span>Số dư hiện tại:</span>
                                    <span className="font-medium">${userBalance?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span>Sau khi mua:</span>
                                    <span className={`font-medium ${insufficientFunds ? 'text-red-400' : ''}`}>
                                        ${(userBalance - artwork.price)?.toLocaleString()}
                                    </span>
                                </div>
                                
                                {insufficientFunds && (
                                    <div className="mt-2 flex items-start gap-2 text-red-400 bg-red-400/10 p-2 rounded">
                                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm">Số dư không đủ để mua tranh này. Hãy nạp thêm tiền.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-2">
                    <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border-0">Hủy</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={onConfirm} 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        disabled={insufficientFunds || isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            'Xác nhận mua'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default PurchaseConfirm; 