import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**", // Allows all paths under this hostname
      },
      // Add other hosts you use (e.g., your CDN, Cloudinary, etc.) here
    ],
  },
};

export default nextConfig;
