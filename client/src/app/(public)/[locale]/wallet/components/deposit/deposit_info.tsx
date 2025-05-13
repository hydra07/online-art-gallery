'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    ShieldCheck,
} from 'lucide-react';

export function DepositInfo() {
    return (
        <Card className="border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    Deposit Information
                </CardTitle>
                <CardDescription>Important things to know</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Secure Transactions</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                        All deposits are processed using secure payment gateways with
                        end-to-end encryption.
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">Processing Time</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                        Online payments are instant. Bank transfers may take up to 24 hours
                        to reflect in your account.
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Minimum Deposit</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                        The minimum deposit amount is 50,000 VND. No transaction fees are charged.
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="font-medium">Need Help?</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                        If you encounter any issues, please contact our customer support at
                        support@example.com
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
