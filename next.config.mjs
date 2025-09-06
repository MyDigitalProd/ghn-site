/** @type {import('next').NextConfig} */
const nextConfig = {
	compress: true,
	poweredByHeader: false,
	images: {
		formats: ['image/avif', 'image/webp'],
	},
	async headers() {
		return [
			// Caching explicite pour les assets sous /img et /fonts
			{ source: '/img/:all*', headers: [ { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' } ] },
			{ source: '/fonts/:all*', headers: [ { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }, { key: 'Access-Control-Allow-Origin', value: '*' } ] },
		];
	},
};

export default nextConfig;
