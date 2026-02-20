/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Disable error overlay in production
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn']
        } : false,
    },
    // Disable dev overlay errors in production
    devIndicators: {
        buildActivity: false,
    },
};

export default nextConfig;
