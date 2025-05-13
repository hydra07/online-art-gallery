import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
export default function ConfirmationDialog({ isOpen, onClose, onConfirm, message }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full"
            >
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">{message}</p>
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={onClose}>No</Button>
                    <Button variant="destructive" onClick={onConfirm}>Yes</Button>
                </div>
            </motion.div>
        </motion.div>
    );
}