import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? '/countdown/'
    : '/',
  build: {
    outDir: './dist'
  },
  // Silence Sass deprecation warnings
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'color-functions',
          'if-function',
          'import',
          'global-builtin'
        ]
      }
    }
  }
})
