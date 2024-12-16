import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import manifest from './manifest.json' assert { type: 'json' };
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        react(),
        crx({ 
            manifest: {
                ...manifest,
                background: {
                    service_worker: 'src/background.ts',
                    type: 'module'
                }
            } 
        })
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: process.env.NODE_ENV === 'development',
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/popup/popup.html')
            },
            output: {
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    optimizeDeps: {
        include: ['react', 'react-dom']
    },
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            port: 5173
        }
    },
    esbuild: {
        loader: 'tsx',
        include: /src\/.*\.[tj]sx?$/,
        exclude: [],
    }
}); 