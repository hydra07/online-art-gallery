'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorCard() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <Card className="w-[400px] shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold text-red-600">
                    Authentication Error
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 text-center px-4 py-2">
                    {error === 'AccessDenied'
                        ? 'Access denied. This application is for administrators only.'
                        : 'An error occurred during authentication.'}
                </p>
            </CardContent>
        </Card>
    );
}

export default function AuthError() {
    return (
        <div className="h-screen w-screen flex items-center justify-center p-4 bg-gray-50 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Suspense fallback={
                <Card className="w-[400px] shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-semibold">
                            Loading...
                        </CardTitle>
                    </CardHeader>
                </Card>
            }>
                <ErrorCard />
            </Suspense>
        </div>
        </div>
    );
}