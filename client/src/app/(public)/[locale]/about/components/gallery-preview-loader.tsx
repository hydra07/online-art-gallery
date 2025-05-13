'use client'
import { Html } from "@react-three/drei";

export function GalleryPreviewLoader() {
    return (
        <Html center>
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm z-10 transition-opacity duration-500 pointer-events-none">
                <div className="text-white">
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 backdrop-blur-lg rounded-2xl">
                        <div className="w-16 h-16 mb-4">
                            <svg className="animate-spin" viewBox="0 0 24 24">
                                <circle

                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        </div>
                        <div className="text-xl font-semibold mb-2">Loading</div>
                    </div>
                </div>
            </div>
        </Html>
    );
}