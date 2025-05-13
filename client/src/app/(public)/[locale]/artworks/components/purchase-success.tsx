import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Check, Download } from 'lucide-react';
import { Artwork } from '@/types/marketplace';

interface PurchaseSuccessProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    artwork: Artwork;
    onDownload: () => void;
}

const PurchaseSuccess: React.FC<PurchaseSuccessProps> = ({
    open,
    onOpenChange,
    artwork,
    onDownload
}) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-black border border-white/20 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Mua tranh thành công!</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/80">
                        <div className="text-center my-4 space-y-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                <Check className="h-8 w-8 text-green-500" />
                            </div>
                            <p>Cảm ơn bạn đã mua "{artwork.title}"</p>
                            <p className="text-sm">Bạn có thể tải ảnh chất lượng cao về máy ngay bây giờ.</p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-2">
                    <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border-0">
                        Đóng
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={onDownload} 
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Tải ảnh về máy
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default PurchaseSuccess; 