import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/plugin.tsx'),
      formats: ['es'],
      fileName: () => 'plugin.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom/client', '@toolbox/sdk'],
    },
  },
})
