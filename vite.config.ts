import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths allow deployment at either a domain root or GitHub Pages project path.
  base: './',
});
