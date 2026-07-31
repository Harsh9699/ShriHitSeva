import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        devOptions: {
          enabled: true
        },
        manifest: {
          name: 'Shri Hit Seva',
          short_name: 'Hit Seva',
          description: 'A dedicated application for followers of the Radhavallabh Sampradaya',
          theme_color: '#FFFDF8',
          background_color: '#FFFDF8',
          display: 'standalone',
          icons: [
            {
              src: 'logo-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'logo-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'logo-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5000000 // 5MB
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.MY_GEMINI_KEY || env.GEMINI_API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
