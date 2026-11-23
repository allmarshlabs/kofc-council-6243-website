import react from '@vitejs/plugin-react'
import stylexUnplugin from '@stylexjs/unplugin'
import { defineConfig, type PluginOption } from 'vite'

// @stylexjs/unplugin's typings don't expose the default export's shape under
// bundler resolution, though it works at runtime; this cast only fixes types.
const stylex = stylexUnplugin as unknown as { vite: () => PluginOption }

// base './' keeps asset paths relative so the build works on GitHub Pages
// under a project path today and on a custom domain later.
// Only index.html is built; preview.html (all 3 variants) is dev-only.
export default defineConfig({
  base: './',
  plugins: [stylex.vite(), react()],
})
