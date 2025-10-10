import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const GITHUB_REPO_NAME = 'MRIS-frt';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `/${GITHUB_REPO_NAME}/`,
})
