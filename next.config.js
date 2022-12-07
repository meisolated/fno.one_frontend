/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { domains: ["picsum.photos", "randomuser.me", "fyers-user-details.s3.amazonaws.com"] }
}

module.exports = nextConfig
