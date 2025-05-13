import { useState } from "react";
import useAuthClient from "@/hooks/useAuth-client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc"; // Icon Google từ react-icons
import { motion } from "framer-motion"; // Animation với framer-motion

export const AuthDialog = ({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const onGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn('google');
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <DialogHeader className="space-y-4">
                        <DialogTitle className="text-2xl font-bold text-center text-gray-800">
                            Đăng nhập để khám phá
                        </DialogTitle>
                        <p className="text-center text-gray-500 text-sm">
                            Sử dụng tài khoản Google để truy cập mọi tính năng
                        </p>
                    </DialogHeader>
                    <div className="mt-6 flex justify-center">
                        <Button
                            onClick={onGoogleLogin}
                            disabled={isLoading}
                            className="group relative w-full max-w-xs overflow-hidden bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-300 ease-in-out"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center space-x-2 py-2"
                            >
                                <FcGoogle className="w-5 h-5" />
                                <span className="font-medium">
                                    {isLoading ? "Đang xử lý..." : "Đăng nhập với Google"}
                                </span>
                            </motion.div>
                            {/* Hiệu ứng hover */}
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mt-4 text-center text-xs text-gray-400"
                    >
                        Đảm bảo trải nghiệm an toàn và nhanh chóng
                    </motion.div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
    
};