import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['3000-iw0nhizajx4e8kr05kkwh-5555d841.sg2.manus.computer'],
  },
})
