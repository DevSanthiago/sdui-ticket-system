import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as { version: string }

function resolveVersion(): string {
  const [major, minor] = pkg.version.split('.')
  try {
    const commits = execSync('git rev-list --count HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
    return `${major}.${minor}.${commits}`
  } catch {
    return pkg.version
  }
}

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(resolveVersion()),
  },
})
