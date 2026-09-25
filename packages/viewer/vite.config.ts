import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // CLI の配信でもファイル単体でも開けるよう、アセットを相対パスで参照する
  base: './',
  plugins: [react()],
  build: {
    // 同梱するライブラリのライセンス一覧を dist/.vite/license.md に出力する
    license: true,
  },
})
