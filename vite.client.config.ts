import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  define: {
    '__dirname': 'import.meta.dirname',
    'import.meta':{}
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/client-entry.ts'),
      name: 'icms-api-client',
      fileName: (format) => `icms-api.client.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['pino', 'pino-pretty', 'js-md5', 'crypto-js', 'next-server-context', 'h3', '@rock.chen/icms-http-client'],
      output: {
        globals: {
          'pino': 'pino',
          'pino-pretty': 'PinoPretty',
          'js-md5': 'md5',
          'crypto-js': 'CryptoJS',
          'next-server-context': 'next-server-context',
          'h3': 'h3',
          '@rock.chen/icms-http-client': 'icmsHttpClient',
        },
      }
    },
    outDir: 'dist',
    emptyOutDir: false
  },
  plugins: [
    dts({
      insertTypesEntry: false,
      outDir: 'dist/types',
      include: ['src/client-entry.ts', 'src/client.ts', 'src/types/**/*.ts'],
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.d.ts']
  }
})
