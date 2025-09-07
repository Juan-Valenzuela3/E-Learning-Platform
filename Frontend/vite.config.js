import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ command, mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, __dirname, '')

  // Log para debug
  console.log('🚀 Vite Config - Command:', command)
  console.log('🎯 Vite Config - Mode:', mode)
  console.log('📁 Vite Config - Environment:', env.NODE_ENV || 'development')

  return {
    plugins: [react()],
    css: {
      postcss: './postcss.config.js'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    // Exponer variables de entorno al cliente
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_APP_TITLE': JSON.stringify(env.VITE_APP_TITLE || 'EduPlatform'),
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:3000'),
      'process.env.VITE_DEBUG_MODE': JSON.stringify(env.VITE_DEBUG_MODE || 'true'),
      // Variables globales para el modo
      __DEV__: mode === 'development',
      __PROD__: mode === 'production'
    },
    // Configuración del servidor de desarrollo
    server: {
      port: 5173,
      open: true,
      host: true,
      // Configuración de proxy para APIs (descomenta si necesitas)
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:8000',
      //     changeOrigin: true,
      //     secure: false
      //   }
      // }
    },
    // Configuración de build
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            icons: ['lucide-react']
          }
        }
      }
    },
    // Optimizaciones de dependencias
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
    },
    // Configuración de preview
    preview: {
      port: 4173,
      open: true
    }
  }
})