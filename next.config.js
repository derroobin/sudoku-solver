/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en-GB'],
    defaultLocale: 'en-GB'
  }
}

module.exports = nextConfig
