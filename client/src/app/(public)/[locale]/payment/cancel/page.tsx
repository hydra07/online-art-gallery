'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentCancel() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your payment has been cancelled.</p>
          <Button className="mt-4" onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}