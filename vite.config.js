import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/Char0n.io/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                advisory: resolve(__dirname, 'advisory.html')
            }
        }
    }
})
