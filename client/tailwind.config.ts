/* eslint-disable @typescript-eslint/no-explicit-any */
import tailwindcssTypography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	safelist: [
		// Dynamic color classes used in NotArtistDisplay
		'hover:shadow-teal-500/10', 'dark:hover:shadow-teal-400/10', 'bg-teal-100', 'dark:bg-teal-900/40', 'text-teal-600', 'dark:text-teal-400', 'ring-teal-500/10', 'dark:ring-teal-400/10', 'from-teal-500/10',
		'hover:shadow-indigo-500/10', 'dark:hover:shadow-indigo-400/10', 'bg-indigo-100', 'dark:bg-indigo-900/40', 'text-indigo-600', 'dark:text-indigo-400', 'ring-indigo-500/10', 'dark:ring-indigo-400/10', 'from-indigo-500/10',
		'hover:shadow-amber-500/10', 'dark:hover:shadow-amber-400/10', 'bg-amber-100', 'dark:bg-amber-900/40', 'text-amber-600', 'dark:text-amber-400', 'ring-amber-500/10', 'dark:ring-amber-400/10', 'from-amber-500/10',
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Poppins']
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [
		tailwindcssAnimate,
		tailwindcssTypography,
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.bg-acrylic': {
					position: 'relative',
					background: 'rgba(255, 255, 255, 0.6)', // Màu nền mờ
					backdropFilter: 'blur(20px)', // Hiệu ứng mờ nhám
					WebkitBackdropFilter: 'blur(10px)', // Hỗ trợ trình duyệt WebKit
					boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ
					border: '1px solid rgba(255, 255, 255, 0.3)' // Đường viền mờ
				}
			});
		})
	]
};
export default config;
