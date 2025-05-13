'use client';

import { AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

import { BalanceSummary } from '../components/history/balance_summary';
import { FiltersSection } from '../components/history/filters_section';
import { NetChangeAlert } from '../components/history/net_change_alert';
import { SectionHeader } from '../components/section_header';
import { TransactionList } from '../components/transactions/transaction_list';
import { transactions } from './data';

export default function HistoryPage() {
	const [search, setSearch] = useState('');
	const [type, setType] = useState('all');
	const [period, setPeriod] = useState('7days');
	const [isFiltersVisible, setIsFiltersVisible] = useState(true);

	const accountStats = useMemo(() => {
		const initialBalance = transactions[0]?.balance || 0;
		const finalBalance = transactions[transactions.length - 1]?.balance || 0;

		const totalIncome = transactions
			.filter((t) => t.type === 'deposit')
			.reduce((sum, t) => sum + t.amount, 0);

		const totalExpense = Math.abs(
			transactions
				.filter((t) => t.type === 'payment')
				.reduce((sum, t) => sum + t.amount, 0)
		);

		const netChange = finalBalance - initialBalance;

		return {
			initialBalance,
			finalBalance,
			totalIncome,
			totalExpense,
			netChange
		};
	}, []);

	const filteredTransactions = useMemo(() => {
		return transactions.filter((transaction) => {
			if (type !== 'all' && transaction.type !== type) return false;
			return (
				search.toLowerCase() === '' ||
				transaction.description
					.toLowerCase()
					.includes(search.toLowerCase())
			);
		});
	}, [search, type]);
	const mappedFilteredTransactions = useMemo(() => {
		return filteredTransactions.map(transaction => {
			// Map status values
			let mappedStatus: "PENDING" | "PAID" | "FAILED";
			if (transaction.status === "pending") {
				mappedStatus = "PENDING";
			} else if (transaction.status === "success") {
				mappedStatus = "PAID"; // Not just uppercase, different term
			} else {
				mappedStatus = "FAILED";
			}

			return {
				...transaction,
				type: transaction.type.toUpperCase() as "DEPOSIT" | "WITHDRAWAL" | "PAYMENT",
				status: mappedStatus
			};
		});
	}, [filteredTransactions]);
	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
			<SectionHeader
				title="Transaction History"
				// rightContent={
				// 	<button
				// 		onClick={() => setIsFiltersVisible(!isFiltersVisible)}
				// 		className="text-sm font-medium text-blue-500 hover:text-blue-700"
				// 	>
				// 		{isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
				// 	</button>
				// }
			/>

			<main className='container mx-auto max-w-7xl py-8 px-4'>
				{/* <section className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8'>
					<BalanceSummary accountStats={accountStats} />

					{accountStats.netChange !== 0 && (
						<NetChangeAlert netChange={accountStats.netChange} />
					)}
				</section>

				<AnimatePresence>
					{isFiltersVisible && (
						<FiltersSection
							isFiltersVisible={isFiltersVisible}
							search={search}
							setSearch={setSearch}
							type={type}
							setType={setType}
							period={period}
							setPeriod={setPeriod}
						/>
					)}
				</AnimatePresence> */}
				<TransactionList
					// transactions={mappedFilteredTransactions}
					showCard={true}
					title="All Transactions"
				/>
			</main>
		</div>
	);
}
