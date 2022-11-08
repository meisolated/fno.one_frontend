/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { domains: ["picsum.photos", "randomuser.me"] }
}

module.exports = nextConfig
