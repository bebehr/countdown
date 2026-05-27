import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? '/countdown/' : '/',
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
  }
})
