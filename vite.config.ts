import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from './tailwind.config.ts'; // Import your Tailwind config
import autoprefixer from 'autoprefixer';
import postcssConfig from './postcss.config.ts'; // Import your PostCSS config

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss, // Use the imported Tailwind config
        autoprefixer,
        ...postcssConfig.plugins, // Spread in the plugins from PostCSS config
      ],
    },
  },
});
