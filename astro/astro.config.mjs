// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  vite: {
    server: {
      proxy: {
        '/api': 'http://localhost:5000'
      }
    }
  }
});