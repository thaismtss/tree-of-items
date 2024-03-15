import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
 
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: "./test/setup.ts",
    coverage: {
        all: true,
        include: ["app/**"]
    },
    alias: {
      "@": path.resolve(__dirname, "."),
    }
  },
})