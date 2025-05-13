'use client';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import paymentService from '../queries';
// en/payment/code=00&id=9b7c126d692a4f1fa4a37a412d7ba3fa&cancel=false&status=PAID&orderCode=280503
export default function PaymentSuccess() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [paymentParams, setPaymentParams] = useState({
    paymentId: '',
    orderCode: '',
    status: '',
    code: '',
    cancel: ''
  });

  useEffect(() => {
    // Extract payment parameters from the URL
    const extractParams = () => {
      // First check standard query parameters
      const queryId = searchParams.get('id') || '';
      const queryOrderCode = searchParams.get('orderCode') || '';
      const queryStatus = searchParams.get('status') || '';
      const queryCode = searchParams.get('code') || '';
      const queryCancel = searchParams.get('cancel') || '';

      // If we have all query parameters, use them
      if (queryId && queryOrderCode && queryStatus) {
        setPaymentParams({
          paymentId: queryId,
          orderCode: queryOrderCode,
          status: queryStatus,
          code: queryCode,
          cancel: queryCancel
        });
        return;
      }

      // Otherwise, try to extract from path segments
      // For URL format: /en/payment/success/code=00&id=xxx&cancel=false&status=PAID&orderCode=xxx
      const pathSegments = pathname.split('/');
      const pathParamsSegment = pathSegments.find(segment => segment.includes('='));

      if (pathParamsSegment) {
        // Create a URLSearchParams object to easily parse the embedded query string
        const pathParams = new URLSearchParams(pathParamsSegment);

        setPaymentParams({
          paymentId: pathParams.get('id') || '',
          orderCode: pathParams.get('orderCode') || '',
          status: pathParams.get('status') || '',
          code: pathParams.get('code') || '',
          cancel: pathParams.get('cancel') || ''
        });
      }
    };

    extractParams();
  }, [pathname, searchParams]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['payment', paymentParams.paymentId, paymentParams.orderCode, paymentParams.status],
    queryFn: () => paymentService.verifyPayment(
      paymentParams.paymentId,
      paymentParams.orderCode,
      paymentParams.status
    ),
    enabled: Boolean(paymentParams.paymentId || paymentParams.orderCode || paymentParams.status),
  });

  useEffect(() => {
    if (data?.data?.paymentUrl) {
      toast({
        title: 'Success',
        description: 'Deposit successfully!',
        variant: 'success'
      });
      const timer = setTimeout(() => router.push('/wallet'), 3000);
      return () => clearTimeout(timer);
    } else if (error) {
      toast({
        title: 'Error',
        description: 'Payment verification failed. Please try again.',
        variant: 'destructive'
      });
    }
  }, [data, error, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-white">
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800">Verifying your payment...</h1>
            <p className="text-gray-600 mt-2">Please wait while we activate your premium subscription.</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="inline-block h-16 w-16 text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600">Payment Verification Failed</h1>
            <p className="text-gray-600 mt-2">We couldn't verify your payment. Please try again or contact support.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : data?.data?.paymentUrl ? (
          <div className="text-center">
            <div className="inline-block h-16 w-16 text-green-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
            <p className="text-gray-600 mt-2">Your premium subscription has been activated successfully.</p>
            <p className="text-gray-500 mt-1 text-sm">Redirecting to wallet...</p>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Payment Status Unknown</h1>
            <p className="text-gray-600 mt-2">We couldn't determine the status of your payment.</p>
            <button
              onClick={() => router.push('/wallet')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}