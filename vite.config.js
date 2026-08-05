import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],

  build: {
    // The site is a demonstration of RELAT's technical quality. If a chunk
    // crosses this line, that is a decision to make deliberately — not a
    // warning to scroll past.
    chunkSizeWarningLimit: 150,
    cssMinify: 'lightningcss',
  },
});
