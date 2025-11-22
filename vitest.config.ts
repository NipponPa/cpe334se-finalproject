import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    include: ['tests/unit/**/*.test.{ts,tsx}', 'tests/integration/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        '.next/**',
        'coverage/**',
        'tests/**',
        'dist/**',
        '**/*.d.ts',
        '**/types/**',
        '**/index.ts',
        '**/components/ui/**',
        '**/supabase/**',
        '**/public/**',
        '**/docs/**',
        '**/memory-bank/**',
        '**/playwright-report/**',
        '**/test-results/**',
      ],
    },
    alias: {
      '@': resolve(__dirname, './src'),
      '@/lib': resolve(__dirname, './src/lib'),
      '@/components': resolve(__dirname, './src/components'),
      '@/contexts': resolve(__dirname, './src/contexts'),
      '@/app': resolve(__dirname, './src/app'),
      '@/utils': resolve(__dirname, './src/utils'),
    },
  },
});