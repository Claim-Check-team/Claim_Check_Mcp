/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/mcp',
        destination: `${backendUrl}/mcp`,
      },
      {
        source: '/mcp/:path*',
        destination: `${backendUrl}/mcp/:path*`,
      },
    ];
  },
};

export default nextConfig;
