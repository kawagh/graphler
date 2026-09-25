import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 同梱するライブラリのライセンス一覧を dist/.vite/license.md に出力する
    license: true,
  },
})
