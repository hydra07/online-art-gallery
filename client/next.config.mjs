import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.googleusercontent.com',
				port: '',
				pathname: '**'
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3000',
				pathname: '**'
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com'
			},
			{
				protocol: 'https',
				hostname: 'picsum.photos'
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com'
			},
			{
				protocol: 'https',
				hostname: 'fastly.picsum.photos'
			}
		]
	},
	experimental: {},
	eslint: {
		ignoreDuringBuilds: true
	},
	transpilePackages: ['three'],
	webpack: (config) => {
		config.cache = false;
		return config;
	}
};

export default withNextIntl(nextConfig);
