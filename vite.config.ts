import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const DEFAULT_BASE_PATH = '/test-task-for-CarX-Technologies/';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || DEFAULT_BASE_PATH;

  return {
    plugins: [react()],
    base,
    server: {
      open: base
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
      env: {
        VITE_BASE_PATH: base
      },
      coverage: {
        provider: 'v8',
        reporter: ['text'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/test/**',
          'src/**/*.test.{ts,tsx}',
          'src/setupTests.ts',
          'src/index.tsx',
          'src/types/**',
          'src/vite-env.d.ts'
        ],
        thresholds: {
          lines: 70,
          functions: 70,
          branches: 60,
          statements: 70
        }
      }
    }
  };
});
