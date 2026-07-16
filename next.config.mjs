/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/dashboard/Supporter-home",
        destination: "/dashboard/supporter",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
