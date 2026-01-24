import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        port: "",
        pathname: "/**", // allow all image paths
      },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "source.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "www.iconpacks.net", pathname: "/**" },
      { protocol: "https", hostname: "flagcdn.com", pathname: "/**" },
      { protocol: "https", hostname: "mainfacts.com", pathname: "/**" },
      { protocol: "https", hostname: "i.pravatar.cc", pathname: "/**" },
      { protocol: "https", hostname: "randomuser.me", pathname: "/**" },
      { protocol: "https", hostname: "pixabay.com", pathname: "/**" },

      {
        protocol: "https",
        hostname: "talesfromtheprfrontline.wordpress.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
    ],
  },
};

export default nextConfig;
