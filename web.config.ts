/**
 * Web Configuration for Ehsebo Sah
 * Enables web support for the mobile app
 */

export const webConfig = {
  // Enable web platform
  enabled: true,

  // Web-specific settings
  web: {
    // Output format for web
    output: 'static',

    // Favicon
    favicon: './assets/images/favicon.png',

    // Meta tags
    meta: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
      description: 'Ehsebo Sah - Budget Management App',
      keywords: 'budget, expense, management, calculator',
    },

    // PWA Configuration
    pwa: {
      enabled: true,
      name: 'Ehsebo Sah',
      shortName: 'Ehsebo',
      description: 'Budget Management App',
      startUrl: '/',
      display: 'standalone',
      backgroundColor: '#ffffff',
      themeColor: '#007AFF',
      icons: [
        {
          src: './assets/images/icon.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: './assets/images/icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },

    // Responsive design
    responsive: {
      breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
      },
    },

    // Performance optimizations
    optimization: {
      minify: true,
      sourceMap: false,
      splitChunks: true,
    },
  },

  // Browser support
  browserSupport: {
    chrome: '90+',
    firefox: '88+',
    safari: '14+',
    edge: '90+',
  },
};

export default webConfig;
