import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Config Vitest — alias `@` aligné sur tsconfig pour importer `@/config/site`.
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') }
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node'
  }
});
