'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { CreditCard, History, Plus } from 'lucide-react';
import Link from 'next/link';

const ACTIONS = [
    {
        href: '/wallet/deposit',
        title: 'Deposit',
        icon: Plus,
        desc: 'Add funds to your wallet',
        color: 'bg-green-500'
    },
    {
        href: '/wallet/withdraw',
        title: 'Withdraw',
        icon: CreditCard,
        desc: 'Make a payment',
        color: 'bg-blue-500'
    },
    {
        href: '/wallet/history',
        title: 'History',
        icon: History,
        desc: 'View transaction history',
        color: 'bg-gray-500'
    }
];

export function QuickActions() {
    return (
        <div className='grid gap-4 md:grid-cols-3'>
            {ACTIONS.map(({ href, title, icon: Icon, desc, color }, idx) => (
                <Link key={idx} href={href} className="block">
                    <Card 
                        className={`
                            ${color} text-white border-none shadow-lg 
                            transition-all duration-200 
                            hover:transform hover:-translate-y-1 hover:shadow-xl
                            hover:brightness-110
                        `}
                    >
                        <CardHeader className='flex flex-row items-center justify-between pb-2'>
                            <CardTitle className='text-xl font-semibold'>
                                {title}
                            </CardTitle>
                            <div className='p-2 rounded-full bg-white/10'>
                                <Icon className='h-5 w-5' />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className='text-white/90 text-sm'>
                                {desc}
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
