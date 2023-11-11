/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  swcMinify: true,
  images: { domains: ["picsum.photos", "randomuser.me", "fno.one", "myaccount-docs-prod.fyers.in"] },
}

module.exports = nextConfig
