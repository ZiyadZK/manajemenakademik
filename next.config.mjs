/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    },
    experimental: {
        serverActions: {
          bodySizeLimit: '5mb', // maximum `4.5MB/4MB` if you are using Vercel
        },
      },
};

export default nextConfig;
