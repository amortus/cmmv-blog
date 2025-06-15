import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import path from 'node:path'

export default defineConfig({
    plugins: [vue()],
    build: {
        ssr: true,
        outDir: 'dist',
        emptyOutDir: false,
        rollupOptions: {
            input: {
                'entry-server': path.resolve(__dirname, 'src/entry-server.ts'),
                'server': path.resolve(__dirname, 'server.ts'),
            },
            output: {
                entryFileNames: '[name].js'
            },
            external: ['vue', 'vue-router']
        },
    },
    resolve: {
        preserveSymlinks: true,
        alias: {
            '@cmmv/blog': path.resolve(__dirname, '../../packages/plugin/'),
            '@cmmv/affiliate': path.resolve(__dirname, '../../packages/affiliate/'),
            '@cmmv/odds': path.resolve(__dirname, '../../packages/odds/'),
            '@cmmv/newsletter': path.resolve(__dirname, '../../packages/newsletter/'),
            '@cmmv/football-predictions': path.resolve(__dirname, '../../packages/football-predictions/'),
        },
    },
})
