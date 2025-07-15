import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

import { name, version } from './package.json'

const withNextIntl = createNextIntlPlugin('./src/packages/libs/i18n/request.ts')

const nextConfig: NextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: false,
    env: {
        NEXT_PUBLIC_APP_NAME: name,
        NEXT_PUBLIC_APP_VERSION: version
    },

    // Если вы хотите быть уверены, что Next.js не будет
    // пытаться использовать Turbopack вместо Webpack:
    // выставьте флаг в package.json скрипте:
    //   "dev": "next dev --no-turbo"
    // или же просто не используйте `--experimental-turbopack`.

    webpack(config) {
        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))

        config.module.rules.push(
            // Reapply the existing rule, but only for svg imports ending in ?url
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/ // *.svg?url
            },
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: ['@svgr/webpack']
            }
        )

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i

        return config
    }
}

export default withNextIntl(nextConfig)
