'use client';

import { CreditCard, History, Plus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const ACTIONS = [
  {
    href: '/wallet/deposit',
    title: 'Deposit',
    icon: Plus,
    desc: 'Add funds to your wallet',
    color: 'bg-green-500'
  },
  {
    href: '/wallet/payment',
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
    <div className='grid gap-6 md:grid-cols-3'>
      {ACTIONS.map(({ href, title, icon: Icon, desc, color }, idx) => (
        <Link key={idx} href={href}>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Card className={`transition-all hover:opacity-90 ${color} text-white`}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                <CardTitle className='text-lg font-medium'>
                  {title}
                </CardTitle>
                <Icon className='h-6 w-6' />
              </CardHeader>
              <CardContent>
                <CardDescription className='text-white/80'>
                  {desc}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
