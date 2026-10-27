#!/usr/bin/env node
// 把本插件以 link 方式装进 DSH 桌面端 web profile，用于本地测试。
// 用法：node install-to-profile.mjs
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const PROFILE = '/Users/kumada-lab/Library/Application Support/dsh-desktop/harness/profiles/web'
const WORKSPACE = '/Users/kumada-lab/Workspace/dsh-theme-calabiyau'
const PKG = path.join(PROFILE, 'package.json')
const PNPM = '/Users/kumada-lab/Library/Application Support/dsh-desktop/harness/.desktop-bin/pnpm'

if (!fs.existsSync(PKG)) {
  console.error('找不到 profile package.json:', PKG)
  process.exit(1)
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-')
for (const f of ['package.json', 'cordis.patch.yml', 'pnpm-lock.yaml']) {
  const src = path.join(PROFILE, f)
  if (fs.existsSync(src)) fs.copyFileSync(src, `${src}.bak-${stamp}`)
}
console.log('已备份 package.json / cordis.patch.yml / pnpm-lock.yaml（.bak-' + stamp + '）')

const pkg = JSON.parse(fs.readFileSync(PKG, 'utf8'))
console.log('改动前 dependencies:', JSON.stringify(pkg.dependencies))
console.log('改动前 bundles:', JSON.stringify(pkg.dsh?.profile?.bundles))

const link = `link:${WORKSPACE}`
if (pkg.dependencies['dsh-theme-calabiyau'] !== link) {
  pkg.dependencies['dsh-theme-calabiyau'] = link
}
const bundles = pkg.dsh.profile.bundles ?? []
if (!bundles.includes('dsh-theme-calabiyau')) {
  bundles.push('dsh-theme-calabiyau')
  pkg.dsh.profile.bundles = bundles
}

fs.writeFileSync(PKG, JSON.stringify(pkg, null, 2) + '\n')
console.log('改动后 dependencies:', JSON.stringify(pkg.dependencies))
console.log('改动后 bundles:', JSON.stringify(pkg.dsh?.profile?.bundles))

console.log('\n>>> 运行 pnpm install ...')
execFileSync(PNPM, ['install'], { cwd: PROFILE, stdio: 'inherit' })

const linkPath = path.join(PROFILE, 'node_modules', 'dsh-theme-calabiyau')
console.log('\n>>> 验证 node_modules 链接:')
if (fs.existsSync(linkPath)) {
  const real = fs.realpathSync(linkPath)
  console.log('  node_modules/dsh-theme-calabiyau ->', real)
  const ok = real === WORKSPACE
  console.log(ok ? '  ✔ 链接指向工作区，正确' : '  ✘ 链接指向异常:', real)
  process.exit(ok ? 0 : 1)
} else {
  console.log('  ✘ 未找到链接，安装可能失败')
  process.exit(1)
}
