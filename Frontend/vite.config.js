// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  // Configuración base del proxy (reutilizable)
  const backendProxyConfig = {
    target: env.VITE_API_URL, // ✅ viene siempre de .env
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path, // No elimines /api a menos que tu backend no lo espere
    timeout: 30000,
    configure: (proxy) => {
      proxy.on('error', (err) => console.error('Proxy error:', err))
      proxy.on('proxyReq', (proxyReq, req) => {
        console.log('➡️ Request:', req.method, req.url)
      })
      proxy.on('proxyRes', (proxyRes, req) => {
        console.log('⬅️ Response:', proxyRes.statusCode, req.url)
      })
    }
  }

  return {
    plugins: [
      react({
        fastRefresh: true,
        jsxRuntime: 'automatic',
        babel: {
          plugins: [
            mode === 'production' && 'babel-plugin-transform-react-remove-prop-types'
          ].filter(Boolean)
        }
      }),
      mode === 'analyze' && visualizer({
        open: true,
        filename: 'bundle-analyzer-report.html',
        gzipSize: true,
        brotliSize: true,
      })
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    },

    build: {
      target: 'esnext',
      minify: 'terser',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
            charts: ['recharts', 'chart.js'],
            icons: ['@heroicons/react', 'lucide-react', '@mui/icons-material']
          },
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]'
        },
        treeshake: true
      },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      }
    },

    server: {
      port: 5173,
      strictPort: true,
      host: true,
      hmr: { overlay: false },
      proxy: {
        '/api': backendProxyConfig,
        // Rutas específicas de autenticación que van al backend
        '/auth/login': backendProxyConfig,
        '/auth/validate': backendProxyConfig,
        // La ruta '/auth' sola (sin subrutas) es del frontend
      }
    },

    preview: {
      port: 4173,
      strictPort: true
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@mui/material',
        '@emotion/react',
        '@emotion/styled'
      ],
      entries: ['./src/main.jsx', './src/App.jsx']
    }
  }
})
