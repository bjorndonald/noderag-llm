const path = require('path');

const bundleAnalyzer = require('@next/bundle-analyzer');
const million = require('million/compiler');

const appHeaders = require('./config/next/headers');
const redirects = require('./config/next/redirects');

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false,
});

/** @type {import('next').NextConfig} */

const defaultNextConfig = {
    swcMinify: true,
    reactStrictMode: true,
    compress: true,
    crossOrigin: 'anonymous',
    // experimental: {
    //     // ppr: true,
    //     // useLightningcss: true,
    //     // optimizePackageImports: ['react-tweet'],
    // },
    compiler: {
        removeConsole: {
            exclude: ['error', 'info']
        }
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'src/styles')]
    },
    images: {
        remotePatterns: [
            { hostname: 'bjorncode.dev' },
            { hostname: 'cloud.umami.is' },
            { hostname: 'unavatar.io' },
            { hostname: 'raw.githubusercontent.com' },
            { hostname: 'raw.githubusercontent.com' },
            { hostname: 'res.cloudinary.com' }
        ],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self': script-src 'none': sandbox;",
        formats: ['image/avif', 'image/webp'],
    },
    headers: () => appHeaders,
    redirects: () => redirects,
    // webpack: (config) => {
    //   config.plugins.push(new VeliteWebpackPlugin());
    //   return config;
    // },
}

const millionConfig = {
    mute: true,
    auto: { rsc: true },
    rsc: true
}

const config = withBundleAnalyzer(
    million.next(defaultNextConfig, millionConfig)
)

module.exports = defaultNextConfig
