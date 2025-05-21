/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/info',
                permanent: true,
            },
        ]
    }
};

export default nextConfig;
