/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'], // Google profile pictures
    unoptimized: true, // Allow external images
  },
}

module.exports = nextConfig
