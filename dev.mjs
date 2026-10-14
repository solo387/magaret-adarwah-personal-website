import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'

if (existsSync('.env.local')) process.loadEnvFile('.env.local')

const scanner = spawn(process.execPath, ['site-scan-server.mjs'], { stdio: 'inherit' })
let vite
let shuttingDown = false

function stop(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  if (vite && vite.exitCode === null) vite.kill()
  if (scanner.exitCode === null) scanner.kill()
  process.exitCode = code
}

scanner.once('error', (error) => {
  console.error('Could not start the local public-site scanner.', error)
  stop(1)
})

scanner.once('exit', (code) => {
  if (!shuttingDown) {
    console.error(`The local public-site scanner stopped${code === null ? '' : ` with code ${code}`}.`)
    stop(code || 1)
  }
})

process.once('SIGINT', () => stop(0))
process.once('SIGTERM', () => stop(0))

async function waitForScanner() {
  const deadline = Date.now() + 10_000
  while (Date.now() < deadline && scanner.exitCode === null) {
    try {
      const response = await fetch('http://127.0.0.1:4174/health')
      if (response.ok) {
        const health = await response.json()
        if (health.service === 'coverpath-local-api' && health.ok === true) return
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }
  throw new Error('The scanner did not become ready on 127.0.0.1:4174.')
}

try {
  await waitForScanner()
  const args = process.argv.slice(2)
  const preview = args.includes('--preview')
  const viteArgs = args.filter((argument) => argument !== '--preview')
  vite = spawn(process.execPath, [
    'node_modules/vite/bin/vite.js',
    ...(preview ? ['preview'] : []),
    '--host',
    '127.0.0.1',
    ...viteArgs,
  ], { stdio: 'inherit' })
  vite.once('error', (error) => {
    console.error('Could not start Vite.', error)
    stop(1)
  })
  vite.once('exit', (code) => stop(code ?? 1))
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Could not start the app.')
  stop(1)
}
