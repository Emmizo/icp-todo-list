/// <reference types="vite/client" />
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://ic0.app', // Your local DFX ICP canister backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
};