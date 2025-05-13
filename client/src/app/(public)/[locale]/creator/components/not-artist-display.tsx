'use client';
import React from 'react';
import { Brush, Eye, Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Adjust path as needed
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: 0.1,
            when: "beforeChildren", // Ensure container animates before children
            staggerChildren: 0.15, // Stagger animation of direct children (like title, subtitle, grid)
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const cardContainerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1, // Stagger the cards within the grid
        },
    },
};

const features = [
    { icon: Brush, color: 'teal', key: 'curate' },
    { icon: Eye, color: 'indigo', key: 'visibility' },
    { icon: Layers, color: 'amber', key: 'community' },
];

const NotArtistDisplay = () => {
    const t = useTranslations('not_artist_display');

    return (
        <div className="w-full min-h-screen flex items-center justify-center  px-4 sm:px-6 py-12 sm:py-20">
            <div className="relative max-w-5xl w-full"> {/* Increased max-width slightly */}
                {/* Abstract shapes - Slightly adjusted positions/sizes */}
                <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute top-40 right-10 w-48 h-48 rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-3xl animate-pulse-slow animation-delay-4000"></div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative backdrop-blur-lg bg-white/60 dark:bg-gray-800/60 rounded-3xl p-8 sm:p-12 border border-white/30 dark:border-gray-700/40 overflow-hidden"
                >
                    <div className="mb-10 sm:mb-12 text-center">


                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl sm:text-5xl font-extrabold mb-4  tracking-tight"
                        >
                            {t('title')}
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed"
                        >
                            {t('description')}
                        </motion.p>
                    </div>

                    {/* Enhanced Feature Cards */}
                    <motion.div
                        variants={cardContainerVariants} // Use separate variants for the grid container itself if needed for staggering
                        initial="hidden" // Inherits from parent, but explicit for clarity if standalone
                        animate="visible" // Inherits from parent
                        className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12"
                    >
                        {features.map((card) => (
                            <motion.div
                                key={card.key}
                                variants={cardVariants} // Individual card animation
                                className={`group relative p-6 sm:p-8 rounded-2xl border border-white/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-${card.color}-500/10 dark:hover:shadow-${card.color}-400/10 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br from-${card.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                <div className="relative z-10">
                                    <div className={`p-3 mb-4 rounded-xl bg-${card.color}-100 dark:bg-${card.color}-900/40 inline-flex ring-1 ring-inset ring-${card.color}-500/10 dark:ring-${card.color}-400/10`}>
                                        <card.icon size={24} className={`text-${card.color}-600 dark:text-${card.color}-400`} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                                        {t(`features.${card.key}.title`)}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {t(`features.${card.key}.description`)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Enhanced Button */}
                    <motion.div
                        variants={itemVariants} // Animate button appearance
                        className="flex justify-center"
                    >
                        <Button
                            asChild
                            size="lg" // Use a predefined larger size if available
                            className={`group relative px-8 py-3 text-base sm:text-lg font-semibold rounded-full bg-slate-500`}
                        >
                            <a href="/settings/profile">
                                <span className="relative z-10 flex items-center ">
                                    <span>{t('become_artist')}</span>
                                    <ArrowRight size={20} className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </span>
                                {/* Optional: Subtle shine effect on hover */}
                                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                            </a>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotArtistDisplay; // Added export for usability

// Add these to your tailwind.config.js or a global CSS file if needed:
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
*/

// NOTE: For the dynamic class names like `hover:shadow-${card.color}-500/10`,
// `bg-${card.color}-100`, etc., Tailwind CSS needs to know these classes exist
// *at build time*. If they are not working, you might need to:
// 1.  **List them explicitly:** Write the full class names somewhere in your project files
//     (even in comments) so Tailwind's scanner picks them up.
// 2.  **Safelist them:** Add them to the `safelist` option in your `tailwind.config.js`.
//     Example safelist:
//     safelist: [
//       'hover:shadow-teal-500/10', 'dark:hover:shadow-teal-400/10', 'bg-teal-100', 'dark:bg-teal-900/40', 'text-teal-600', 'dark:text-teal-400', 'ring-teal-500/10', 'dark:ring-teal-400/10', 'from-teal-500/10',
//       'hover:shadow-indigo-500/10', 'dark:hover:shadow-indigo-400/10', 'bg-indigo-100', 'dark:bg-indigo-900/40', 'text-indigo-600', 'dark:text-indigo-400', 'ring-indigo-500/10', 'dark:ring-indigo-400/10', 'from-indigo-500/10',
//       'hover:shadow-amber-500/10', 'dark:hover:shadow-amber-400/10', 'bg-amber-100', 'dark:bg-amber-900/40', 'text-amber-600', 'dark:text-amber-400', 'ring-amber-500/10', 'dark:ring-amber-400/10', 'from-amber-500/10',
//     ],