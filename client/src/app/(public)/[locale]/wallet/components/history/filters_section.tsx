'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface FiltersSectionProps {
    isFiltersVisible: boolean;
    search: string;
    setSearch: (value: string) => void;
    type: string;
    setType: (value: string) => void;
    period: string;
    setPeriod: (value: string) => void;
}

export function FiltersSection({
    isFiltersVisible,
    search,
    setSearch,
    type,
    setType,
    period,
    setPeriod,
}: FiltersSectionProps) {
    const containerVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
        exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Card className="p-4 border-primary/20 mb-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Search Transactions</label>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by description"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Transaction Type</label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Transactions</SelectItem>
                                <SelectItem value="deposit">Deposits</SelectItem>
                                <SelectItem value="payment">Payments</SelectItem>
                                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Time Period</label>
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">Last 7 Days</SelectItem>
                                <SelectItem value="30days">Last 30 Days</SelectItem>
                                <SelectItem value="90days">Last 90 Days</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                                <SelectItem value="all">All Time</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
