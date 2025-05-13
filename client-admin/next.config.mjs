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
				port: '3001',
				pathname: '**'
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com'
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com'
			},
			{
				protocol: 'https',
				hostname: 'google.com'
			},
			{
				protocol: 'https',
				hostname: 'fastly.picsum.photos'
			},
			{
				protocol: 'https',
				hostname: 'picsum.photos'
			}
		]
	},
	eslint: {
		ignoreDuringBuilds: true
	}
};

export default nextConfig;
