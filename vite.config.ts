import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/migrador-dados-erp/',
  plugins: [react()],
})
