'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { vietnamCurrency } from '@/utils/converters';
import { Check } from 'lucide-react';

export default function ArtistPremium() {
    const premiumFeatures = [
        'Unlimited artworks',
        '24/7 priority support',
        'Customizable gallery',
        'Advanced analytics tools',
    ];

    return (
        <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-6xl mx-auto">
            <div className="text-center mb-4 md:mb-6">
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                    Artist Service Plans
                </h1>
                <p className="text-xs md:text-sm text-teal-600 dark:text-cyan-400 mt-1">
                    Elevate your artistic career with our exclusive service packages
                </p>
            </div>

            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                {/* Basic Plan */}
                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800">
                        <h2 className="text-base md:text-lg font-semibold text-emerald-700 dark:text-emerald-200">
                            Basic Plan
                        </h2>
                        <p className="text-xs md:text-sm text-teal-600 dark:text-teal-400">
                            Start your artistic journey
                        </p>
                    </CardHeader>
                    <CardContent className="p-3 md:p-6 space-y-4 md:space-y-6">
                        <div className="text-xl md:text-2xl font-bold text-center text-emerald-700 dark:text-emerald-200">
                            $0 <span className="text-xs md:text-sm font-normal text-gray-700 dark:text-gray-300">/month</span>
                        </div>
                        <ul className="space-y-2 md:space-y-3">
                            {['Up to 5 artworks', 'Basic support', 'Standard gallery'].map((feature) => (
                                <li key={feature} className="flex items-center space-x-2">
                                    <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                                    <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="p-3 md:p-6 pt-0">
                        <Button
                            className="w-full rounded-lg h-10 text-sm md:text-base border-emerald-200 dark:border-teal-600 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-teal-700/50"
                            variant="outline"
                        >
                            Current Plan
                        </Button>
                    </CardFooter>
                </Card>

                {/* Premium Plan */}
                <Card className="border-2 border-cyan-500 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="border-b border-cyan-500 py-2 md:py-3 bg-gradient-to-r from-cyan-50 to-teal-100 dark:from-cyan-900 dark:to-teal-800 relative">
                        <div className="absolute top-2 right-2 bg-cyan-200 dark:bg-cyan-700/50 text-cyan-700 dark:text-cyan-200 px-2 py-0.5 rounded-full text-xs font-medium">
                            Most Popular
                        </div>
                        <h2 className="text-base md:text-lg font-semibold text-cyan-700 dark:text-cyan-200">
                            Premium Plan
                        </h2>
                        <p className="text-xs md:text-sm text-teal-600 dark:text-teal-400">
                            For professional artists
                        </p>
                    </CardHeader>
                    <CardContent className="p-3 md:p-6 space-y-4 md:space-y-6">
                        <div className="text-xl md:text-2xl font-bold text-center text-cyan-700 dark:text-cyan-200">
                            {vietnamCurrency(60000)}{' '}
                            <span className="text-xs md:text-sm font-normal text-gray-700 dark:text-gray-300">/month</span>
                        </div>
                        <ul className="space-y-2 md:space-y-3">
                            {premiumFeatures.map((feature) => (
                                <li key={feature} className="flex items-center space-x-2">
                                    <Check className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
                                    <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="p-3 md:p-6 pt-0">
                        <Button className="w-full rounded-lg h-10 text-sm md:text-base bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md">
                            Upgrade Now
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}