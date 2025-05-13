
// Payment types


// Animation constants
export const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

// Payment method definitions
export const depositMethods = [
    {
        id: 'bank',
        name: 'Bank Transfer',
        logo: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739295868/gallery/svg/bank.png',
        description: 'Transfer from your bank account'
    },
    {
        id: 'momo',
        name: 'MoMo E-Wallet',
        logo: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739295868/gallery/svg/momo.png',
        description: 'Pay using MoMo E-Wallet'
    },
    {
        id: 'credit',
        name: 'Credit/Debit Card',
        logo: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739295868/gallery/svg/credit-card.png',
        description: 'Pay using Visa, Mastercard, JCB'
    }
];

// Preset deposit amounts
export const presetAmounts = [
    50000,
    100000,
    200000,
    500000,
    1000000,
    2000000
];

// Payment icons by method ID (for consistent use across components)

// UI constants
export const UI_CONSTANTS = {
    COUNTDOWN_SECONDS: 5,
    REFETCH_INTERVAL_MS: 30000,
    STALE_TIME_MS: 15000,
    DEFAULT_PAGE_SIZE: 5,
};

// Enhanced deposit methods with availability information
export const getEnhancedDepositMethods = () => depositMethods.map(method => ({
    ...method,
    isAvailable: method.id === 'bank',
    description: method.id === 'bank'
        ? method.description
        : `${method.description} (Coming Soon)`
}));

// Format amount with thousands separator
export const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
};

// Format currency
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};
